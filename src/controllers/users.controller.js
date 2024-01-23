import { accessRolesEnum, errorsEnum } from '../config/enums.js';
import CustomError from '../middlewares/errors/CustomError.js';
import { generateMissingEmailErrorInfo, generateMissingFilesErrorInfo, generateMissingIdErrorInfo, generateMissingPasswordErrorInfo, generatePasswordResetErrorInfo, generateUnauthorizedErrorInfo, generateUnhandledErrorInfo, generateUserConflictErrorInfo, generateUserCreateErrorInfo, generateUserLoginErrorInfo, generateUserUpdateErrorInfo } from '../middlewares/errors/error.info.js';
import { sendEmailReset } from '../services/mails.service.js';
import { getUser, recategorizeUser, saveUser, updateUser, deleteById, getUserByEmail, updateLastConnection, getUserList, deleteInactiveUsersService } from '../services/users.service.js';
import { createHash, generateToken, isValidPassword, passwordResetTokenVerification } from '../utils.js';
import { deleteFiles } from '../utils/fileUploader.js';

const login = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        req.logger.info('Unauthorized Error: Incorrect credentials.');
        throw CustomError.createError({
            name: 'Login Error',
            cause: generateUserLoginErrorInfo(),
            message: 'Error trying to login.',
            code: errorsEnum.UNAUTHORIZED_ERROR
        });
    }
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            req.logger.info('Unauthorized Error: Incorrect credentials.');
            throw CustomError.createError({
                name: 'Login Error',
                cause: generateUserLoginErrorInfo(),
                message: 'Error trying to login.',
                code: errorsEnum.UNAUTHORIZED_ERROR
            });
        };
        const comparePassword = isValidPassword(password, user.password);
        if (!comparePassword) {
            req.logger.info('Unauthorized Error: Incorrect credentials.');
            throw CustomError.createError({
                name: 'Login Error',
                cause: generateUserLoginErrorInfo(),
                message: 'Incorrect Credentials.',
                code: errorsEnum.UNAUTHORIZED_ERROR
            });
        };
        delete user.password;
        delete user.first_name;
        delete user.last_name;
        await updateLastConnection(email);
        const accessToken = generateToken(user, '24h');
        res.cookie('session', accessToken, {maxAge: 60*60*1000, httpOnly: true, sameSite: 'None', secure: true, domain: '.app'}).send({ status: 'success', accessToken });
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
            case errorsEnum.UNAUTHORIZED_ERROR:
                req.logger.info('Authentication Error: Incorrect Credentials.');
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

