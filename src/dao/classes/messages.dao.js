import { errorsEnum } from "../../config/enums.js";
import CustomError from "../../middlewares/errors/CustomError.js";
import { generateDatabaseErrorInfo, generateProductNotFoundErrorInfo } from "../../middlewares/errors/error.info.js";
import { messagesModel } from "../models/messages.model.js";
import Parent from "./parent.dao.js";

export default class Messages extends Parent {
    constructor () {
        super(messagesModel);
    };

    readBySender = async (user) => {
        try {
            const messages = await this.model.find({user}).lean();
            if (!messages) {
                throw CustomError.createError({
                    name: 'Object Not Found Error',
                    cause: generateProductNotFoundErrorInfo(),
                    message: 'Error 404: Object Not Found.',
                    code: errorsEnum.NOT_FOUND_ERROR
                });    
            }
            return messages;
        } catch {
            throw CustomError.createError({
                name: 'Database Error',
                cause: generateDatabaseErrorInfo(),
                message: 'Error trying connect to the database.',
                code: errorsEnum.DATABASE_ERROR
            });
        };
    };

    readByReceiver = async (receiver) => {
        try {
            const messages = await this.model.find({receiver}).lean();
            if (!messages) {
                throw CustomError.createError({
                    name: 'Object Not Found Error',
                    cause: generateProductNotFoundErrorInfo(),
                    message: 'Error 404: Object Not Found.',
                    code: errorsEnum.NOT_FOUND_ERROR
                });    
            }
            return messages;
        } catch {
            throw CustomError.createError({
                name: 'Database Error',
                cause: generateDatabaseErrorInfo(),
                message: 'Error trying connect to the database.',
                code: errorsEnum.DATABASE_ERROR
            });
        };
    };

    readConversation = async (user, receiver) => {
        try {
            const messages = await this.model.find({user, receiver}).lean();
            return messages;
        } catch (e) {
            throw CustomError.createError({
                name: 'Database Error',
                cause: generateDatabaseErrorInfo(),
                message: 'Error trying connect to the database.',
                code: errorsEnum.DATABASE_ERROR
            });
        };
    };
};