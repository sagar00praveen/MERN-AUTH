import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';

// ------------------------
// HELPER TO SIGN JWT
// ------------------------
const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ------------------------
// REGISTER
// ------------------------
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: 'Missing details' });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = signToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });






    // Send welcome email
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome!',
      text: 'Hello, your account has been created successfully.'
    });

    return res.json({ success: true, message: 'Registered successfully', user: { name: user.name, email: user.email } });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};




// ------------------------
// LOGIN
// ------------------------
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: 'Email and password are required' });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'Invalid email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: 'Invalid password' });

    const token = signToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({ success: true, user: { name: user.name, email: user.email } });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};



// ------------------------
// LOGOUT
// ------------------------
export const logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      expires: new Date(0)
    });
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
// ------------------------
// SEND VERIFICATION OTP
// ------------------------
export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId; // ✅ from middleware
    if (!userId) return res.status(401).json({ success: false, message: 'Not authorized' });

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: 'User not found' });
    if (user.isAccountVerified) return res.json({ success: false, message: 'Account already verified' });
   const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Account Verification OTP',
      //text: `Your OTP is ${otp}. Verify your account using this OTP.`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",user.email)
    });

    return res.json({ success: true, message: 'Verification OTP sent to email' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ------------------------
// VERIFY EMAIL
// ------------------------
export const verifyEmail = async (req, res) => {
  try {
    const userId = req.userId; // ✅ from middleware
    const { otp } = req.body;
    if (!otp) return res.json({ success: false, message: 'OTP is required' });

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: 'User not found' });
    if (user.verifyOtp !== otp) return res.json({ success: false, message: 'Invalid OTP' });
    if (user.verifyOtpExpireAt < Date.now()) return res.json({ success: false, message: 'OTP expired' });

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = null;
    await user.save();
    return res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ------------------------
// CHECK AUTHENTICATION
// ------------------------
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ------------------------
// SEND PASSWORD RESET OTP
// ------------------------
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: 'Email is required' });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'User not found' });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Password Reset OTP',
      //text: `Your OTP for password reset is ${otp}.`,
      html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}",user.email)
    });

    return res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ------------------------
// RESET PASSWORD
// ------------------------
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: 'Email, OTP, and new password are required' });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'User not found' });
    if (user.resetOtp !== otp) return res.json({ success: false, message: 'Invalid OTP' });
    if (user.resetOtpExpireAt < Date.now()) return res.json({ success: false, message: 'OTP expired' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
