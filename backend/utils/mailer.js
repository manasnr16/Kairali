import nodemailer from "nodemailer";

// Reuses a single transporter for the life of the process.
let transporter;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return transporter;
}

export async function sendOtpEmail(email, otp) {
  const fromName = process.env.SMTP_FROM_NAME || "Kairali Match Makers";
  const fromAddress = process.env.SMTP_EMAIL;

  if (!fromAddress || !process.env.SMTP_PASSWORD) {
    throw new Error(
      "Email service is not configured. Set SMTP_EMAIL and SMTP_PASSWORD in backend/.env"
    );
  }

  await getTransporter().sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to: email,
    subject: "Your Kairali Match Makers verification code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #7a1f2b;">Verify your email</h2>
        <p>Use the code below to verify your email address. It expires in 5 minutes.</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; background: #f7f1e8; color: #7a1f2b; padding: 16px 24px; border-radius: 8px; text-align: center; margin: 24px 0;">
          ${otp}
        </div>
        <p style="color: #555;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}
