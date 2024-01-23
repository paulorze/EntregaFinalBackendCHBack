import Users from "../dao/classes/users.dao.js";

const usersManager = new Users();

const getUser = async (id) => {
    return await usersManager.readByID(id);
};

const getUserList = async () => {
    return await usersManager.readAllUsers();
};

const saveUser = async (user) => {
    return await usersManager.create(user);
};

const updateUser = async (id, user) => {
    return await usersManager.update(id, user);
};

const deleteUser = async (id) => {
    return await usersManager.delete(id);
};

const recategorizeUser = async (id) => {
    return await usersManager.recategorize(id);
};

const deleteById = async (id)=> {
    return await usersManager.delete(id);
};

const getUserByEmail = async (email) => {
    return await usersManager.readByEmail(email);
};

const updateLastConnection = async (email) => {
    return await usersManager.updateLastConnectionRepo(email);
};

const deleteInactiveUsersService = async () => {
    return await usersManager.deleteInactiveUsersRepo();
};

export {
    getUser,
    getUserList,
    saveUser,
    updateUser,
    deleteUser,
    recategorizeUser,
    deleteById,
    getUserByEmail,
    updateLastConnection,
    deleteInactiveUsersService
};