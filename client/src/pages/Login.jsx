import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const { username, email, password } = formData;

      if (state === 'Sign Up') {
  const { data } = await axios.post(
    `${backendUrl}/api/auth/register`,

    { name: username, email, password },
    { withCredentials: true }
  );

  if (data.success) {
    setIsLoggedin(true);
    getUserData();
    toast.success('Account created successfully!');
    navigate('/');
  } else {
    toast.error(data.message);
  }
}
 else {
        if (!email || !password) {
          toast.error('Email and password are required');
          return;
        }

        const { data } = await axios.post(
          `${backendUrl}/api/auth/login`,
          { email, password },
          { withCredentials: true }
        );

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          toast.success('Logged in successfully!');
          navigate('/');
        } else {
          toast.error(data.message || 'Invalid credentials');
        }
      }
    } catch (error) {
      console.error(error);
       toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-0
      bg-white p-4 rounded-lg shadow-md
      
      font-sans">

      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0
          bg-[radial-gradient(circle_at_20%_30%,#f9c5f9_0%,#c5e1ff_50%,
          #d5ffc5_80%,transparent_100%)]
          opacity-40"></div>
        <div className="absolute inset-0
          bg-[radial-gradient(circle_at_80%_60%,#fcd5c5_0%,#d5f9ff_50%,#d5ffc5_80%,transparent_100%)]
          opacity-30"></div>
      </div>

      <img
        src={assets.logo}
        alt="App Logo"
        className="absolute left-5 sm:left-10 top-5 w-10 sm:w-10 cursor-pointer"
      />

      <div className="relative z-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl 
      shadow-2xl w-full max-w-md text-black border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-black-200">
            {state === 'Sign Up'
              ? 'Enter your details to get started!'
              : 'Login to continue your journey!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {state === 'Sign Up' && (
            <div className="relative w-full">
  {/* SVG Icon */}
  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
    <img src={assets.person_icon} alt="User Icon" className="w-5 h-5" 
    />
  </span>

  
  <input
    type="text"
    name="username"
    placeholder="Full Name"
    value={formData.username}
    onChange={handleChange}
    required
    autoComplete="name"
    className="w-full bg-white/20 text-black placeholder-black-300 border border-white/30 rounded-lg 
               py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400 
               transition-all duration-300"
  />
</div>

              )}

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
    <img src={assets.mail_icon} alt="User Icon" className="w-5 h-5" />
  </span>
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full bg-white/20 text-black placeholder-black-300 border border-white/30 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
    <img src={assets.lock_icon} alt="User Icon" className="w-5 h-5" />
  </span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete={state === 'Login' ? 'current-password' : 'new-password'}
              className="w-full bg-white/20 text-black placeholder-black-300 border border-white/30 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            />
          </div>

          {state === 'Login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate('/reset-password')}
                className="text-sm text-black-200 hover:text-[#0000FF] hover:underline transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#1E90FF] hover:bg-[#0000FF] text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#4169E1] transform hover:-translate-y-0.5"
          >
            {state === 'Sign Up' ? 'Create Account' : 'Login'}
          </button>
        </form>

        <p className="mt-8 text-center text-black-200">
          {state === 'Sign Up'
            ? 'Already have an account? '
            : "Don't have an account? "}
          <span
            onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
            className="font-semibold text-black hover:underline cursor-pointer"
          >
            {state === 'Sign Up' ? 'Login here' : 'Sign up here'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
