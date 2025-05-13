import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegisterForm from "@/components/RegisterForm";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Car, UtensilsCrossed, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
const Index = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section - Melhorado com efeitos visuais */}
        <section className="bg-gradient-to-r from-cps-wine to-cps-wine/90 text-white md:py-10 py-[20px] px-[25px]">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Title com efeito decorativo */}
              <div className="text-center md:text-left order-2 md:order-1 relative">
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/30 rounded-tl-lg -mt-3 -ml-3 hidden md:block"></div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold drop-shadow-sm">
                  Encontro de Gestores CPS 2025
                </h1>
                <div className="w-20 h-1 bg-white/70 mx-auto md:mx-0 my-3 rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/30 rounded-br-lg -mb-3 -mr-3 hidden md:block"></div>
              </div>
              
              {/* Logo com efeito de brilho */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-4 md:mb-0 order-1 md:order-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-50/30 to-transparent animate-pulse"></div>
                <img src="/lovable-uploads/46413f67-28f7-49ff-a512-9b2eed73faf3.png" alt="Logo CPS" className="h-16 md:h-24 w-auto relative z-10" />
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
                <div className="rounded-lg overflow-hidden shadow-lg h-auto min-h-[16rem] md:h-96 flex items-center justify-center border border-gray-200/20 bg-gradient-to-br from-cps-blue-dark/90 to-cps-blue-dark/70">
                  <div className="text-center text-white p-4 md:p-6 relative z-10 w-full">
                    {/* Elemento decorativo superior */}
                    <div className="absolute top-0 left-0 w-12 md:w-16 h-12 md:h-16 border-t-2 border-l-2 border-white/40 rounded-tl-lg -mt-2 -ml-2"></div>
                    
                    <h3 className="text-xl md:text-3xl font-bold mb-2 md:mb-4 text-white drop-shadow-md break-words px-2">
                      Encontro de Gestores CPS 2025
                    </h3>
                    
                    <div className="w-16 md:w-24 h-1 bg-white mx-auto mb-2 md:mb-4 rounded-full"></div>
                    
                    <p className="text-base md:text-xl font-light px-2 break-words">
                      CPS: Onde Sonhos Ganham Vida e o Futuro é Criado
                    </p>
                    
                    {/* Elemento decorativo central */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-3 md:my-6"></div>
                    
                    <div className="mt-2 md:mt-4 text-cps-blue-light text-lg md:text-2xl font-semibold py-1 md:py-2 px-3 md:px-4 rounded-full inline-block shadow-inner bg-cps-blue-dark/50">
                      27 de maio de 2025
                    </div>
                    
                    {/* Elemento decorativo inferior */}
                    <div className="absolute bottom-0 right-0 w-12 md:w-16 h-12 md:h-16 border-b-2 border-r-2 border-white/40 rounded-br-lg -mb-2 -mr-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Informações do Evento */}
        <section className="bg-gray-50 py-6 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-cps-blue-dark mb-4 text-center flex items-center justify-center">
              <Calendar className="h-6 w-6 text-cps-wine mr-2" />
              Encontro de Gestores CPS 2025
            </h2>
            
            <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden mb-6">
              {/* Cabeçalho com data e horário */}
              <div className="bg-gradient-to-r from-cps-blue-dark to-cps-blue-dark/90 text-white p-4 md:p-5">
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-6 w-6 text-white mr-2" />
                    <span className="font-medium text-base">27/05/2025</span>
                  </div>
                  <span className="hidden md:inline">•</span>
                  <div className="flex items-center">
                    <Clock className="h-6 w-6 text-white mr-2" />
                    <span className="text-base">09h às 17h</span>
                  </div>
                </div>
              </div>
              
              {/* Corpo com informações do local */}
              <div className="p-5">
                <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                  {/* Informações do local */}
                  <div className="md:w-3/5 flex flex-col gap-4">
                    <div className="flex items-start">
                      <MapPin className="h-6 w-6 text-cps-wine mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-cps-blue-dark mb-1">Villa Glam Iraé</h3>
                        <p className="text-sm text-gray-700">Praça Nossa Sra. Aparecida, 195 - Indianópolis</p>
                        <p className="text-sm text-gray-700">São Paulo - SP, 04075-010</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Car className="h-6 w-6 text-cps-wine mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-base font-semibold text-gray-700">Estacionamento</h3>
                        <p className="text-sm text-gray-700">O local possui sistema de Valet</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Botões de navegação */}
                  <div className="md:w-2/5">
                    <h3 className="text-base font-semibold text-gray-700 mb-3">Como chegar:</h3>
                    <div className="flex flex-wrap gap-3 items-center mb-4">
                      <Button 
                        size="sm"
                        className="bg-cps-blue-dark text-white hover:bg-cps-blue-dark/90 flex items-center justify-center" 
                        onClick={() => window.open("https://maps.google.com/?q=Villa Glam Iraé, Praça Nossa Sra. Aparecida, 195 - Indianópolis, São Paulo - SP, 04075-010", "_blank")}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Google Maps
                      </Button>
                      
                      <Button 
                        size="sm"
                        className="bg-cps-blue-light text-white hover:bg-cps-blue-light/90 flex items-center justify-center" 
                        onClick={() => window.open("https://waze.com/ul?q=Villa Glam Iraé, Praça Nossa Sra. Aparecida, 195 - Indianópolis, São Paulo - SP, 04075-010&navigate=yes", "_blank")}
                      >
                        <Car className="h-4 w-4 mr-2" />
                        Waze
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Seção de destaque para mais informações */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-cps-wine/10 p-2 rounded-full mr-3">
                        <ArrowRight className="h-5 w-5 text-cps-wine" />
                      </div>
                      <p className="text-gray-700">
                        Acesse mais informações sobre o evento, incluindo restaurantes e serviços próximos.
                      </p>
                    </div>
                    <Button 
                      className="bg-cps-wine text-white hover:bg-cps-wine/90 flex items-center justify-center w-full md:w-auto" 
                      onClick={() => {
                        navigate("/info-evento");
                        // Garante que a página seja rolada para o topo após a navegação
                        setTimeout(() => {
                          window.scrollTo(0, 0);
                        }, 0);
                      }}
                    >
                      Saiba mais
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default Index;