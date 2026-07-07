import nodemailer from "nodemailer";

// Inga hardcoded string values ethuvum direct-ah iruka koodathu!
const smtpUser = process.env.EMAIL_USER;
const smtpPass = process.env.EMAIL_PASS;

// Secure Port 465 Layer Setup
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true only for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verification log context on server launch
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Configuration Connection Error:", error.message);
  } else {
    console.log("SMTP Brevo Server Connected Successfully!");
  }
});

export const sendResetEmail = async (email: string, resetLink: string): Promise<void> => {
  try {
    console.log("STEP 1: Attempting to send reset email via Brevo to:", email);

    if (!smtpUser || !smtpPass) {
      throw new Error("SMTP Credentials are completely missing from Environment Context!");
    }

    await Promise.race([
      transporter.sendMail({
        from: `"AI-Shop Support" <${smtpUser}>`, 
        to: email,
        subject: "Reset Your Password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #333333; text-align: center;">Reset Password Request</h2>
            <p style="font-size: 16px; color: #555555; line-height: 1.5;">Hello,</p>
            <p style="font-size: 16px; color: #555555; line-height: 1.5;">We received a request to reset the password for your AI-Shop account. Click the secure link button below to complete the setup configuration:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" target="_blank" style="background-color: #0087ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset My Password</a>
            </div>
            <p style="font-size: 14px; color: #888888; line-height: 1.5; text-align: center;">If you did not request this modification link, you can safely ignore this automated message.</p>
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