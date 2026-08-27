const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Natours <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        console.log('EMAIL 1 - Creating SendGrid transport');

        const transporter = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD
            },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 10000
        });

        console.log('EMAIL 2 - Transport created');

        return transporter;
    }

    // Send the actual email
    async send(template, subject) {
        console.log('EMAIL 3 - Rendering template');
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });

        console.log('EMAIL 4 - Template rendered');
        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.convert(html)
        };

        console.log('EMAIL 5 - Before sendMail');
        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
        console.log('EMAIL 6 - sendMail finished');
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token (valid for only 10 minutes)'
        );
    }
};


// const sendEmail = async options => {
//     // 1) Create a transporter
//     const transporter = nodemailer.createTransport({
//         // service: 'Gmail',
//         host: process.env.EMAIL_HOST,
//         port: Number(process.env.EMAIL_PORT),
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD
//         }
//         // Activate in gmail "less secure app" option
//     })
//     // 2) Define the email options
//     const mailOptions = {
//         from: 'Mahmoud Emad <hello@mahmoud.io>',
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//         // html:
//     }

//     // 3) Actually send the email
//     await transporter.sendMail(mailOptions)
// }

// module.exports = sendEmail;

// await sendEmail({
//     email: user.email,
//     subject: 'Your password reset token (valid for 10 min)',
//     message
// })

// const message = `Forgot your password Submit a PATCH request with your new password and passwordConfirm to: ${resetToken}.\n If you didn't forget your password, please ignore this email! `;