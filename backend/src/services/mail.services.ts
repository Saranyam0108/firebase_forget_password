import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Error:", error);
  } else {
    console.log("SMTP Connected Successfully");
  }
});

export const sendResetEmail = async (
  email: string,
  resetLink: string
) => {
  try {
    console.log("STEP 1: sendResetEmail started");

const info = await Promise.race([
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `
      <h2>Reset Password</h2>
      <a href="${resetLink}">Reset Password</a>
    `,
  }),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout after 15 seconds")), 15000)
  ),
]);

    console.log("Email Sent Successfully");
    console.log(info);

  } catch (err) {
    console.error("Email Send Error:", err);
    throw err;
  }
};