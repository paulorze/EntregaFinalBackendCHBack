import Products from "../dao/classes/products.dao.js";

const productsManager = new Products();

const getProducts = async (limit = null, page = null) => {
    let products;
    if (limit != null && page!= null) {
        products = await productsManager.readAllPaginated(limit, page);
    } else {
        products = await productsManager.readAll();
    };
    return products;
};

const getProductById = async (id) => {
    return await productsManager.readByID(id);
};

const saveProduct = async (product) => {
    return await productsManager.addProduct(product);
};

const deleteProduct = async (id, owner) => {
    return await productsManager.deleteProduct(id, owner);
};

const updateProduct = async (id, owner, data) => {
    return await productsManager.updateProduct(id, owner, data);
};

export {
    getProducts,
    getProductById,
    saveProduct,
    deleteProduct,
    updateProduct
};