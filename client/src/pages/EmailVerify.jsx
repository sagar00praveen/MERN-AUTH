import React, { useContext, useEffect, useRef } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmailVerify = () => {
  const { backendUrl, userData, isLoggedin, getUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };


  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim().slice(0, 6);

    
    paste.split('').forEach((char, index) => {
      if (inputRefs.current[index]) inputRefs.current[index].value = char;
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!userData) return toast.error('User not found');

    try {
      const otp = inputRefs.current.map((el) => el.value).join('');
      if (otp.length !== 6) return toast.error('Please enter 6-digit OTP');

      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { userId: userData._id, otp },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (isLoggedin && userData?.isAccountVerified) {
      navigate('/');
    }
  }, [isLoggedin, userData]);

  return (
    <div className="relative flex items-center justify-center min-h-screen 
      bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">

      <img
        src={assets.logo}
        alt="App Logo"
        className="absolute left-5 sm:left-10 top-5 w-10 sm:w-10 cursor-pointer"
      />

      <form
        onSubmit={onSubmitHandler}
        className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-80 sm:w-96 text-sm border border-white/30"
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email Verification
        </h1>
        <p className="text-center mb-6 text-indigo-100">
          Enter the 6-digit code sent to your email ID.
        </p>

        <div className="flex justify-between gap-2 mb-6" onPaste={handlePaste}>
          {[...Array(6)].map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength="1"
              className="w-10 h-10 text-center text-lg rounded-md bg-white/30 text-white 
                placeholder-gray-200 border border-white/40 focus:outline-none focus:ring-2 
                focus:ring-indigo-400 transition-all"
              ref={(el) => (inputRefs.current[i] = el)}
              onInput={(e) => handleInput(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg 
          transition-all duration-300 shadow-md hover:shadow-indigo-700/40"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
