const nodemailer = require('nodemailer');

// Send reset email function
exports.sendResetEmail = async (email, resetUrl) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`
  };

  await transporter.sendMail(mailOptions);
};
