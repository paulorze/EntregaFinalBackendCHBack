import passport from 'passport';
import jwt from 'passport-jwt';
import { passportStrategiesEnum } from './enums.js';
import { privateKeyJWT } from './config.js';

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use(passportStrategiesEnum.JWT, new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: privateKeyJWT
    }, async(jwt_payload, done)=> {
        try {
            return done(null, jwt_payload.user);
        } catch (e) {
            return done(e);
        };
    }));
};

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['session']
    };
    return token;
}

export default initializePassport;