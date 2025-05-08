
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-50 py-4 px-6 md:px-10 shadow-md border-b-2 border-cps-blue-dark">
      <div className="container mx-auto flex justify-center md:justify-end items-center">
        <div className="bg-white rounded-lg p-2 shadow-sm">
          <img 
            src="/lovable-uploads/5cdd003b-ef72-4830-bbf9-79265fd94472.png" 
            alt="Logo CPS Horizontal" 
            className="h-10 md:h-12"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
