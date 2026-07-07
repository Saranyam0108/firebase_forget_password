import nodemailer from "nodemailer";

// Strict secret variable assignment from process memory
const smtpUser = process.env.EMAIL_USER;
const smtpPass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

// Verification check log on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Configuration Connection Error:", error);
  } else {
    console.log("SMTP Brevo Server Connected Successfully!");
  }
});

export const sendResetEmail = async (email: string, resetLink: string): Promise<void> => {
  try {
    console.log("STEP 1: Attempting to send reset email via Brevo to:", email);

    // Safeguard check if server context has variables loaded
    if (!smtpUser || !smtpPass) {
      throw new Error("SMTP Credentials are completely missing from Environment!");
    }

    // Promise race setup with timeout safeguard handling
    await Promise.race([
      transporter.sendMail({
        from: `"AI-Shop Support" <${smtpUser}>`, 
        to: email,
        subject: "Reset Your Password",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Reset Password Request</h2>
            <p>Click the link below to securely reset your account password:</p>
            <a href="${resetLink}" style="background-color: #0087ff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            <p style="margin-top: 20px; color: #555;">If you did not request this, please ignore this email.</p>
          </div>
        `,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Brevo SMTP Gateway Timeout (15 seconds limit)")), 15000)
      ),
    ]);

    console.log("STEP 2: Email Dispatched Successfully via Brevo Engine.");
  } catch (err: any) {
    console.error("Email Send Operation Failed in mail.services:", err.message);
    throw new Error(`SMTP Mailer Failure: ${err.message}`);
  }
};