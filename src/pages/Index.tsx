
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
        <section className="bg-cps-wine text-white py-6 md:py-8 px-6">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Title now on the left */}
              <div className="text-center md:text-left order-2 md:order-1">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">
                  Cadastro para o Evento CPS
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
                <div className="rounded-lg overflow-hidden shadow-md h-64 md:h-96 bg-cps-blue-dark flex items-center justify-center">
                  <div className="text-center text-white p-6">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Evento CPS 2025</h3>
                    <p className="text-lg md:text-xl">
                      Uma oportunidade única para networking e conhecimento
                    </p>
                    <div className="mt-8 text-cps-blue-light text-xl md:text-2xl font-semibold">
                      27 de maio de 2025
                    </div>
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
