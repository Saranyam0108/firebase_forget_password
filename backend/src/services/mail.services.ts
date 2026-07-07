const apiKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.BREVO_SENDER_EMAIL;

export const sendResetEmail = async (
  email: string,
  resetLink: string
): Promise<void> => {
  try {
    console.log("STEP 1: Sending reset email via Brevo API...");
    console.log("Recipient:", email);

    if (!apiKey) {
      throw new Error("BREVO_API_KEY is missing");
    }

    if (!senderEmail) {
      throw new Error("BREVO_SENDER_EMAIL is missing");
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: "AI-Shop Support",
          email: senderEmail,
        },
        to: [
          {
            email: email,
          },
        ],
        subject: "Reset Your Password",
        htmlContent: `
        <div style="font-family:Arial,sans-serif;padding:20px">

          <h2>Password Reset Request</h2>

          <p>Hello,</p>

          <p>You requested to reset your password.</p>

          <p>
            <a href="${resetLink}"
               style="
                background:#1976d2;
                color:white;
                padding:12px 22px;
                text-decoration:none;
                border-radius:6px;
                display:inline-block;
                font-weight:bold;">
              Reset Password
            </a>
          </p>

          <p>If the button doesn't work, copy this link:</p>

          <p>${resetLink}</p>

          <br>

          <p>If you didn't request this, you can safely ignore this email.</p>

        </div>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Brevo API Error:", error);
      throw new Error(error);
    }

    console.log("✅ Email sent successfully via Brevo API");
  } catch (err: any) {
    console.error("❌ Mail Service Error:", err.message);
    throw new Error(err.message);
  }
};