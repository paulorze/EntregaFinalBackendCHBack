import { errorsEnum } from "../config/enums.js";
import CustomError from "../middlewares/errors/CustomError.js";
import { generateProductNotFoundErrorInfo, generateUnhandledErrorInfo } from "../middlewares/errors/error.info.js";
import { createPaymentIntentService } from "../services/payments.service.js";
import { getProductById } from "../services/products.service.js";

const createPaymentIntentStripe = async (req, res) => {
    const {products, userData} = req.body;
    let amount = 0;
    let foundProducts = [];
    for (const product in products) {
            const foundProduct = await getProductById(products[product]._id);
            if (!foundProduct) {
                throw CustomError.createError({
                    name: 'Object Not Found Error',
                    cause: generateProductNotFoundErrorInfo(),
                    message: 'Error 404: Object Not Found.',
                    code: errorsEnum.NOT_FOUND_ERROR
                });
            };
            amount += foundProduct.price * +products[product].quantity;
            foundProducts.push({name: foundProduct.title, quantity: products[product].quantity});
    };

    const paymentIntentInfo = {
        amount : amount * 100,
        currency: 'usd',
        metadata: {
            userId: userData._id,
            userName: userData.name,
            userEmail: userData.email,
            orderDetails: JSON.stringify(foundProducts, null, '\t'),
            address: JSON.stringify({
                address: userData.address,
                postalCode: userData.postalCode
            })
        }
    };

    try {
        const result = await createPaymentIntentService(paymentIntentInfo);
        res.send({status: 'success', result});
    } catch (error) {
        req.logger.error('Unhandled Error: Unexpected Error Occurred.');
        throw CustomError.createError({
            name: 'Unhandled Error',
            cause: generateUnhandledErrorInfo(),
            message: 'Something unexpected happened.',
            code: errorsEnum.UNHANDLED_ERROR
        });
    };
};

export {
    createPaymentIntentStripe
};