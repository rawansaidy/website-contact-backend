// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const path = require("path");
const app = express();
const PORT = 3000; // You can change this if needed

// In-memory store for verification codes (for demo; use DB for production)
// Structure: { [email]: { code: '123456', expires: Date } }
const verificationCodes = {};

app.use(cors());
app.use(bodyParser.json());

// ...existing code...
// Serve static files (HTML, CSS, JS) from the project directory (after API routes)
app.use(express.static(path.join(__dirname)));

// Replace with your business email and credentials
const transporter = nodemailer.createTransport({
  service: "<EMAIL_SERVICE>", // e.g., "gmail" or another provider
  auth: {
    user: "<YOUR_EMAIL>", // your business email
    pass: "<YOUR_APP_PASSWORD>", // use an app password, not your main password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Endpoint to send verification code
app.post("/send-verification-code", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }
  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  // Set expiration to 1 minute from now
  const expires = Date.now() + 60 * 1000;
  verificationCodes[email] = { code, expires };
  const mailOptions = {
    from: "<YOUR_EMAIL>",
    to: email,
    subject: "Your Verification Code",
    html: `
      <div style="background:#f6f8fc;padding:32px 0;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center">
              <table width="420" cellpadding="0" cellspacing="0" border="0" style="background:#fff;border-radius:8px;">
                <tr>
                  <td align="center" style="padding:32px 24px 0 24px;">
                    <img src="cid:logo-placeholder" alt="Your Logo" style="height:80px;display:block;margin-bottom:8px;" />
                    <h2 style="color:#C42128;margin:0;font-size:1.5em;font-weight:700;">Your Business Name</h2>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:24px 24px 0 24px;">
                    <p style="font-size:1.1em;color:#333;margin:0 0 12px 0;">Welcome to X! Please verify your email before you can proceed.</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="background:#C42128;color:#fff;font-size:2em;font-weight:bold;letter-spacing:4px;border-radius:8px;padding:18px 0;margin:0 0 24px 0;">
                          ${code}
                        </td>
                      </tr>
                    </table>
                    <p style="color:#555;text-align:center;margin:18px 0 0 0;">This code will expire in <b>1 minute</b>.</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:24px 24px 24px 24px;">
                    <small style="color:#aaa;">If you did not request this code, you can ignore this email.</small>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
    attachments: [
      {
        filename: "logo.png", // Place your logo file here
        path: path.join(__dirname, "logo.png"),
        cid: "logo-placeholder",
      },
    ],
  };
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).json({ error: "Failed to send verification code." });
  }
});

// Endpoint to verify code and send message

app.post("/verify-and-send-message", async (req, res) => {
  const { email, code, message } = req.body;
  if (!email || !code || !message) {
    return res
      .status(400)
      .json({ error: "Email, code, and message are required." });
  }
  const entry = verificationCodes[email];
  if (!entry) {
    return res.status(400).json({
      error:
        "No verification code found for this email. Please request a new code.",
    });
  }
  if (Date.now() > entry.expires) {
    delete verificationCodes[email];
    return res.status(400).json({
      error: "Verification code has expired. Please request a new code.",
    });
  }
  if (entry.code !== code) {
    return res.status(400).json({ error: "Invalid verification code." });
  }
  // Remove code after use
  delete verificationCodes[email];
  const mailOptions = {
    from: email,
    to: "<YOUR_EMAIL>",
    subject: "New Message from Website",
    text: `From: ${email}\n\nMessage:\n${message}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

// Endpoint to verify code and send menu request
app.post("/verify-and-send-menu-request", async (req, res) => {
  const { name, email, phone, code, menuRequest } = req.body;
  if (!name || !email || !phone || !code || !menuRequest) {
    return res.status(400).json({ error: "All fields are required." });
  }
  const entry = verificationCodes[email];
  if (!entry) {
    return res.status(400).json({
      error:
        "No verification code found for this email. Please request a new code.",
    });
  }
  if (Date.now() > entry.expires) {
    delete verificationCodes[email];
    return res.status(400).json({
      error: "Verification code has expired. Please request a new code.",
    });
  }
  if (entry.code !== code) {
    return res.status(400).json({ error: "Invalid verification code." });
  }
  // Remove code after use
  delete verificationCodes[email];
  const mailOptions = {
    from: email,
    to: "<YOUR_EMAIL>",
    subject: "New Menu Request from Website",
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMenu Request:\n${menuRequest}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error("Error sending menu request email:", error);
    res.status(500).json({ error: "Failed to send menu request email." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
