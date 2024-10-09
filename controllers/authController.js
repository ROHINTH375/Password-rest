const crypto = require('crypto');
const User = require('../models/User');
const { sendResetEmail } = require('../utils/sendEmail');
// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
// Forgot Password (Step 1)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  // Check if the user exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate reset token and set expiration time (1 hour)
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
  await user.save();

  // Send email with the reset token link
  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
  await sendResetEmail(user.email, resetUrl);

  res.json({ message: 'Password reset email sent' });
};

// Reset Password (Step 2)
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Find user by token and ensure token is not expired
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() } // Greater than current time
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  // Set new password and clear reset token fields
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password updated successfully' });
};
