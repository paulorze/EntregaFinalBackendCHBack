import Router from "./router.js";
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import { getAllCarts, getCart, newCart, deleteCartByEmail, addCartProducts, addCartProductById, deleteCartProductById, purchase } from '../controllers/carts.controller.js';

export default class CartsRouter extends Router {
    constructor () {
        super();
    };

    init() {
        this.get('/',[accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, getCart);
        this.post('/', [accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, newCart);
        this.put('/', [accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, addCartProducts);
        this.delete('/', [accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, deleteCartByEmail);
        this.get('/all', [accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, getAllCarts);
        this.put('/addProduct', [accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, addCartProductById);
        this.delete('/deleteProduct', [accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, deleteCartProductById);
        this.post('/purchase', [accessRolesEnum.USER, accessRolesEnum.PREMIUM, accessRolesEnum.ADMIN], passportStrategiesEnum.JWT, purchase)
    };

};