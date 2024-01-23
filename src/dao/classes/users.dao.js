import { premiumKey } from "../../config/config.js";
import { errorsEnum } from "../../config/enums.js";
import CustomError from "../../middlewares/errors/CustomError.js";
import { generateDatabaseErrorInfo, generateDocumentationErrorInfo } from "../../middlewares/errors/error.info.js";
import { sendEmailDeletedUser } from "../../services/mails.service.js";
import { usersModel } from "../models/users.model.js";
import Parent from "./parent.dao.js";

export default class Users extends Parent {
    constructor () {
        super(usersModel);
    };

    readAllUsers = async () => {
        try {
            const usersList = await this.model.find().lean();
            usersList.forEach(user => {
                delete user.password;
                delete user.__v;
                delete user.last_connection;
            });
            return usersList;
        } catch (error) {
            throw CustomError.createError({
                name: 'Database Error',
                cause: generateDatabaseErrorInfo(),
                message: 'Error trying connect to the database.',
                code: errorsEnum.DATABASE_ERROR
            });
        };
    }

    readByEmail = async (email) => {
        try {
            const user = await this.model.findOne({email}).lean();
            if (!user) {
                return null;
            }
            return user;
        } catch (error) {
            throw CustomError.createError({
                name: 'Database Error',
                cause: generateDatabaseErrorInfo(),
                message: 'Error trying connect to the database.',
                code: errorsEnum.DATABASE_ERROR
            });
        };
    };

    recategorize = async (id) => {
        const user = await this.readByID(id);
        if (user.role === 'USER') {
            const hasIdentificacion = user.documents.some(doc => doc.name === 'Identificacion');
            const hasDomicilio = user.documents.some(doc => doc.name === 'Comprobante de domicilio');
            const hasCuenta = user.documents.some(doc => doc.name === 'Comprobante de estado de cuenta');
            if (!hasIdentificacion || !hasDomicilio || !hasCuenta) {
                throw CustomError.createError({
                    name: 'Documentation Error',
                    cause: generateDocumentationErrorInfo(),
                    message: 'Error trying recategorize user.',
                    code: errorsEnum.VALIDATION_ERROR
                });
            };
            user.role = premiumKey;
        } else {
            user.role = 'USER';
        };
        try {
            return this.update(id, user);
        } catch (error) {
            throw CustomError.createError({
                name: 'Database Error',
                cause: generateDatabaseErrorInfo(),
                message: 'Error trying connect to the database.',
                code: errorsEnum.DATABASE_ERROR
            });
        };
    };

    updateLastConnectionRepo = async (email) => {
        try {
            const user = await this.readByEmail(email);
            const updatedUser = {...user, last_connection: Date.now()};
            return await this.update(updatedUser._id, updatedUser);
        } catch (error) {
            throw CustomError.createError({
                name: 'Database Error',
                cause: generateDatabaseErrorInfo(),
                message: 'Error trying connect to the database.',
                code: errorsEnum.DATABASE_ERROR
            });
        }
    };

    readInactiveUsersRepo = async (date) => {
        try {
            const users = await this.model.find({last_connection: {$lt: date}}).lean();
            return users;
        } catch (error) {
            throw CustomError.createError({
                name: 'Database Error',
                cause: generateDatabaseErrorInfo(),
                message: 'Error trying connect to the database.',
                code: errorsEnum.DATABASE_ERROR
            });
        };
    };

    deleteInactiveUsersRepo = async() => {
        const date = Date.now();
        try {
            const users = await this.readInactiveUsersRepo(date);
            users.forEach(async user => {
                console.log(user);
                // await sendEmailDeletedUser(user.email);
                // await this.delete(user);
            });
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