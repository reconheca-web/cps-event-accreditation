
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Car } from "lucide-react";

const EventDetails: React.FC = () => {
  return (
    <div className="bg-gray-50 py-10 px-6">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-cps-blue-dark mb-8 text-center">
          Informações do Evento
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col space-y-4">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-cps-wine mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold">Local</h3>
                  <p className="text-gray-700">Villa Glam Iraé</p>
                  <p className="text-gray-700">Praça Nossa Sra. Aparecida, 195 - Indianópolis</p>
                  <p className="text-gray-700">São Paulo - SP, 04075-010</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="h-6 w-6 text-cps-wine mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold">Data</h3>
                  <p className="text-gray-700">27/05/2025</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-6 w-6 text-cps-wine mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold">Horário</h3>
                  <p className="text-gray-700">Das 09 às 17hs</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Car className="h-6 w-6 text-cps-wine mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold">Estacionamento</h3>
                  <p className="text-gray-700">O local possui sistema de Valet</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-cps-blue-dark mb-4">Como chegar</h3>
              <p className="text-gray-700 mb-6">
                Use um dos links abaixo para obter direções até o local do evento:
              </p>
            </div>
            
            <div className="flex flex-col space-y-4">
              <Button 
                className="bg-cps-blue-dark text-white hover:bg-cps-blue-dark/90"
                onClick={() => window.open("https://maps.google.com/?q=Villa Glam Iraé, Praça Nossa Sra. Aparecida, 195 - Indianópolis, São Paulo - SP, 04075-010", "_blank")}
              >
                Como chegar (Google Maps)
              </Button>
              
              <Button 
                className="bg-cps-blue-light text-white hover:bg-cps-blue-light/90"
                onClick={() => window.open("https://waze.com/ul?q=Villa Glam Iraé, Praça Nossa Sra. Aparecida, 195 - Indianópolis, São Paulo - SP, 04075-010&navigate=yes", "_blank")}
              >
                Como chegar (Waze)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
