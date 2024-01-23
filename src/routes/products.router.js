import Router from './router.js';
import { accessRolesEnum, passportStrategiesEnum } from '../config/enums.js';
import { deleteProductById, getAllProducts, getProduct, newProduct, updateProductById, mockProducts } from '../controllers/products.controller.js';

export default class ProductsRouter extends Router {
    constructor () {
        super();
    };

    init() {
        this.get('/mockingproducts', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, mockProducts);
        this.get('/', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getAllProducts);
        this.get('/:id', [accessRolesEnum.PUBLIC], passportStrategiesEnum.NOTHING, getProduct);
        this.post('/', [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, newProduct);
        this.put('/:id', [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, updateProductById);
        this.delete('/:id', [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM], passportStrategiesEnum.JWT, deleteProductById);
    };
};