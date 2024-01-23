const generateCartAddProductErrorInfo = (pid, quantity) => {
    return `Incomplete values.
    * Product ID (pid) : needs to be a string, received ${pid},
    * quantity  : needs to be an integer, received ${quantity},
    Failed to add product to cart.`;
};
const generateCartAddProductArrayErrorInfo = (products) => {
    return `Incomplete values.
    * products : needs to be an array, received ${products},
    Failed to add products to cart.`;
};

const generateCartAddProductOwnerErrorInfo = () => {
    return `Users can not add products they own to their carts.`;
};

const generateCartCreateErrorInfo = (purchaser) => {
    return `Incomplete values.
    * purchaser needs to be a string, reaceived ${purchaser}.
    Failed to create cart.`
} ;

const generateCartDeleteProductErrorInfo = () => {
    return `Incomplete values.
    * Product ID (pid) : needs to be a string, received ${pid}.
    Failed to delete product from cart.`;
};

const generateDatabaseErrorInfo = () => {
    return `Error trying to connect to the database. Operation failed.`
};

const generateDocumentationErrorInfo = () => {
    return `Incomplete documentation. The needed documentation is:
    * Identificacion
    * Comprobante de domicilio
    * Comprobante de estado de cuenta
    `
};

const generateEmptyCartErrorInfo = () => {
    return `Cart contains no products.`
};

const generateInvalidKeysErrorInfo = () => {
    return `One or more object keys are not valid.`;
}

const generateMessageCreateErrorInfo = (message) => {
    return `Incomplete values.
    * user : needs to be a string, received ${message.user},
    * receiver : needs to be a string, received ${message.reciver},
    * message : needs to be a string, received ${message.message},
    Failed to create message.`
};

const generateMissingEmailErrorInfo = () => {
    return `Missing Email parameter.`
};

const generateMissingFilesErrorInfo = () => {
    return `Missing Files to upload.`
};


const generateMissingIdErrorInfo = () => {
    return `Missing ID parameter.`
};

const generateMissingPasswordErrorInfo = () => {
    return `Missing Password parameter.`
};

const generatePasswordResetErrorInfo = () => {
    return `The new password can not be the same as the old password.`;
};

const generateProductFieldValidationErrorInfo = (input, field) => {
    return `The input "${input}" sent for ${field} is not valid.`;
};

const generateProductCreateErrorInfo = (product) => {
    return `Incomplete values.
    * title : needs to be a string, received ${product.title},
    * category : needs to be a string, received ${product.category},
    * description : needs to be a string, received ${product.description},
    * code : needs to be a string, received ${product.code},
    * price : needs to be an integer or float, received ${product.price},
    * stock needs to be an integer, received ${product.stock}.
    Failed to create product.`;
};

const generateProductNotFoundErrorInfo = (id) => {
    return `The object with id "${id}" does not exist.`;
};

const generateServerErrorInfo = () => {
    return `Unable to communicate with the server.`;
};

const generateTicketCreateErrorInfo = (ticket) => {
    return `Incomplete values.
    * purchaser: needs to be a string, received ${ticket.purchaser},
    * amount: needs to be an integer or float, received ${ticket.amount},
    * products: needs to be an array of products, received ${ticket.products}.
    Failed to create ticket.`;
};

const generateUnauthorizedErrorInfo = () => {
    return `You have no permissions to access the requested resource.`;
};

const generateUnhandledErrorInfo = () => {
    return `An unexpected error occurred.`;
};

const generateUserCreateErrorInfo = (user) => {
    return `Incomplete values. List of required properties:
    * username : needs to be a string, received ${user.username},
    * first_name : needs to be a string, received ${user.first_name},
    * last_name : needs to be a string, received ${user.last_name},
    * email : needs to be a string, received ${user.email},
    * password : needs to be a string.
    Failed to create user.`;
};

const generateUserConflictErrorInfo = (param) => {
    return `The mail "${param}" is already in use.`;
};

const generateUserLoginErrorInfo = () => {
    return `Invalid username or password.`;
};

const generateUserUpdateErrorInfo = (user) => {
    return `Incomplete values. List of required properties:
    * username : needs to be a string, received ${user.username},
    * first_name : needs to be a string, received ${user.first_name},
    * last_name : needs to be a string, received ${user.last_name},
    * email : needs to be a string, received ${user.email},
    Failed to create user.`;
};


export {
    generateCartAddProductErrorInfo,
    generateCartAddProductArrayErrorInfo,
    generateCartAddProductOwnerErrorInfo,
    generateCartCreateErrorInfo,
    generateCartDeleteProductErrorInfo,
    generateDatabaseErrorInfo,
    generateDocumentationErrorInfo,
    generateEmptyCartErrorInfo,
    generateInvalidKeysErrorInfo,
    generateMessageCreateErrorInfo,
    generateMissingIdErrorInfo,
    generateMissingEmailErrorInfo,
    generateMissingFilesErrorInfo,
    generateMissingPasswordErrorInfo,
    generatePasswordResetErrorInfo,
    generateProductNotFoundErrorInfo,
    generateProductCreateErrorInfo,
    generateProductFieldValidationErrorInfo,
    generateServerErrorInfo,
    generateTicketCreateErrorInfo,
    generateUnauthorizedErrorInfo,
    generateUnhandledErrorInfo,
    generateUserCreateErrorInfo,
    generateUserConflictErrorInfo,
    generateUserLoginErrorInfo,
    generateUserUpdateErrorInfo,
};