// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';

@Injectable()
export class MailService {
    private transporter;
    private oauth2Client;

    constructor() {

        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'https://developers.google.com/oauthplayground'
        );

        console.log('Refresh Token:',);


        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GOOGLE_EMAIL,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN, // Replace with your refresh token
                accessToken: process.env.GOOGLE_ACCESS_TOKEN, // Call to getAccessToken method
            },
        });
    }

    private async getAccessToken() {
        const { token } = await this.oauth2Client.getAccessToken();

        console.log("tokennn", token)
        return token;
    }

    async sendMail(to: string, subject: string, text: string, html: string) {
        const mailOptions = {
            from: process.env.GOOGLE_EMAIL,
            to: to,
            subject: subject,
            text: text,
            html: html,
        };

        await this.transporter.sendMail(mailOptions);
    }
}

