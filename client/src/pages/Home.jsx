import React from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const Home = () => {
  return (
    <div
      className='flex flex-col items-center min-h-screen bg-white bg-cover bg-center pt-20 p-4'
    >
      <Navbar />
      <Header />
    </div>
  );
};

export default Home;
