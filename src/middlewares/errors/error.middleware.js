import { errorsEnum } from "../../config/enums.js";

export default (error, req, res, next) => {
    switch(error.code) {
        case errorsEnum.ROUTING_ERROR:
            res.status(404).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;
        case errorsEnum.DATABASE_ERROR:
            res.status(503).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;
        case errorsEnum.NOT_FOUND_ERROR:
            res.status(404).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;
        case errorsEnum.INCOMPLETE_VALUES_ERROR:
            res.status(400).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;
        case errorsEnum.VALIDATION_ERROR:
            res.status(400).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;
        case errorsEnum.UNAUTHORIZED_ERROR:
            res.status(401).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;
        case errorsEnum.CONFLICT_ERROR:
            res.status(409).send({
                status: 'error',
                error: error.name,
                description: error.cause
            });
            break;
        default:
            res.status(500).send({
                status: 'error',
                error: error.name,
                description: error.case
            });
            break;
    };
    next();
};