import Messages from "../dao/classes/messages.dao.js";

const messagesManager = new Messages();

const getMessages = async (user, receiver = null) => {
    let messages;
    if (sender != null) {
        messages = await messagesManager.readConversation(user, receiver);
        messages.push(await messagesManager.readConversation(receiver, user))
    } else {
        messages = await messagesManager.readBySender(user);
        messages.push(await messagesManager.readByReceiver(user));
    };
    return messages;
};

const getMessageById = async (id) => {
    const message = await messagesManager.readByID(id);
    return message;
};

const saveMessage = async (message) => {
    await messagesManager.create(message);
    return message;
};

const deleteMessage = async (id) => {
    return await messagesManager.delete(id);
};

export {
    getMessages,
    getMessageById,
    saveMessage,
    deleteMessage
};