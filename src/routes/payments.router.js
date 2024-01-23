import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { createPaymentIntentStripe } from "../controllers/payments.controller.js";
import Router from "./router.js";

export default class PaymentsRouter extends Router {
    constructor() {
        super();
    };

    init() {
        this.post('/stripe', [accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, createPaymentIntentStripe);
    };
};