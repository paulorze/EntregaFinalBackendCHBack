import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getMessagesController, getMessageByIdController, saveMessageController, deleteMessageController } from "../controllers/messages.controller.js";

export default class MessagesRouter extends Router {
    constructor() {
        super();
    };

    init() {
        this.get('/', [accessRolesEnum.USER, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, getMessagesController);
        this.get('/:id', [accessRolesEnum.USER, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, getMessageByIdController);
        this.post('/', [accessRolesEnum.USER, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, saveMessageController);
        this.delete('/:id', [accessRolesEnum.USER, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, deleteMessageController);
    };
};