
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-cps-blue-dark text-white py-8 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Centro Paula Souza</h3>
            <p className="mb-2">Rua dos Andradas, 140 • Santa Ifigênia</p>
            <p className="mb-2">01208-000 • São Paulo • SP</p>
            <p className="mb-2">Tel.: (11) 3324-3300</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/centropaulasouza" target="_blank" rel="noopener noreferrer" className="hover:text-cps-blue-light transition-colors">
                Facebook
              </a>
              <a href="https://www.instagram.com/centropaulasouza" target="_blank" rel="noopener noreferrer" className="hover:text-cps-blue-light transition-colors">
                Instagram
              </a>
              <a href="https://www.youtube.com/user/centropaulasouzasp" target="_blank" rel="noopener noreferrer" className="hover:text-cps-blue-light transition-colors">
                YouTube
              </a>
            </div>
          </div>
          
          <div className="flex justify-center items-center">
            <img 
              src="/lovable-uploads/5cdd003b-ef72-4830-bbf9-79265fd94472.png" 
              alt="Logo CPS Horizontal" 
              className="h-12 md:h-16"
            />
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-600 text-center text-sm">
          <p>© {new Date().getFullYear()} Centro Paula Souza. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
