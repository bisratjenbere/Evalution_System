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
      connectionTimeout: 10000,
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
  async notifyTheAvailabilityOfCycle({ startDate, endDate }) {
    const subject = "New Appraisal Cycle Initiated";
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
    <h2 style="margin-bottom: 15px;">Evaluation Period Starts Today!</h2>
    <p>This is a friendly reminder that the new appraisal cycle has begun. The evaluation period is now open, and we encourage you to complete your self-assessment and provide feedback for your colleagues during this time.</p>
    <ul style="list-style-type: none; padding: 0; margin-top: 20px;">
      <li><strong>Start Date:</strong> ${startDate}</li>
      <li><strong>End Date:</strong> ${endDate}</li>
    </ul>
    <p style="margin-top: 15px;">For a smooth evaluation process, we recommend you take the following steps:</p>
      <ol style="padding: 0; list-style-type: decimal; margin-left: 20px;">
        <li>Review your goals and objectives set during the previous cycle.</li>
        <li>Complete your self-assessment form, reflecting on your accomplishments and areas for improvement.</li>
        <li>Schedule meetings with colleagues to provide and receive feedback.</li>
      </ol>
    <p style="margin-top: 20px;">You can access the appraisal portal and manage the entire cycle <a href="URL_TO_APPRAISAL_CYCLE" style="color: #007bff; text-decoration: none;">here</a>.</p>
    <p style="margin-top: 20px;">We believe in fostering a culture of continuous development and growth. This evaluation process is an opportunity to reflect on your achievements, identify areas for improvement, and set goals for the future.</p>
    <p style="margin-top: 20px;">Best regards,</p>
    <p>Your AppraisalCycle Team</p>
  </div>
        `;
    await this.send(htmlContent, subject);
  }
}