const register = async (req, res) => {
    const { username, first_name, last_name, email, password, role } = req.body;
    if (!username || !first_name || !last_name || !email || !password) {
        req.logger.warning('Missing Values Error: Expected Parameters Are Missing.');
        throw CustomError.createError({
            name: 'Create User Error',
            cause: generateUserCreateErrorInfo({username, first_name, last_name, email, password}),
            message: 'Error trying to create new user.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    try {
        const exists = await getUserByEmail(email);
        if (exists) {
            req.logger.info('Conflict Error: Trying To Register Existing Email.');
            throw CustomError.createError({
                name: 'Existing Email Error',
                cause: generateUserConflictErrorInfo(email),
                message: 'The mail is already in use.',
                code: errorsEnum.CONFLICT_ERROR
            });
        };
        // PASAR HASHEO DE PASSWORD A LA CAPA DE SERVICIOS
        const hashedPassword = createHash(password);
        const newUser = {...req.body};
        if (role !== accessRolesEnum.ADMIN || role == null) newUser.role = accessRolesEnum.USER;
        newUser.password = hashedPassword;
        const result = await saveUser(newUser);
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

const updateUserData = async (req, res) => {
    const id = req.user['_id'];
    const { username, first_name, last_name, email } = req.body;
    if (!username || !first_name || !last_name || !email ){
        req.logger.warning('Missing Values Error: Expected Parameters Are Missing.');
        throw CustomError.createError({
            name: 'Update User Error',
            cause: generateUserUpdateErrorInfo({username, first_name, last_name, email}),
            message: 'Error trying to update user.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    const user = await getUserByEmail(req.user.email);
    const updatedUser = { ...user, username, first_name, last_name, email };
    try {
        const result = await updateUser(id, updatedUser);
        return res.send({ status: 'success', result });
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

const logout = async (req, res) => {
    await updateLastConnection(req.user.email);
    delete req.user;
    res.clearCookie('session');
    res.send({status: 'success'});
};

const current = (req, res) => {
    res.send({status: 'success', result: req.user});
};

const recategorize = async (req, res) => {
    const {id} = req.params;
    if (!id) {
        req.logger.warning('Missing Values Error: Expected Parameters Are Missing.');
        throw CustomError.createError({
            name: 'Update User Error',
            cause: generateMissingIdErrorInfo(),
            message: 'Error trying to update user.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    try {
        const result = await recategorizeUser(id);
        return res.send({ status: 'success', result });
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

const requestPasswordReset = async (req, res) => {
    const {token} = req.query;
    if (token) {
        const decodedToken = passwordResetTokenVerification(token);
        if (!decodedToken) {
            req.logger.info('Unauthorized Error: Incorrect credentials.');
            throw CustomError.createError({
                name: 'Login Error',
                cause: generateUserLoginErrorInfo(),
                message: 'Invalid JWT.',
                code: errorsEnum.UNAUTHORIZED_ERROR
            });
        };
        const { password } = req.body;
        if (!password) {
            req.logger.warning('Missing Values Error: Expected Parameter (Password) Is Missing.');
            throw CustomError.createError({
                name: 'Reset Password Error',
                cause: generateMissingPasswordErrorInfo(),
                message: 'Error trying to reset password.',
                code: errorsEnum.INCOMPLETE_VALUES_ERROR
            });
        };
        const email = decodedToken.user.email;
        try {
            const user = await getUserByEmail(email);
            const samePassword = isValidPassword(password, user.password);
            if (samePassword) {
                req.logger.info('Same Password Error: New Password is Equal to Old Password.');
                throw CustomError.createError({
                    name: 'Reset Password Error',
                    cause: generatePasswordResetErrorInfo(),
                    message: 'New Password is Equal to Old Password.',
                    code: errorsEnum.INCOMPLETE_VALUES_ERROR
                });
            };
            const hashedPassword = createHash(password);
            user.password = hashedPassword;
            const result = await updateUser(user._id, user);
            return res.send({status:'success', message: 'Your Password Was Reseted Successfully'});
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
                        message: e.message,
                        code: errorsEnum.UNHANDLED_ERROR
                });
            };
        };
    } else {
        const {email} = req.body;
        if (!email) {
            req.logger.warning('Missing Values Error: Expected Parameters Are Missing.');
            throw CustomError.createError({
                name: 'Reset Password Error',
                cause: generateMissingEmailErrorInfo(),
                message: 'Error trying to reset password.',
                code: errorsEnum.INCOMPLETE_VALUES_ERROR
            });
        };
        try {
            const user = await getUserByEmail(email);
            if (!user) {
                req.logger.info('Unauthorized Error: Incorrect credentials.');
                throw CustomError.createError({
                    name: 'Login Error',
                    cause: generateUserLoginErrorInfo(),
                    message: 'Invalid Credentials.',
                    code: errorsEnum.UNAUTHORIZED_ERROR
                });
            };
            delete user.password;
            delete user.first_name;
            delete user.last_name;
            user.role = 'PASSWORDRESET';
            const accessToken = generateToken(user, '1h');
            const result = await sendEmailReset(email, accessToken);
            return res.send({status: 'success', result});
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
                        message: e.message,
                        code: errorsEnum.UNHANDLED_ERROR
                    });
            };
        };
    };
};

const deleteUser = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await deleteById(id);
        return res.send({status: 'success', result});
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
                    message: e.message,
                    code: errorsEnum.UNHANDLED_ERROR
                });
            };
    };
};

const getByEmail = async (req, res) => {
    try {
        const {email} = req.params;
        const result = await getUserByEmail(email);
        return res.send({status: 'success', result});
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
                    message: e.message,
                    code: errorsEnum.UNHANDLED_ERROR
                });
            };
    };
};

