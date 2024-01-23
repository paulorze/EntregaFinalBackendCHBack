import { errorsEnum } from "../../config/enums.js";
import CustomError from "../../middlewares/errors/CustomError.js";
import { generateCartAddProductOwnerErrorInfo, generateDatabaseErrorInfo, generateEmptyCartErrorInfo, generateProductFieldValidationErrorInfo, generateProductNotFoundErrorInfo, generateUnhandledErrorInfo } from "../../middlewares/errors/error.info.js";
import { cartsModel }  from "../models/carts.model.js";
import Parent from "./parent.dao.js";
import Products from "./products.dao.js";
import Tickets from "./tickets.dao.js";

export default class Carts extends Parent{
    constructor () {
        super(cartsModel);
    };

    readByEmail = async (email) => {
        try {
            let cart = await this.model.findOne({purchaser: email}).lean();
            if (!cart) {
                cart = await this.model.create({purchaser: email, products: []}); 
            };
            return cart;
        } catch {
            throw CustomError.createError({
                name: 'Database Error',
                cause: generateDatabaseErrorInfo(),
                message: 'Error trying connect to the database.',
                code: errorsEnum.DATABASE_ERROR
            });    
        };
    };

    deleteByMail = async (email) => {
        const cart = await this.readByEmail(email);
        if (!cart) {
            throw CustomError.createError({
                name: 'Object Not Found Error',
                cause: generateProductNotFoundErrorInfo(),
                message: 'Error 404: Object Not Found.',
                code: errorsEnum.NOT_FOUND_ERROR
            });   
        };
        try {
            const updatedCart = {...cart, products : []};
            const result = await this.update(cart._id, updatedCart);
            return result;
        } catch (e) {
            switch (e.code) {
                case errorsEnum.NOT_FOUND_ERROR:
                case errorsEnum.DATABASE_ERROR:
                    throw e;
                default:
                    throw CustomError.createError({
                        name: 'Unhandled Error',
                        cause: generateUnhandledErrorInfo(),
                        message: 'Something unexpected happened.',
                        code: errorsEnum.UNHANDLED_ERROR
                    });
            };
        };
    };

    addCartProduct = async (email, pid, quantity) => {
        if (quantity <= 0 || isNaN(quantity)) {
            throw CustomError.createError({
                name: 'Validation Error',
                cause: generateProductFieldValidationErrorInfo(quantity, "quantity"),
                message: 'Error validating the user input.',
                code: errorsEnum.VALIDATION_ERROR
            });
        };
        const products = new Products();
        const productExists = products.readByID(pid);
        if (!productExists) {
            throw CustomError.createError({
                name: 'Object Not Found Error',
                cause: generateProductNotFoundErrorInfo(),
                message: 'Error 404: Object Not Found.',
                code: errorsEnum.NOT_FOUND_ERROR
            });   
        };
        if (productExists.owner === email){
            throw CustomError.createError({
                name: 'Object Not Found Error',
                cause: generateCartAddProductOwnerErrorInfo(),
                message: 'Conflict Error: Can not purchase products you own.',
                code: errorsEnum.CONFLICT_ERROR
            });  
        };
        const cart = await this.readByEmail(email);
        if (!cart) {
            throw CustomError.createError({
                name: 'Object Not Found Error',
                cause: generateProductNotFoundErrorInfo(),
                message: 'Error 404: Object Not Found.',
                code: errorsEnum.NOT_FOUND_ERROR
            });   
        };
        if (cart.products.some(product => product.pid == pid)) {
            cart.products = cart.products.map(product => {
                if (product.pid == pid) {
                    product.quantity = quantity;
                };
                return product;
            });
        } else {
            const newProduct = {pid, quantity};
            cart.products.push(newProduct);
        };
        try {
            const result = await this.update(cart._id, cart);
            return result;
        } catch (e) {
            switch (e.code) {
                case errorsEnum.NOT_FOUND_ERROR:
                case errorsEnum.DATABASE_ERROR:
                    throw e;
                default:
                    throw CustomError.createError({
                        name: 'Unhandled Error',
                        cause: generateUnhandledErrorInfo(),
                        message: 'Something unexpected happened.',
                        code: errorsEnum.UNHANDLED_ERROR
                    });
            };
        };
    };

