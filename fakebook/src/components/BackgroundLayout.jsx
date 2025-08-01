import React from 'react';
import background from '../assets/background.webp';

// Function to enclose Child component inside a background div
const BackgroundLayout = ({ children }) => {

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${background})` }}
    >
      {children}
    </div>
  );
};

export default BackgroundLayout;
