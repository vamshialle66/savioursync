const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your email provider
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // app password or email password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    });

    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};

module.exports = sendEmail;
