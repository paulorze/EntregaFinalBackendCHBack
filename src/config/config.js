import dotenv from 'dotenv';

dotenv.config();

const adminKey = process.env.ADMIN_KEY;

const premiumKey = process.env.PREMIUM_KEY;

const mongoUrl = process.env.MONGO_URL;

const privateKeyJWT = process.env.PRIVATE_KEY_JWT;

const userNodemailer = process.env.USER_NODEMAILER;

const passwordNodemailer = process.env.PASSWORD_NODEMAILER;

const secretKeyStripe = process.env.SECRET_KEY_STRIPE;

const corsURL = process.env.CORS_URL;

export {
    adminKey,
    premiumKey,
    mongoUrl, 
    privateKeyJWT,
    userNodemailer,
    passwordNodemailer,
    secretKeyStripe,
    corsURL
};