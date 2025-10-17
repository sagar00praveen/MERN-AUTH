import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const { userData } = useContext(AppContext);
return (
    <div className="w-full flex flex-col items-center mt-32 px-4 text-center text-gray-800">
      

       <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        {userData ? '🥰 hello '+userData.name : ' Hey Developer'}!
        <img
          className="w-8 aspect-square"
          src={assets.hand_wave}
          alt="hand wave"
        />
      </h1>
      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to our app
      </h2>

      <p className="mb-8 max-w-md">
        {userData ? 'Click on the Contact me button to get the tour of my other projects' : 'Click on the login button to Login/sign Up '}
      </p>

      {/* Call to Action Button */}
      <button
  type="button"
  onClick={() => window.open('https://portfolio-website-seven-umber-40.vercel.app/', '_blank')}
  className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl 
             focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 
             font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all"
>
  Visit My Portfolio & Projects
</button>

    </div>
  );
};

export default Header;
