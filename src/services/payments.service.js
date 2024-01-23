import StripePayments from "../dao/classes/payments.dao.js";

const paymentsManager = new StripePayments();

const createPaymentIntentService = async (data) => {
    return await paymentsManager.createPaymentIntentRepo(data);
};

export {
    createPaymentIntentService
};