const axios = require('axios');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Natours <${process.env.EMAIL_FROM}>`;
    }

    async send(template, subject) {
        // 1) Render HTML based on a Pug template
        const html = pug.renderFile(
            `${__dirname}/../views/email/${template}.pug`,
            {
                firstName: this.firstName,
                url: this.url,
                subject
            }
        );

        // 2) Convert HTML to plain text
        const text = htmlToText.convert(html);

        // 3) Send email using SendGrid Web API
        await axios.post(
            'https://api.sendgrid.com/v3/mail/send',
            {
                personalizations: [
                    {
                        to: [
                            {
                                email: this.to
                            }
                        ]
                    }
                ],
                from: {
                    email: process.env.EMAIL_FROM,
                    name: 'Natours'
                },
                subject,
                content: [
                    {
                        type: 'text/plain',
                        value: text
                    },
                    {
                        type: 'text/html',
                        value: html
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );
    }

    async sendWelcome() {
        await this.send(
            'welcome',
            'Welcome to the Natours Family!'
        );
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token (valid for only 10 minutes)'
        );
    }
};
