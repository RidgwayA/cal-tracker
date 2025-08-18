import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,         
  secure: true,       
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendResetEmail(toEmail: string, resetLink: string) {
  await transporter.sendMail({
    from: `"Cal Tracker" <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: "Password Reset",
    html: `<p>Click to reset: <a href="${resetLink}">Reset Password</a></p>`,
  });
}