const uploadFiles = async (req, res) => {
    const files = req.files;
    if (!files) {
        req.logger.info('Bad Request Error: Missing Files.');
        throw CustomError.createError({
            name: 'File Upload Error',
            cause: generateMissingFilesErrorInfo(),
            message: 'No files have been uploaded.',
            code: errorsEnum.INCOMPLETE_VALUES_ERROR
        });
    };
    const {id} = req.params;
    if (id !== req.user._id) {
        deleteFiles(files);
        req.logger.info('Unauthorized Error: Incorrect credentials.');
        throw CustomError.createError({
            name: 'Authorization Error',
            cause: generateUnauthorizedErrorInfo(),
            message: "You are not allowed to change other user's data.",
            code: errorsEnum.UNAUTHORIZED_ERROR
        });
    };
    const user = await getUser(id);
    if (!user) {
        deleteFiles(files);
        req.logger.info('Unauthorized Error.');
        throw CustomError.createError({
            name: 'Authorization Error',
            cause: generateUserLoginErrorInfo(),
            message: 'Invalid User.',
            code: errorsEnum.UNAUTHORIZED_ERROR
        });
    };
    try {
        const documents = user.documents;
        if (files.Identificacion) {
            const identificacionIndex = documents.findIndex(doc => doc.name === 'Identificacion');
            if (identificacionIndex !== -1) {
                documents[identificacionIndex] = {
                    name: "Identificacion",
                    reference:`${files.Identificacion[0].path}` 
                };
            } else {
                documents.push({
                    name: "Identificacion",
                    reference: `${files.Identificacion[0]['path']}`
                });
            };
        };
        if (files["Comprobante de domicilio"]) {
            const domicilioIndex = documents.findIndex(doc => doc.name === 'Comprobante de domicilio');
            if (domicilioIndex !== -1) {
                documents[domicilioIndex] = {
                    name: "Comprobante de domicilio",
                    reference: `${files["Comprobante de domicilio"][0].path}` 
                };
            } else {
                documents.push({
                    name: "Comprobante de domicilio",
                    reference: `${files["Comprobante de domicilio"][0].path}` 
                });
            };
        };
        if (files["Comprobante de estado de cuenta"]) {
            const cuentaIndex = documents.findIndex(doc => doc.name === 'Comprobante de estado de cuenta');
            if (cuentaIndex !== -1) {
                documents[cuentaIndex] = {
                    name: "Comprobante de estado de cuenta",
                    reference: `${files["Comprobante de estado de cuenta"][0].path}`
                };
            } else {
                documents.push({
                    name: "Comprobante de estado de cuenta",
                    reference: `${files["Comprobante de estado de cuenta"][0].path}`
                });
            };
        };
        const updatedUser = {...user, documents};
        await updateUser(id, updatedUser);
        const response = [];
        for (const key in files) {
            response.push(`Nombre original de la imagen: ${files[key][0].originalname} \n Direccion de la imagen: ${files[key][0].path} \n`);
        };
        const finalResponse = response.length > 0
            ? "Se han subido las siguientes imágenes:\n" + response.join('')
            : "No se han subido imágenes.";
        return res.send({status: 'success', response: finalResponse});    
    } catch (e) {
        deleteFiles(files);
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
                    message: e.message,
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const getAllUsers = async (req, res) => {
    try {
        const users= await getUserList();
        return res.send({status: 'success', response: users});
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
                    message: e.message,
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

const deleteInactiveUsers = async (req, res) => {
    try {
        await deleteInactiveUsersService();
        return res.send({status: 'success'});
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
                    message: e.message,
                    code: errorsEnum.UNHANDLED_ERROR
                });
        };
    };
};

export {
    login,
    register,
    updateUserData,
    logout,
    current,
    recategorize,
    requestPasswordReset,
    deleteUser,
    getByEmail,
    uploadFiles,
    getAllUsers,
    deleteInactiveUsers
};