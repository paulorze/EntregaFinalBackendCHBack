import Stripe from 'stripe';
import { secretKeyStripe } from '../../config/config.js';

export default class StripePayments {
    constructor() {
        this.stripe = new Stripe(secretKeyStripe);
    };

    createPaymentIntentRepo = async(data) => {
        const paymentIntent = this.stripe.paymentIntents.create(data);
        return paymentIntent;
    } 
}