import { errorsEnum } from "../../config/enums.js";
import CustomError from "../../middlewares/errors/CustomError.js";
import { generateDatabaseErrorInfo, generateProductFieldValidationErrorInfo, generateProductNotFoundErrorInfo, generateServerErrorInfo } from "../../middlewares/errors/error.info.js";

export default class Parent {
    constructor (model) {
        this.model = model;
    };

    create = async (object)=> {
        try {
            const result = await this.model.create(object);
            return result;
        } catch (error) {
            throw CustomError.createError({
                name: 'Database Error',
                cause: generateDatabaseErrorInfo(),
                message: 'Error trying connect to the database.',
                code: errorsEnum.DATABASE_ERROR
            });
        };
    };

    readAll = async() => {
        // ? MODIFICAR PARA QUE SEA PAGINATE???
        try {            
            const objectList = await this.model.find().lean();
            return objectList;
        } catch {
            throw CustomError.createError({
                name: 'Database Error',
                cause: generateDatabaseErrorInfo(),
                message: 'Error trying connect to the database.',
                code: errorsEnum.DATABASE_ERROR
            });
        };
    };

    readAllPaginated = async(limit, page)=>{
        if (isNaN(limit) || limit <= 0){
            throw CustomError.createError({
                name: 'Validation Error',
                cause: generateProductFieldValidationErrorInfo(limit, "limit"),
                message: 'Error validating the user input.',
                code: errorsEnum.VALIDATION_ERROR
            });
        };
        if (isNaN(page) || page <= 0){
            throw CustomError.createError({
                name: 'Validation Error',
                cause: generateProductFieldValidationErrorInfo(page, "page"),
                message: 'Error validating the user input.',
                code: errorsEnum.VALIDATION_ERROR
            });
        };
        try {
            const objectList = await this.model.paginate({}, {limit, page, lean: true});
            return objectList;
        } catch {
            throw CustomError.createError({
                name: 'Database Error',
                cause: generateDatabaseErrorInfo(),
                message: 'Error trying connect to the database.',
                code: errorsEnum.DATABASE_ERROR
            });
        };
    };

    readByID = async(id)=> {
        try {
            const object = await this.model.findOne({_id: id}).lean();
            if (!object) {
                throw CustomError.createError({
                    name: 'Object Not Found Error',
                    cause: generateProductNotFoundErrorInfo(),
                    message: 'Error 404: Object Not Found.',
                    code: errorsEnum.NOT_FOUND_ERROR
                });            
            };
            return object;
        } catch (e) {
            if (e?.code === errorsEnum.NOT_FOUND_ERROR) {
                throw e;
            };
            throw CustomError.createError({
                name: 'Database Error',
                cause: generateDatabaseErrorInfo(),
                message: 'Error trying to connect to the database.',
                code: errorsEnum.DATABASE_ERROR
            });
        };
    };

    update = async (id, object) => {
        try {
            const result = await this.model.findOneAndUpdate({ _id: id }, object, { new: true });
            if (!result) {
                throw CustomError.createError({
                    name: 'Object Not Found Error',
                    cause: generateProductNotFoundErrorInfo(),
                    message: 'Error 404: Object Not Found.',
                    code: errorsEnum.NOT_FOUND_ERROR
                });     
            };
            return result;
        } catch (e) {
            throw CustomError.createError({
                name: 'Database Error',
                cause: generateDatabaseErrorInfo(),
                message: 'Error trying connect to the database.',
                code: errorsEnum.DATABASE_ERROR
            });
        }
    };

    delete = async (id) => {
        try {
            const result = await this.model.deleteOne({_id: id});
            if (result.deletedCount == 0) {
                throw CustomError.createError({
                    name: 'Object Not Found Error',
                    cause: generateProductNotFoundErrorInfo(),
                    message: 'Error 404: Object Not Found.',
                    code: errorsEnum.NOT_FOUND_ERROR
                });
            }
            return result;
        } catch (error) {
            throw CustomError.createError({
                name: 'Database Error',
                cause: generateDatabaseErrorInfo(),
                message: 'Error trying connect to the database.',
                code: errorsEnum.DATABASE_ERROR
            });
        };
    };
};