import { Router as expressRouter } from 'express';
import passport from 'passport';
import { passportStrategiesEnum } from '../config/enums.js';

export default class Router {
    constructor() {
        this.router = expressRouter();
        this.init();
    };

    getRouter() {
        return this.router;
    };

    init() {};

    get (path, policies, passportStrategy, ...callbacks) {
        this.router.get(
            path,
            this.applyCustomPassportCall(passportStrategy),
            this.handlePolicies(policies),
            this.applyCallbacks(callbacks)
            );
        };
        
    post (path, policies, passportStrategy, ...callbacks) {
        this.router.post(
            path,
            this.applyCustomPassportCall(passportStrategy),
            this.handlePolicies(policies),
            this.applyCallbacks(callbacks)
        );
    };

    put (path, policies, passportStrategy, ...callbacks) {
        this.router.put(
            path,
            this.applyCustomPassportCall(passportStrategy),
            this.handlePolicies(policies),
            this.applyCallbacks(callbacks)
        );
    };

    delete (path, policies, passportStrategy, ...callbacks) {
        this.router.delete(
            path,
            this.applyCustomPassportCall(passportStrategy),
            this.handlePolicies(policies),
            this.applyCallbacks(callbacks)
        );
    };

    applyCustomPassportCall = (strategy) => (req, res, next) => {
        if (strategy === passportStrategiesEnum.JWT) {
            passport.authenticate(strategy, function (err, user, info) {
                if (err) return next(err);
                if (!user) {
                    return res.status(401).send({
                        error: info.messages ? info.messages : info.toString()
                    });
                };
                req.user = user;
                next();
            })(req,res,next);
        } else {
            next();
        };
    };

    handlePolicies = (policies) => (req, res, next) => {
        if (policies[0] === 'PUBLIC') return next();
        const user = req.user;
        if (!policies.includes(user.role))
            return res.status(403).json({status: 'error', error: 'There are no permissions related to your user.'});
        next();
    };

    //? REVISAR LAS RESPONSES AL CREAR LOS CUSTOM ERRORS
    generateCustomResponse = (req, res, next) => {
        res.sendSuccess = (data) => {
            res.status(200).json({data});
        };

        res.sendSuccessNewResource = (data) => {
            res.status(201).json({data});
        };

        res.sendServerError = (error) => {
            res.status(500).json({error});
        };

        res.sendClientError = (error) => {
            res.status(400).json({error});
        };

        res.sendValidationError = (error) => {
            res.status(412).json({error});
        };

        res.sendNotFoundError = (error) => {
            res.status(404).json({error});
        };

        next();
    };

    applyCallbacks (callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params);
            } catch (e) {
                params[1].status(500).json({status: 'error', message: e.message});
            };
        });
    };

};