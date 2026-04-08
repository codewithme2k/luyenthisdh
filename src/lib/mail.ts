import { SITE_METADATA } from "@/shared/site-metadata";

import nodemailer from "nodemailer";
const domain = SITE_METADATA.siteUrl;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  const mailOptions = {
    from: "noreply@madebyhuu.com",
    to: email,
    subject: "Reset your password",
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2>Reset your password</h2>
      <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>Graduate Medical Education</strong>.</p>
      <p>Vui lòng nhấn vào nút bên dưới để thiết lập mật khẩu mới:</p>
      <p style="text-align: center;">
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Đặt lại mật khẩu
        </a>
      </p>
      <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này. Liên kết sẽ hết hạn sau 1 giờ vì lý do bảo mật.</p>
      <p>Trân trọng,<br/>Đội ngũ Graduate Medical Education</p>
    </div>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully.");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  const mailOptions = {
    from: "noreply@madebyhuu.com",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: "noreply@madebyhuu.com",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
