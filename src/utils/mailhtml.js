export const resetPasswordHTML = (token) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
            body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            }
    
            .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            h1 {
            color: #333333;
            }
    
            p {
            color: #555555;
            }
    
            .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007BFF;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            }
    
            .button:hover {
            background-color: #0056b3;
            }
        </style>
        </head>
        <body>
        <div class="container">
            <h1>Password Reset</h1>
            <p>You have requested to reset your password. Click the button below to proceed:</p>
            <a class="button" href="http://localhost:8080/api/users/passwordReset?token=${token}" target="_blank">Reset Password</a>
        </div>
        </body>
    </html>`;
};

export const userDeletedHTML = ()=> {
    return `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }

                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    color: #333;
                }

                p {
                    color: #666;
                }

            </style>
        </head>

        <body>
            <div class="container">
                <h1>Your Account has been Deleted</h1>
                <p>
                    Dear User,

                    We regret to inform you that your account on our site has been deleted due to inactivity.
                    If you believe this is an error or wish to reactivate your account, please contact our support team.

                    Thank you for being a part of our community.

                    Best regards,
                    The BackendCH Team
                </p>
            </div>
        </body>

        </html>
        `
};

export const deletedProductHTML = (id) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
        
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
        
                h1 {
                    color: #333;
                }
        
                p {
                    color: #666;
                }
            </style>
        </head>
        
        <body>
            <div class="container">
                <h1>Your Product has been Deleted</h1>
                <p>
                    Dear User,
        
                    We want to inform you that the product you listed on our site with ID ${id} has been successfully deleted.
                    If you have any questions or concerns, please feel free to contact our support team.
        
                    Thank you for using our platform.
        
                    Best regards,
                    The BackendCH Team
                </p>
            </div>
        </body>
        
        </html>
    `
}