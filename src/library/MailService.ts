import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    async sendPasswordResetRequest(email: string, token: string){
        //TODO: USE URL OF REMOTE FRONTEND DURING RELEASE
        const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}`;
    
        await this.transporter.sendMail({
            from: '"Guess Location App" <no-reply@geotagger.com>',
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
            html: `<p>You requested a password reset. Click the link to reset your password:</p>
                   <a href="${resetUrl}">${resetUrl}</a>`,
          });
    }

    async testConnection() {
        try {
            await this.transporter.verify();
            Logger.log('SMTP server is ready to take messages');
        } catch (error) {
            Logger.error('SMTP server connection error:', error);
        }
    }
}