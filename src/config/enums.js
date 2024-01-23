import { adminKey, premiumKey } from "./config.js";

const validCategories = [
    'Bazaar', 
    'Herramientas', 
    'Electrodomésticos', 
    'Pequeños Electrodomésticos'
]

const validKeys = [
    'title', 
    'category', 
    'description', 
    'price', 
    'thumbnail', 
    'code', 
    'stock'
];

const passportStrategiesEnum = {
    JWT: 'jwt',
    NOTHING: 'na'
};

const accessRolesEnum = {
    ADMIN: adminKey,
    USER: "USER",
    PUBLIC: "PUBLIC",
    PREMIUM: premiumKey,
    PWDRESET: "PASSWORDRESET"
};

const errorsEnum = {
    ROUTING_ERROR : 1,
    DATABASE_ERROR : 2,
    NOT_FOUND_ERROR : 3,
    INCOMPLETE_VALUES_ERROR : 4,
    VALIDATION_ERROR : 5,
    UNAUTHORIZED_ERROR : 6,
    CONFLICT_ERROR : 7,
    UNHANDLED_ERROR: 8
};

export {
    validCategories,
    validKeys,
    passportStrategiesEnum,
    accessRolesEnum,
    errorsEnum
}