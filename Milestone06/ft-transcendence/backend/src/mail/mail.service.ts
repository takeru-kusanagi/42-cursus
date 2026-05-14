import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter: Transporter | null = null;
  private etherealUrl: string | null = null;

  async onModuleInit() {
    if (process.env.SMTP_HOST) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      this.etherealUrl = 'https://ethereal.email';
      console.log('[Mail] Ethereal test account created for dev. Each sent email will log a preview URL below.');
      console.log('[Mail] Or login at https://ethereal.email with user:', testAccount.user, 'pass:', testAccount.pass);
    }
  }

  getEtherealUrl(): string | null {
    return this.etherealUrl;
  }

  async sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
    if (!this.transporter) throw new Error('Mail transporter not initialized');

    const info = await this.transporter.sendMail({
      from: process.env.MAIL_FROM || '"ft_transcendence" <noreply@ft-transcendence.local>',
      to,
      subject: 'Verify your email - ft_transcendence',
      html: `
        <p>Please click the link below to verify your email:</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
        <p>This link expires in 24 hours.</p>
      `,
    });

    if (this.etherealUrl && process.env.NODE_ENV !== 'production') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('[Mail] View this email at:', previewUrl);
      }
    }
  }

  async sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
    if (!this.transporter) throw new Error('Mail transporter not initialized');

    const info = await this.transporter.sendMail({
      from: process.env.MAIL_FROM || '"ft_transcendence" <noreply@ft-transcendence.local>',
      to,
      subject: 'Reset your password - ft_transcendence',
      html: `
        <p>Please click the link below to reset your password:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link expires in 1 hour.</p>
      `,
    });

    if (this.etherealUrl && process.env.NODE_ENV !== 'production') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('[Mail] View this email at:', previewUrl);
      }
    }
  }

  async sendDataExportNotification(to: string): Promise<void> {
    if (!this.transporter) throw new Error('Mail transporter not initialized');

    const info = await this.transporter.sendMail({
      from: process.env.MAIL_FROM || '"ft_transcendence" <noreply@ft-transcendence.local>',
      to,
      subject: 'Your data export is ready - ft_transcendence',
      html: `
        <p>Your personal data export has been completed and downloaded.</p>
        <p>If you did not request this export, please secure your account immediately.</p>
      `,
    });

    if (this.etherealUrl && process.env.NODE_ENV !== 'production') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('[Mail] View this email at:', previewUrl);
      }
    }
  }

  async sendAccountDeletionNotification(to: string): Promise<void> {
    if (!this.transporter) throw new Error('Mail transporter not initialized');

    const info = await this.transporter.sendMail({
      from: process.env.MAIL_FROM || '"ft_transcendence" <noreply@ft-transcendence.local>',
      to,
      subject: 'Your account has been deleted - ft_transcendence',
      html: `
        <p>Your account and all associated data have been permanently deleted.</p>
        <p>If you did not request this deletion, please contact support immediately.</p>
      `,
    });

    if (this.etherealUrl && process.env.NODE_ENV !== 'production') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('[Mail] View this email at:', previewUrl);
      }
    }
  }
}
