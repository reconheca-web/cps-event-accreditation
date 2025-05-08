
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white py-4 px-6 md:px-10 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          <img 
            src="/lovable-uploads/46413f67-28f7-49ff-a512-9b2eed73faf3.png" 
            alt="Logo CPS" 
            className="h-16 md:h-20"
          />
        </div>
        
        <div className="w-full md:w-auto flex justify-center md:justify-end">
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
