import nodemailer, { Transporter } from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';
import { EmailParams, EmailServiceInterface } from './emailService.interface';

@Injectable()
export class EmailService implements EmailServiceInterface {
  public readonly name = 'NODEMAILER_SMTP';
  private transporter: Transporter;
  private logger = new Logger(this.name);

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    this.transporter
      .verify()
      .then(() => this.logger.debug('Nodemailer SMTP connection verified'))
      .catch((error) =>
        this.logger.error('Nodemailer SMTP connection failed', error),
      );
  }

  async send(params: EmailParams): Promise<void> {
    const startTime = Date.now();
    try {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: Array.isArray(params.to) ? params.to.join(', ') : params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
        replyTo: params.replyTo,
        headers: {
          'X-Application': 'Kissalo',
          'X-Email-Type': params.metadata?.type || 'transactional',
          ...params.metadata?.headers,
        },
      };

      const info = await this.transporter.sendMail(mailOptions);

      const duration = Date.now() - startTime;
      this.logger.debug('Email sent successfully', {
        messageId: info.messageId,
        to: params.to,
        subject: params.subject,
        duration,
      });
    } catch (error) {
      this.logger.error('Failed to send email', {
        error: error.message,
        to: params.to,
        subject: params.subject,
        stack: error.stack,
      });
    }
  }

  async validate(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch {
      return false;
    }
  }
}
