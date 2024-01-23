import Tickets from "../dao/classes/tickets.dao.js";

const ticketsManager = new Tickets();

const getTickets = async (limit = null, page = null) => {
    let tickets;
    if (limit != null) {
        tickets = await ticketsManager.readAllPaginated(limit, page);
    } else {
        tickets = await ticketsManager.readAll();
    }
    return tickets;
};

const getTicketById = async (id) => {
    return await ticketsManager.readByID(id);
};

const saveTicket = async (ticket) => {
    return await ticketsManager.create(ticket);
};

const deleteTicket = async (id) => {
    return await ticketsManager.delete(id);
};

export {
    getTickets,
    getTicketById,
    saveTicket,
    deleteTicket
};