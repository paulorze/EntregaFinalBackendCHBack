import Carts from "../dao/classes/carts.dao.js";

const cartsManager = new Carts();

const getCarts = async (limit = null, page = null) => {
    let carts;
    if (limit != null && page != null) {
        carts = await cartsManager.readAllPaginated(limit, page);
    } else {
        carts = await cartsManager.readAll();
    };
    return carts;
};

const getCartByEmail = async (email) => {
    return await cartsManager.readByEmail(email);
};

const saveCart = async (cart) => {
    return await cartsManager.create(cart);
};

const deleteCart = async (email) => {
    return await cartsManager.deleteByMail(email);
};

const addCartProduct = async (email, pid, quantity) => {
    return await cartsManager.addCartProduct(email, pid, quantity);
};

const deleteCartProduct = async (email, pid) => {
    return await cartsManager.deleteCartProduct(email, pid);
};

const addCartProductsArray = async (email, products) => {
    return await cartsManager.addCartProductsArray(email, products);
};

const completePurchase = async (email) => {
    return await cartsManager.completePurchase(email);
}

export {
    getCarts,
    getCartByEmail,
    saveCart,
    deleteCart,
    addCartProduct,
    deleteCartProduct,
    addCartProductsArray,
    completePurchase
};