import React, { useState, useContext, useRef } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
 const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const otpRefs = useRef([]);

  const handleOtpInput = (e, index) => {
    if (e.target.value.length > 0 && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handlePasteOtp = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim();
    const pasteArray = paste.split('');
    pasteArray.forEach((char, i) => {
      if (otpRefs.current[i]) otpRefs.current[i].value = char;
    });
  };

  const requestOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
      if (data.success) {
        toast.success(data.message);
        setStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Reset password
  const submitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const otpValue = otpRefs.current.map((el) => el.value).join('');

      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, otp: otpValue, newPassword },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white">
      {/* Logo */}
      <img
        src={assets.logo}
        alt="App Logo"
        className="absolute left-5 sm:left-10 top-5 w-10 sm:w-10 cursor-pointer"
      />

      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-80 sm:w-96 text-sm border border-white/30">
        {step === 1 ? (
          <>
            <h1 className="text-black text-2xl font-semibold text-center mb-4">
              Reset Password
            </h1>
            <p className="text-center mb-6 text-black-250">
              Enter your email to receive a reset OTP.
            </p>
            <form onSubmit={requestOtp} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/30 text-black placeholder-black-200 border border-white/40 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-indigo-700/40"
              >
                Send OTP
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-black text-2xl font-semibold text-center mb-4">
              Enter OTP & New Password
            </h1>
            <form onSubmit={submitNewPassword} className="space-y-4">
              <div className="flex justify-between gap-2 mb-4" onPaste={handlePasteOtp}>
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    className="w-10 h-10 text-center text-lg rounded-md bg-black/30 text-white border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                    ref={(el) => (otpRefs.current[i] = el)}
                    onInput={(e) => handleOtpInput(e, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  />
                ))}
              </div>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-white/30 text-black placeholder-black-200 border border-wight/40 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
              />
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-indigo-700/40"
              >
                Reset Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
