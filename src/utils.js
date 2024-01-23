// Esto es para poder acceder a los archivos por su ubicacion sin problemas
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
// Esto es para hashear las passwords
import bcrypt from 'bcrypt';
// Esto es para las sesiones
import jwt from 'jsonwebtoken';
import { passwordNodemailer, privateKeyJWT, userNodemailer } from './config/config.js';
// Esto es para el mocking
import {fakerES as faker } from '@faker-js/faker';
import { validCategories } from './config/enums.js';
// Esto es para el logger
import winston from 'winston';
import * as dotenv from 'dotenv';
// Esto es para enviar correos y resetear password
import nodemailer from 'nodemailer';

// Esto es para poder acceder a los archivos por su ubicacion sin problemas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;
export const __mainDirname = join(__dirname, '..');

// Esto es para hashear las passwords
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (plainPassword, hashedPassword) => bcrypt.compareSync(plainPassword, hashedPassword);

// El siguiente codigo corresponde a la permanencia de la sesion del usuario
export const generateToken = (user, time)=> {
    const token = jwt.sign({user}, privateKeyJWT, {expiresIn: time});
    return token;
};

// El siguiente codigo corresponde al mock de productos

export const mockProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        category: faker.helpers.arrayElement(validCategories),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: [faker.image.url(), faker.image.url(), faker.image.url()],
        code: faker.string.alphanumeric(4),
        stock: faker.number.int(1),
    };
};

// El siguiente codigo corresponde al logger:
dotenv.config();
const ENVIRONMENT = process.env.NODE_ENV;

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'green',
        debug: 'blue'
    }
};

let logger;

if(ENVIRONMENT === 'PRODUCTION') {
    logger = winston.createLogger({
        levels: customLevelOptions.levels,
        transports: [
                new winston.transports.Console({
                    level: 'info',
                    format: winston.format.combine(
                        winston.format.colorize({
                            all: true,
                            colors: customLevelOptions.colors
                        }),
                        winston.format.simple()
                    )
                }),
                new winston.transports.File({
                    filename: 'logs/errors.log',
                    level: 'error'
                })
            ]
        });
} else {
    logger = winston.createLogger({
        levels: customLevelOptions.levels,
        transports: [
                new winston.transports.Console({
                    level: 'debug',
                    format: winston.format.combine(
                        winston.format.colorize({
                            all: true,
                            colors: customLevelOptions.colors
                        }),
                        winston.format.simple()
                    )
                })
            ]
        });
};

export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
    next();
};

// Esto corresponde al mail
export const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: userNodemailer,
        pass: passwordNodemailer
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const passwordResetTokenVerification = (token) => {
    try {
        const decoded = jwt.verify(token, privateKeyJWT);
        return decoded;
    } catch (err) {
        return null;
    };
};

