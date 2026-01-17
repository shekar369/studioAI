import nodemailer from 'nodemailer';
import { env } from '../config/environment.js';

// Create transporter (lazy initialization)
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    if (env.NODE_ENV === 'development' && !env.SMTP_HOST) {
      // Use ethereal.email for development testing
      console.log('Email: Using console output (no SMTP configured)');
      return {
        sendMail: async (options: nodemailer.SendMailOptions) => {
          console.log('========== EMAIL PREVIEW ==========');
          console.log(`To: ${options.to}`);
          console.log(`Subject: ${options.subject}`);
          console.log(`Body: ${options.html || options.text}`);
          console.log('===================================');
          return { messageId: 'dev-message-id' };
        },
      } as unknown as nodemailer.Transporter;
    }

    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  return transporter;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  const transport = getTransporter();

  await transport.sendMail({
    from: env.EMAIL_FROM,
    ...options,
  });
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verifyUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;

  await sendEmail({
    to: email,
    subject: 'Verify your Studio AI account',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0f; color: #fff; padding: 40px; }
            .container { max-width: 600px; margin: 0 auto; background: #1a1a28; border-radius: 16px; padding: 40px; }
            .logo { font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #7c3aed, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            h1 { color: #fff; margin-top: 24px; }
            p { color: #9ca3af; line-height: 1.6; }
            .button { display: inline-block; background: linear-gradient(135deg, #7c3aed, #3b82f6); color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; }
            .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #374151; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">Studio AI</div>
            <h1>Verify your email</h1>
            <p>Thanks for signing up! Please click the button below to verify your email address and get started with Studio AI.</p>
            <a href="${verifyUrl}" class="button">Verify Email</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #7c3aed;">${verifyUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <div class="footer">
              <p>If you didn't create an account with Studio AI, you can safely ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Verify your Studio AI account\n\nClick this link to verify your email: ${verifyUrl}\n\nThis link expires in 24 hours.`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: 'Reset your Studio AI password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0f; color: #fff; padding: 40px; }
            .container { max-width: 600px; margin: 0 auto; background: #1a1a28; border-radius: 16px; padding: 40px; }
            .logo { font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #7c3aed, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            h1 { color: #fff; margin-top: 24px; }
            p { color: #9ca3af; line-height: 1.6; }
            .button { display: inline-block; background: linear-gradient(135deg, #7c3aed, #3b82f6); color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0; }
            .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #374151; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">Studio AI</div>
            <h1>Reset your password</h1>
            <p>We received a request to reset your password. Click the button below to choose a new password.</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #7c3aed;">${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <div class="footer">
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Reset your Studio AI password\n\nClick this link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
  });
}
