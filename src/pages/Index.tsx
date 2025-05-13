import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegisterForm from "@/components/RegisterForm";
import EventDetails from "@/components/EventDetails";
const Index = () => {
  return <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section - Swapped logo and title positions */}
        <section className="bg-cps-wine text-white md:py-8 py-[16px] px-[25px]">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Title now on the left */}
              <div className="text-center md:text-left order-2 md:order-1">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">
                Encontro de Gestores CPS 2025
                </h1>
              </div>
              
              {/* Logo now on the right */}
              <div className="bg-white p-3 rounded-lg shadow-sm mb-4 md:mb-0 order-1 md:order-2">
                <img src="/lovable-uploads/46413f67-28f7-49ff-a512-9b2eed73faf3.png" alt="Logo CPS" className="h-14 md:h-20" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Registration Form and Event Details Section */}
        <section className="py-8 md:py-12 px-6">
          <div className="container mx-auto px-[8px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Registration Form Column */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-cps-blue-dark mb-6 md:mb-8 text-center lg:text-left">
                  Formulário de Inscrição
                </h2>
                <RegisterForm />
              </div>
              
              {/* Event Image Column */}
              <div className="flex flex-col justify-center">
                <div className="rounded-lg overflow-hidden shadow-lg h-64 md:h-96 flex items-center justify-center border border-gray-200/20 bg-gradient-to-br from-cps-blue-dark/90 to-cps-blue-dark/70">
                  <div className="text-center text-white p-6 relative z-10 w-full">
                    {/* Elemento decorativo superior */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-white/40 rounded-tl-lg -mt-2 -ml-2"></div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow-md">
                      Encontro de Gestores CPS 2025
                    </h3>
                    
                    <div className="w-24 h-1 bg-white mx-auto mb-4 rounded-full"></div>
                    
                    <p className="text-lg md:text-xl font-light">
                      CPS: Onde Sonhos Ganham Vida e o Futuro é Criado
                    </p>
                    
                    {/* Elemento decorativo central */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-6"></div>
                    
                    <div className="mt-4 text-cps-blue-light text-xl md:text-2xl font-semibold py-2 px-4 rounded-full inline-block shadow-inner bg-cps-blue-dark/50">
                      27 de maio de 2025
                    </div>
                    
                    {/* Elemento decorativo inferior */}
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-white/40 rounded-br-lg -mb-2 -mr-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Event Details Section */}
        <EventDetails />
      </main>
      
      <Footer />
    </div>;
};
export default Index;