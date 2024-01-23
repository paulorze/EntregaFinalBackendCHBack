import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { login, logout, register, updateUserData, current, recategorize, requestPasswordReset, deleteUser, getByEmail, uploadFiles, getAllUsers, deleteInactiveUsers } from "../controllers/users.controller.js";
import { uploader } from "../utils/fileUploader.js";

export default class SessionsRouter extends Router {
    constructor(){
        super();
    };

    init() {
        this.post('/login', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, login);
        this.post('/register', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, register);
        this.put('/updateUser', [accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, updateUserData);
        this.get('/logout', [accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, logout);
        this.get('/current', [accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, current);
        this.post('/premium/:id', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT,recategorize);
        this.post('/passwordReset', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING,requestPasswordReset);
        this.delete('/:id', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, deleteUser);
        this.get('/getByEmail/:email', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, getByEmail);
        this.post('/:id/documents', [accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, uploader.fields([
            {name: 'profile', maxCount: 1},
            {name: 'products', maxCount: 5},
            {name: 'Identificacion', maxCount: 1},
            {name: 'Comprobante de domicilio', maxCount: 1},
            {name: 'Comprobante de estado de cuenta', maxCount: 1}
        ]), uploadFiles),
        this.get('/getAll', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, getAllUsers),
        this.delete('/inactive', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, deleteInactiveUsers)
    };
};