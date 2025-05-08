
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-50 py-4 px-6 md:px-10 shadow-md border-b-2 border-cps-blue-dark">
      <div className="container mx-auto flex justify-center md:justify-between items-center">
        <div className="bg-white rounded-lg p-2 shadow-sm">
          <img 
            src="/lovable-uploads/46413f67-28f7-49ff-a512-9b2eed73faf3.png" 
            alt="Logo CPS" 
            className="h-14 md:h-16"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
