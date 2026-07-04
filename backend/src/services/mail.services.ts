import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("SMTP Connected Successfully");
  }
});

export const sendResetEmail = async (email: string, resetLink: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",

  html: `
<h2>Reset Password</h2>

<p>Click the button below.</p>

<a href="${resetLink}"
style="
background:#1976d2;
color:white;
padding:12px 20px;
text-decoration:none;
border-radius:5px;
display:inline-block;">
Reset Password
</a>

<br><br>

<p><b>Deep Link:</b></p>

<textarea rows="2" cols="60" readonly>${resetLink}</textarea>
`,
    });

    console.log(info);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
