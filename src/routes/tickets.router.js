import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import { getAllTickets, getTicketByIDController, deleteTicketController } from '../controllers/tickets.controller.js';

export default class TicketsRouter extends Router {
    constructor() {
        super();
    };

    init() {
        this.get('/', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, getAllTickets);
        this.get('/:id', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, getTicketByIDController);
        this.delete('/:id', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, deleteTicketController);
    };

};