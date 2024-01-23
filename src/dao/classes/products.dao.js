import { productsModel } from "../models/products.model.js";
import Parent from "./parent.dao.js";
import { errorsEnum, validCategories, validKeys } from "../../config/enums.js";
import CustomError from "../../middlewares/errors/CustomError.js";
import { generateInvalidKeysErrorInfo, generateProductFieldValidationErrorInfo, generateServerErrorInfo, generateUnauthorizedErrorInfo } from "../../middlewares/errors/error.info.js";

export default class Products extends Parent {
    constructor() {
        super(productsModel)
    };

    addProduct = async (product)=> {
        try {
            this.validateTitle(product.title);
            this.validateCategory(product.category);
            this.validateDescription(product.description);
            this.validateNumber(product.price, 'price');
            this.validateCode(product.code);
            this.validateNumber(product.stock, 'stock');
            const result = await this.create(product);
            return result;
        } catch (e) {
            switch (e.code) {
                case errorsEnum.DATABASE_ERROR:
                case errorsEnum.VALIDATION_ERROR:
                    throw e;
                default:
                    throw CustomError.createError({
                        name: 'Unhandled Error',
                        cause: generateServerErrorInfo(),
                        message: 'Something unexpected happened.',
                        code: errorsEnum.UNHANDLED_ERROR
                    });
            };
        };
    };
    
    updateProduct = async (id, owner, data)=> {
        const foundProduct = await this.readByID(id);
        if (owner !== 'admin' && owner !== foundProduct.owner) {
            throw CustomError.createError({
                name: 'Invalid Key Error',
                cause: generateUnauthorizedErrorInfo(),
                message: 'Error on keys received.',
                code: errorsEnum.UNAUTHORIZED_ERROR
            });
        };
        for (const [key, value] of Object.entries(data)) {
            if (!validKeys.includes(key)) {
                throw CustomError.createError({
                    name: 'Invalid Key Error',
                    cause: generateInvalidKeysErrorInfo(),
                    message: 'Error on keys received.',
                    code: errorsEnum.VALIDATION_ERROR
                });
            };
        };
        try {
            for (const [key, value] of Object.entries(data)) {
                switch (key) {
                    case 'title':
                        this.validateTitle(value);
                        foundProduct[key] = value;
                        break;
                    case 'category':
                        this.validateCategory(value);
                        foundProduct[key] = value;
                        break;
                    case 'description':
                        this.validateDescription(value);
                        foundProduct[key] = value;
                        break;
                    case 'price':
                        this.validateNumber(value, 'price');
                        foundProduct[key] = value;
                        break;
                    case 'code':
                        this.validateCode(value);
                        foundProduct[key] = value;
                        break;
                    case 'stock':
                        this.validateNumber(value, 'stock');
                        foundProduct[key] = value;
                        break;
                };
            };
            const result = await this.update(id, foundProduct);
            return foundProduct;
        } catch (e) {
            switch (e.code) {
                case errorsEnum.NOT_FOUND_ERROR:
                case errorsEnum.DATABASE_ERROR:
                case errorsEnum.VALIDATION_ERROR:
                    throw e;
                default:
                    throw CustomError.createError({
                        name: 'Server Error',
                        cause: generateServerErrorInfo(),
                        message: 'Error trying connect to the server.',
                        code: errorsEnum.DATABASE_ERROR
                    });
            };
        };
    };

    deleteProduct = async (id, owner) => {
        const foundProduct = await this.readByID(id);
        if (owner !== 'admin' && owner !== foundProduct.owner) {
            throw CustomError.createError({
                name: 'Invalid Key Error',
                cause: generateUnauthorizedErrorInfo(),
                message: 'Error on keys received.',
                code: errorsEnum.UNAUTHORIZED_ERROR
            });
        };
        const result = await this.delete(id);
        return result;
    };

    updateStock = async (id, purchaseAmount) => {
        const foundProduct = await this.readByID(id);
        const stock = foundProduct.stock - purchaseAmount;
        try {
            const result = await this.model.updateOne({ _id: id }, { $set: { stock: stock } })
            const subtotal = foundProduct.price * purchaseAmount;
            return subtotal;
        } catch (e) {
            throw CustomError.createError({
                name: 'Server Error',
                cause: generateServerErrorInfo(),
                message: 'Error trying connect to the server.',
                code: errorsEnum.DATABASE_ERROR
            });
        };
    };

    validateTitle (string) {
        const titleRegEx= /^(?=.*[A-Za-z0-9'"()/áéíóúÁÉÍÓÚ])[\w\d\s'"()/áéíóúÁÉÍÓÚ]{5,40}$/;
        if (!titleRegEx.test(string.trim())) {
            throw CustomError.createError({
                name: 'Validation Error',
                cause: generateProductFieldValidationErrorInfo(string, "title"),
                message: 'The input does not meet the requirements (title).',
                code: errorsEnum.VALIDATION_ERROR
            });
        };
    };

    validateCategory (category) {
        if (!validCategories.includes(category)) {
            throw CustomError.createError({
                name: 'Validation Error',
                cause: generateProductFieldValidationErrorInfo(category, "category"),
                message: 'The input does not meet the requirements (category).',
                code: errorsEnum.VALIDATION_ERROR
            });
        };
    };

    validateDescription (description) {
        const descriptionRegEx = /^(?=[\s\S]*[A-Za-z0-9'"()/.,;¡!¿?:\n\ráéíóúÁÉÍÓÚ])[\w\d\s'"()/.,;¡!¿?:\n\ráéíóúÁÉÍÓÚ]{50,400}$/;
        if (!descriptionRegEx.test(description.trim())) {
            throw CustomError.createError({
                name: 'Validation Error',
                cause: generateProductFieldValidationErrorInfo(description, "description"),
                message: 'The input does not meet the requirements (description).',
                code: errorsEnum.VALIDATION_ERROR
            });
        };
    };

    validateNumber (num, param) {
        if (Number.isNaN(+num) || +num <= 0) {
            throw CustomError.createError({
                name: 'Validation Error',
                cause: generateProductFieldValidationErrorInfo(num, param),
                message: 'The input does not meet the requirements (stock or price).',
                code: errorsEnum.VALIDATION_ERROR
            });
        };
    };

    validateCode = async (code) => {
        const regEx = /^[A-Z]\d{3}$/;
        if (!regEx.test(code)) {
            throw CustomError.createError({
                name: 'Validation Error',
                cause: generateProductFieldValidationErrorInfo(code, "code"),
                message: 'The input does not meet the requirements (code).',
                code: errorsEnum.VALIDATION_ERROR
            });
        };
    };
};