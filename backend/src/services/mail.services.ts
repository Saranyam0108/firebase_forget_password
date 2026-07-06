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

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",

      html: `
        <h2>Reset Password</h2>

        <p>Hello,</p>

        <p>Click the button below to reset your password.</p>

        <a href="${resetLink}"
          style="
            background:#1976d2;
            color:white;
            padding:12px 20px;
            text-decoration:none;
            border-radius:5px;
            display:inline-block;
            font-weight:bold;">
          Reset Password
        </a>
      `,
    });

    console.log("Email Sent Successfully");
    console.log(info);

  } catch (err) {
    console.error("Email Send Error:", err);
    throw err;
  }
};