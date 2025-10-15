import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext);

  const sendVerificationOtp = async () => {
    try {




      axios.defaults.withCredentials = true;
      const {data}=await axios.post(`${backendUrl}/api/auth/send-verify-otp`);
      if(data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      }else {
        toast.error(data.message);
      }
    } catch(error) {
      toast.error(error.response?.data?.message || 'Failed to send verification email');
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });

      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        toast.success('Logged out successfully');
        navigate('/');
      } else {
        toast.error(data.message || 'Logout failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img
        src={assets.logo}
        alt="App Logo"
        className="w-10 sm:w-10 cursor-pointer"
        onClick={() => navigate('/')}
      />

      {userData ? (
        <div className="relative group">
          <div className="w-10 h-10 flex justify-center items-center rounded-full bg-black text-white cursor-pointer">
            {userData.name ? userData.name[0].toUpperCase() : '?'}
          </div>

          <div
            className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg 
            opacity-0 invisible group-hover:opacity-100 group-hover:visible 
            transition-all duration-200 ease-in-out"
          >
            <ul className="list-none m-0 p-2">
              {!userData.isAccountVerified && (
                <li
                  onClick={sendVerificationOtp}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Verify Email
                </li>
              )}

              <li
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
        >
          Login
          <img src={assets.arrow_icon} alt="Arrow Icon" />
        </button>
      )}


</div>
  );
};

export default Navbar;
