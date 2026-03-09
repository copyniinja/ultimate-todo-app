import { Env } from "@/configs/env";
import { Logger } from "@/logger/types";
import nodemailer, { Transporter } from "nodemailer";

// Types
interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}
type MailResult =
  | { success: true; messageId: string }
  | { success: false; error: unknown };

export function createMailerService(env: Env, logger: Logger) {
  let transporter: Transporter;

  // switch provider
  switch (env.MAILER_EMAIL_PROVIDER?.toLocaleLowerCase()) {
    case "gmail":
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: env.MAILER_GMAIL_USER,
          pass: env.MAILER_APP_PASSWORD,
        },
      });
      break;
    case "postmark":
      transporter = nodemailer.createTransport({
        host: "smtp.postmarkapp.com",
        port: 587,
        secure: false,
        auth: {
          user: env.POSTMARK_SERVER_TOKEN,
          pass: env.POSTMARK_SERVER_TOKEN,
        },
        pool: true,
        maxConnections: 5,
        rateDelta: 1000,
        rateLimit: 10,
      });
      break;

    case "resend":
      transporter = nodemailer.createTransport({
        host: "smtp.resend.com",
        port: 587,
        secure: false,
        auth: { user: "resend", pass: env.RESEND_API_KEY },
      });
      break;

    case "mailgun":
      transporter = nodemailer.createTransport({
        host: "smtp.mailgun.org",
        port: 587,
        secure: false,
        auth: { user: "api", pass: env.MAILGUN_API_KEY },
      });
      break;

    case "sendgrid":
      transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        secure: false,
        auth: { user: "apikey", pass: env.SENDGRID_API_KEY },
      });
      break;
    default:
      // Fallback
      transporter = {
        sendMail: async (mail: any) => {
          logger.info("[EMAIL MOCK] Would send:", mail);
          return { messageId: "mock-" + Date.now() };
        },
      } as any;
      logger.warn("No email provider configured → emails are mocked");
  }

  // Verify connection
  if (env.MAILER_EMAIL_PROVIDER) {
    transporter.verify((error) => {
      if (error) {
        logger.error("Email transport verification failed", { error });
      } else {
        logger.info(`Email transport ready (${env.MAILER_EMAIL_PROVIDER})`);
      }
    });
  }

  // Send Mail
  async function sendMail(options: EmailOptions): Promise<MailResult> {
    try {
      const from = `"${env.EMAIL_FROM_NAME}" <${env.EMAIL_FROM_EMAIL}>`;
      const info = await transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        replyTo: options.replyTo,
        attachments: options.attachments,
        headers: { "X-Entity-Ref-ID": "your-app-" + Date.now() },
      });
      logger.info("Email sent", { messageId: info.messageId, to: options.to });
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error("Failed to send email", {
        error,
        to: options.to,
        subject: options.subject,
      });
      return { success: false, error };
    }
  }

  // High level methods
  async function sendWelcomeEmail(user: { email: string; name?: string }) {
    const name = user.name || "there";
    return sendMail({
      to: user.email,
      subject: "Welcome to Our App!",
      html: `
        <h1>Hello ${name}!</h1>
        <p>Thank you for joining us.</p>
        <p>We're excited to have you on board.</p>
        <p>Enjoy!</p>
      `,
    });
  }

  async function sendOtpEmail(
    email: string,
    otp: string,
    purpose: "login" | "signup" | "reset",
  ) {
    const purposeText = {
      login: "login",
      signup: "verify your email",
      reset: "reset your password",
    }[purpose];

    return sendMail({
      to: email,
      subject: `Your ${purposeText} OTP`,
      html: `
        <h2>Your OTP is: <strong>${otp}</strong></h2>
        <p>This code expires in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }

  return {
    sendMail,
    sendWelcomeEmail,
    sendOtpEmail,
  };
}

export type MailerService = ReturnType<typeof createMailerService>;
