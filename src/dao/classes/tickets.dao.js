import {ticketsModel} from "../models/tickets.model.js";
import Parent from "./parent.dao.js";

export default class Tickets extends Parent {
    
    constructor () {
        super(ticketsModel);
    };

};