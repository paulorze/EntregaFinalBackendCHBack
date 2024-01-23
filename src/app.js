import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import passport from 'passport';
import swaggerUiExpress from 'swagger-ui-express';
import __dirname, { addLogger } from './utils.js';
import './dao/dbConfig.js';
import errorHandler from './middlewares/errors/error.middleware.js'
import CartsRouter from './routes/carts.router.js';
import ProductsRouter from './routes/products.router.js';
import UsersRouter from './routes/users.router.js';
import initializePassport from './config/passport.config.js';
import MessagesRouter from './routes/messages.router.js';
import TicketsRouter from './routes/tickets.router.js';
import { swaggerSpecs } from './config/swagger.config.js';
import PaymentsRouter from './routes/payments.router.js';
import { corsURL } from './config/config.js';

const cartsRouter = new CartsRouter();
const messagesRouter = new MessagesRouter();
const productsRouter = new ProductsRouter();
const sessionsRouter = new UsersRouter();
const ticketsRouter = new TicketsRouter();
const paymentsRouter = new PaymentsRouter();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());
const corsOptions = {
    origin: corsURL,
    credentials: true
}
app.use(cors());
app.use(errorHandler);
app.use(addLogger);

app.use('/api/carts', cartsRouter.getRouter());
app.use('/api/messages', messagesRouter.getRouter());
app.use('/api/products', productsRouter.getRouter());
app.use('/api/users', sessionsRouter.getRouter());
app.use('/api/tickets', ticketsRouter.getRouter());
app.use('/api/payments', paymentsRouter.getRouter());
app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpecs));
app.get('/loggerTest', (req, res) => {
    req.logger.fatal('Testing the logger for: fatal');
    req.logger.error('Testing the logger for: error');
    req.logger.warning('Testing the logger for: warn');
    req.logger.info('Testing the logger for: info');
    req.logger.http('Testing the logger for: http');
    req.logger.debug('Testing the logger for: debug');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=> console.log('Server Running'));