    deleteCartProduct= async (email, pid) => {
        const cart = await this.readByEmail(email);
        if (!cart) {
            throw CustomError.createError({
                name: 'Object Not Found Error',
                cause: generateProductNotFoundErrorInfo(),
                message: 'Error 404: Object Not Found.',
                code: errorsEnum.NOT_FOUND_ERROR
            });   
        };
        cart.products = cart.products.filter(product => product.pid.toString() !== pid);
        try {
            const result = await this.update(cart._id, cart);
            return result;
        } catch (e) {
            switch (e.code) {
                case errorsEnum.NOT_FOUND_ERROR:
                case errorsEnum.DATABASE_ERROR:
                    throw e;
                default:
                    throw CustomError.createError({
                        name: 'Unhandled Error',
                        cause: generateUnhandledErrorInfo(),
                        message: 'Something unexpected happened.',
                        code: errorsEnum.UNHANDLED_ERROR
                    });
            };
        };
    };

    addCartProductsArray = async(email, products) => {
        const cart = await this.readByEmail(email);
        if (!cart) {
            throw CustomError.createError({
                name: 'Object Not Found Error',
                cause: generateProductNotFoundErrorInfo(),
                message: 'Error 404: Object Not Found.',
                code: errorsEnum.NOT_FOUND_ERROR
            });   
        };
        cart.products = products;
        try {
            const result = await this.update(cart._id, cart);
            return result;
        } catch (e) {
            switch (e.code) {
                case errorsEnum.NOT_FOUND_ERROR:
                case errorsEnum.DATABASE_ERROR:
                    throw e;
                default:
                    throw CustomError.createError({
                        name: 'Unhandled Error',
                        cause: generateUnhandledErrorInfo(),
                        message: 'Something unexpected happened.',
                        code: errorsEnum.UNHANDLED_ERROR
                    });
            };
        };
    };

    completePurchase = async (email) => {
        const cart = await this.model.findOne({purchaser : email}).populate('products.pid');
        if (!cart) {
            throw CustomError.createError({
                name: 'Object Not Found Error',
                cause: generateProductNotFoundErrorInfo(),
                message: 'Error 404: Object Not Found.',
                code: errorsEnum.NOT_FOUND_ERROR
            });   
        };
        if (!cart.products || cart.products.length === 0) {
            throw CustomError.createError({
                name: 'Empty Cart Products Error',
                cause: generateEmptyCartErrorInfo(),
                message: 'There are no products in the cart.',
                code: errorsEnum.VALIDATION_ERROR
            });
        }
        const productsManager = new Products();
        let total = 0;
        let authorizedProducts = [];
        for (let i = 0; i < cart.products.length; i++) {
            const product = cart.products[i];
            try {
                if (product.pid.stock >= product.quantity) {
                    const subtotal = await productsManager.updateStock(product.pid, product.quantity);
                    total += subtotal;
                    const authorizedProduct = {id : product.pid._id.toString(), code: product.pid.code, price: product.pid.price, quantity: product.quantity}
                    authorizedProducts.push(authorizedProduct);
                    cart.products.splice(i, 1);
                    i--;
                } 
            } catch (e) {
                switch (e.code) {
                    case errorsEnum.NOT_FOUND_ERROR:
                    case errorsEnum.DATABASE_ERROR:
                        throw e;
                    default:
                        throw CustomError.createError({
                            name: 'Unhandled Error',
                            cause: generateUnhandledErrorInfo(),
                            message: 'Something unexpected happened.',
                            code: errorsEnum.UNHANDLED_ERROR
                        });
                };
            };
        };
        const ticketsManager = new Tickets();
        const ticketObject = { amount : total, purchaser : email, products : authorizedProducts};
        try {
            await this.update(cart._id, cart);
            return await ticketsManager.create(ticketObject);
        } catch (e) {
            switch (e.code) {
                case errorsEnum.NOT_FOUND_ERROR:
                case errorsEnum.DATABASE_ERROR:
                    throw e;
                default:
                    throw CustomError.createError({
                        name: 'Unhandled Error',
                        cause: generateUnhandledErrorInfo(),
                        message: 'Something unexpected happened.',
                        code: errorsEnum.UNHANDLED_ERROR
                    });
            };
        };
    };
};