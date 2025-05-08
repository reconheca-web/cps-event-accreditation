
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegisterForm from "@/components/RegisterForm";
import EventDetails from "@/components/EventDetails";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-cps-wine text-white py-12 px-6">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left bg-white text-cps-wine p-4 rounded-lg">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Cadastro para o Evento CPS
                </h1>
                <p className="text-xl md:text-2xl max-w-3xl">
                  Participe do nosso evento exclusivo e receba seu QR Code de acesso.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Registration Form and Event Details Section */}
        <section className="py-12 px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Registration Form Column */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-cps-blue-dark mb-8 text-center lg:text-left">
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
    </div>
  );
};

export default Index;
