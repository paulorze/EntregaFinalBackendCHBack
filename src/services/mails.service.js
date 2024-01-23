import { transporter } from "../utils.js"
import { resetPasswordHTML, userDeletedHTML } from "../utils/mailhtml.js";

export const sendEmailReset = async (email, token) => {
    await transporter.sendMail({
        from: 'BackendCH',
        to: email,
        subject: 'Password Reset',
        html: resetPasswordHTML(token)
    });
};

export const sendEmailDeletedUser = async (email) => {
    await transporter.sendMail({
        from: 'BackendCH',
        to: email,
        subject: 'User Deleted For Inactivity',
        html: userDeletedHTML()
    });
};

export const sendEmailDeletedProduct = async (email, id) => {
    await transporter.sendMail({
        from: 'BackendCH',
        to: email,
        subject: 'Product Deleted',
        html: userDeletedHTML(id)
    });
};
