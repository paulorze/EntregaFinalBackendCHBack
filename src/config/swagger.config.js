import swaggerJSDoc from "swagger-jsdoc";
import { __mainDirname } from "../utils.js";

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación del Proyecto Backend para CoderHouse',
            description: 'API creada para aprender MongoDB, NodeJS y demás'
        }
    },
    apis: [`${__mainDirname}/docs/**/*.yaml`]
};

export const swaggerSpecs = swaggerJSDoc(swaggerOptions);