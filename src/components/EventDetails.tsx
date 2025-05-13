import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Car, UtensilsCrossed } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const EventDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return <div className="bg-gray-50 py-6 px-4">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-cps-blue-dark mb-5 text-center flex items-center justify-center">
          <div className="bg-cps-wine/10 p-2 rounded-full mr-3 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-cps-wine" />
          </div>
          Detalhes do Evento
        </h2>
        
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
          {/* Cabeçalho com data e horário */}
          <div className="bg-gradient-to-r from-cps-blue-dark to-cps-blue-dark/90 text-white p-5 md:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mt-12 -mr-12"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -mb-8 -ml-8"></div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 relative z-10">
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                <Calendar className="h-6 w-6 text-white mr-2" />
                <span className="font-medium text-base">27/05/2025</span>
              </div>
              <span className="hidden md:inline text-white/50">•</span>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full">
                <Clock className="h-6 w-6 text-white mr-2" />
                <span className="text-base">09h às 17h</span>
              </div>
            </div>
          </div>
          
          {/* Corpo com informações e botões */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-5 md:gap-10">
              {/* Informações do local */}
              <div className="md:w-3/5 flex flex-col gap-5">
                <div className="flex items-start">
                  <div className="bg-cps-wine/10 p-2 rounded-lg mr-3 flex-shrink-0">
                    <MapPin className="h-6 w-6 text-cps-wine" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-cps-blue-dark mb-2">Villa Glam Iraé</h3>
                    <p className="text-sm text-gray-700">Praça Nossa Sra. Aparecida, 195 - Indianópolis</p>
                    <p className="text-sm text-gray-700">São Paulo - SP, 04075-010</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-cps-wine/10 p-2 rounded-lg mr-3 flex-shrink-0">
                    <Car className="h-6 w-6 text-cps-wine" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-700">Estacionamento</h3>
                    <p className="text-sm text-gray-700">O local possui sistema de Valet</p>
                  </div>
                </div>
              </div>
              
              {/* Botões de navegação */}
              <div className="md:w-2/5">
                <h3 className="text-base font-semibold text-cps-blue-dark mb-4 flex items-center">
                  <div className="bg-cps-blue-dark/10 p-1.5 rounded-md mr-2">
                    <MapPin className="h-4 w-4 text-cps-blue-dark" />
                  </div>
                  Como chegar:
                </h3>
                <div className="flex flex-wrap gap-3 items-center">
                  <Button 
                    className="bg-cps-blue-dark text-white hover:bg-cps-blue-dark/90 flex items-center justify-center shadow-sm" 
                    onClick={() => window.open("https://maps.google.com/?q=Villa Glam Iraé, Praça Nossa Sra. Aparecida, 195 - Indianópolis, São Paulo - SP, 04075-010", "_blank")}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Google Maps
                  </Button>
                  
                  <Button 
                    className="bg-cps-blue-light text-white hover:bg-cps-blue-light/90 flex items-center justify-center shadow-sm" 
                    onClick={() => window.open("https://waze.com/ul?q=Villa Glam Iraé, Praça Nossa Sra. Aparecida, 195 - Indianópolis, São Paulo - SP, 04075-010&navigate=yes", "_blank")}
                  >
                    <Car className="h-4 w-4 mr-2" />
                    Waze
                  </Button>
                  
                  {/* Botão de informações do evento - removido na página de info-evento */}
                  {location.pathname !== "/info-evento" && (
                    <Button 
                      className="bg-cps-wine text-white hover:bg-cps-wine/90 flex items-center justify-center shadow-sm" 
                      onClick={() => navigate("/info-evento")}
                    >
                      <UtensilsCrossed className="h-4 w-4 mr-2" />
                      Informações
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default EventDetails;