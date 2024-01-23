import { errorsEnum } from '../config/enums.js';
import CustomError from '../middlewares/errors/CustomError.js';
import { generateCartAddProductArrayErrorInfo, generateCartAddProductErrorInfo, generateCartDeleteProductErrorInfo, generateMissingEmailErrorInfo, generateProductFieldValidationErrorInfo, generateProductNotFoundErrorInfo, generateServerErrorInfo, generateUnauthorizedErrorInfo, generateUnhandledErrorInfo } from '../middlewares/errors/error.info.js';
import { getCarts, getCartByEmail, saveCart, deleteCart, addCartProduct, deleteCartProduct, addCartProductsArray, completePurchase } from '../services/carts.service.js';
import { getProductById } from '../services/products.service.js';

const getAllCarts = async (req, res) => {
    const {limit, page} = req.query;
    let result = [];
    try {
        if (limit && page) {
            result = await getCarts(limit);
        } else {
            result = await getCarts();
        };
        res.send({ status: 'success', result });
    } catch (e) {
        switch (e.code) {
            case errorsEnum.DATABASE_ERROR:
                req.logger.fatal('Fatal Error: Database Failure.');
                throw e
            case errorsEnum.VALIDATION_ERROR:
                req.logger.info('Validation Error: Sent Values Do Not Meet Expectations.');
                throw e;
            default:
                req.logger.error('Unhandled Error: Unexpected Error Occurred.');
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const getCart = async (req, res) => {
    const email = req.user.email;
    if (!email) {
        req.logger.warning('Missing Values Error: Expected Parameters Are Missing.');
        throw new CustomError.createError({
            name: 'Get cart Error',
            cause: generateMissingEmailErrorInfo(),
            message: 'Error trying to get cart.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    try {
        const result = await getCartByEmail(email);
        res.send({ status: 'success', result }); 
    } catch (e) {
        switch (e.code) {
            case errorsEnum.DATABASE_ERROR:
                req.logger.fatal('Fatal Error: Database Failure.');
                throw e
            case errorsEnum.NOT_FOUND_ERROR:
                req.logger.warning('Error 404: The Requested Object Has Not Been Found');
                throw e
            default:
                req.logger.error('Unhandled Error: Unexpected Error Occurred.');
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const newCart = async (req, res) => {
    const email = req.user.email;
    if (!email) {
        req.logger.warning('Missing Values Error: Expected Parameters Are Missing.');
        throw new CustomError.createError({
            name: 'Get cart Error',
            cause: generateMissingEmailErrorInfo(),
            message: 'Error trying to get cart.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    const cart = {purchaser: email, products: []};
    try {
        const result = await saveCart(cart);
        res.send({ status: 'success', result }); 
    } catch (e) {
        switch (e.code) {
            case errorsEnum.DATABASE_ERROR:
                req.logger.fatal('Fatal Error: Database Failure.');
                throw e
            case errorsEnum.VALIDATION_ERROR:
                req.logger.info('Validation Error: Sent Values Do Not Meet Expectations.');
                throw e;
            default:
                req.logger.error('Unhandled Error: Unexpected Error Occurred.');
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const deleteCartByEmail = async (req, res) => {
    const email = req.user.email;
    if (!email) {
        req.logger.warning('Missing Values Error: Expected Parameters Are Missing.');
        throw new CustomError.createError({
            name: 'Get cart Error',
            cause: generateMissingEmailErrorInfo(),
            message: 'Error trying to get cart.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    try {
        const result = await deleteCart(email);
        res.send({ status: 'success', result }); 
    } catch (e) {
        switch (e.code) {
            case errorsEnum.DATABASE_ERROR:
                req.logger.fatal('Fatal Error: Database Failure.');
                throw e
            case errorsEnum.NOT_FOUND_ERROR:
                req.logger.warning('Error 404: The Requested Object Has Not Been Found');
                throw e
            default:
                req.logger.error('Unhandled Error: Unexpected Error Occurred.');
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const addCartProducts = async (req, res) =>  {
    const email = req.user.email;
    if (!email) {
        req.logger.warning('Missing Values Error: Expected Parameters Are Missing.');
        throw CustomError.createError({
            name: 'Get cart Error',
            cause: generateMissingEmailErrorInfo(),
            message: 'Error trying to get cart.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    const {products} = req.body;
    if (!products) {
        req.logger.warning('Missing Values Error: Expected Parameters Are Missing.');
        throw CustomError.createError({
            name: 'Add products array to cart Error',
            cause: generateCartAddProductArrayErrorInfo(products),
            message: 'Error trying to update cart.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    try {
        const result = await addCartProductsArray(email, products);
        res.send({ status: 'success', result }); 
    } catch (e) {
        switch (e.code) {
            case errorsEnum.DATABASE_ERROR:
                req.logger.fatal('Fatal Error: Database Failure.');
                throw e
            case errorsEnum.NOT_FOUND_ERROR:
                req.logger.warning('Error 404: The Requested Object Has Not Been Found');
                throw e;
            default:
                req.logger.error('Unhandled Error: Unexpected Error Occurred.');
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const addCartProductById = async (req, res) => {
    const email = req.user.email;
    const {pid, quantity} = req.body;
    if (!pid || !quantity) {
        req.logger.warning('Missing Values Error: Expected Parameters Are Missing.');
        throw CustomError.createError({
            name: 'Add product to cart Error',
            cause: generateCartAddProductErrorInfo(pid, quantity),
            message: 'Error trying to add product to cart.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    const product = await getProductById(pid);
    if (!product) {
        req.logger.warning('Error 404: The Requested Object Has Not Been Found');
        throw CustomError.createError({
            name: 'Product Not Found Error',
            cause: generateProductNotFoundErrorInfo(pid),
            message: 'The product has not been found.',
            code: errorsEnum.NOT_FOUND_ERROR
        });
    };
    try {
        const result = await addCartProduct(email, pid, quantity);
        res.send({ status: 'success', result }); 
    } catch (e) {
        switch (e.code) {
            case errorsEnum.DATABASE_ERROR:
                req.logger.fatal('Fatal Error: Database Failure.');
                throw e
            case errorsEnum.NOT_FOUND_ERROR:
                req.logger.warning('Error 404: The Requested Object Has Not Been Found');
                throw e
            case errorsEnum.VALIDATION_ERROR:
                req.logger.info('Validation Error: Sent Values Do Not Meet Expectations.');
                throw e;
            case errorsEnum.CONFLICT_ERROR:
                req.logger.info('Conflict Error: Users can not add products they own to their carts.');
                throw e;
            default:
                req.logger.error('Unhandled Error: Unexpected Error Occurred.');
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const deleteCartProductById = async (req, res) => {
    const email = req.user.email;
    const {pid} = req.query;
    if (!pid) {
        req.logger.warning('Missing Values Error: Expected Parameters Are Missing.');
        throw CustomError.createError({
            name: 'Delete Product From Cart Error',
            cause: generateCartDeleteProductErrorInfo(),
            message: 'Error trying to delete the product from the cart.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    try {
        const result = await deleteCartProduct(email, pid);
        res.send({ status: 'success', result }); 
    } catch (e) {
        switch (e.code) {
            case errorsEnum.DATABASE_ERROR:
                req.logger.fatal('Fatal Error: Database Failure.');
                throw e
            case errorsEnum.NOT_FOUND_ERROR:
                req.logger.warning('Error 404: The Requested Object Has Not Been Found');
                throw e;
            default:
                req.logger.error('Unhandled Error: Unexpected Error Occurred.');
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const purchase = async (req, res) => {
    const email = req.user.email;
    try {
        const result = await completePurchase(email);
        res.send({ status: 'success', result }); 
    } catch (e) {
        switch (e.code) {
            case errorsEnum.DATABASE_ERROR:
                req.logger.fatal('Fatal Error: Database Failure.');
                throw e
            case errorsEnum.NOT_FOUND_ERROR:
                req.logger.warning('Error 404: The Requested Object Has Not Been Found');
                throw e
            case errorsEnum.VALIDATION_ERROR:
                req.logger.info('Validation Error: Sent Values Do Not Meet Expectations.');
                throw e;
            default:
                req.logger.error('Unhandled Error: Unexpected Error Occurred.');
                throw CustomError.createError({
                    name: 'Unhandled Error',
                    cause: generateUnhandledErrorInfo(),
                    message: 'Something unexpected happened.',
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

export {
    getAllCarts,
    getCart,
    newCart,
    deleteCartByEmail,
    addCartProducts,
    addCartProductById,
    deleteCartProductById,
    purchase
};