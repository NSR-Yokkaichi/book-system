import nodemailer from "nodemailer";

/**
 * @summary メール送信の設定
 * @description メール送信の設定を行う。これにより、メール送信を行うことができる。
 * @type {Object}
 * @author yuito-it <yuito@yuito-it.jp>
 * @see https://nodemailer.com/smtp/
 */
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
