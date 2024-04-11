import nodemailer from "nodemailer";
import { convert } from "html-to-text";

export default class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `Bisrat Jenbere <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(htmlContent, subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: htmlContent,
      text: convert(htmlContent),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    const subject = "Welcome to the Natours Family!";
    const htmlContent = `
      <p>Hello ${this.firstName},</p>
      <p>Welcome to the Natours Family!</p>
      <p>Thank you for joining us.</p>
      <p>Best regards,</p>
      <p>Bisrat Jenbere</p>
    `;
    await this.send(htmlContent, subject);
  }

  async sendGeneratedPassword(password) {
    const subject = "Your Generated Password";
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #007bff;">Hello ${this.firstName},</h2>
            <p>Your password for accessing the system is:</p>
            <div style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                <p style="font-size: 18px; margin: 0; padding: 0;"><strong>${password}</strong></p>
            </div>
            <p>Please keep it safe and do not share it with anyone.</p>
            <p>Best regards,</p>
           
        </div>
    `;
    await this.send(htmlContent, subject);
  }

  async sendPasswordReset() {
    const subject = "Your password reset token (valid for only 10 minutes)";
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <p>Hello ${this.firstName},</p>
      <p>You have requested a password reset. Please use the following button to reset your password:</p>
      <p style="margin-top: 20px;"><a href="${this.url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p style="margin-top: 10px;">This link is valid for 10 minutes only.</p>
      <p style="margin-top: 20px;">Best regards,</p>
      <p>Bisrat Jenbere</p>
    </div>
  `;
    await this.send(htmlContent, subject);
  }
}
