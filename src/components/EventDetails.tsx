import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Car, UtensilsCrossed, Users, Lightbulb, Target, Award } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Definição de estilos globais para animações
const animationStyles = `
  @keyframes gradient-x {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes float {
    0% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(-10px) translateX(5px); }
    100% { transform: translateY(0) translateX(0); }
  }
  @keyframes float-slow {
    0% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(-15px) translateX(10px); }
    100% { transform: translateY(0) translateX(0); }
  }
  @keyframes float-slower {
    0% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(15px) translateX(-10px); }
    100% { transform: translateY(0) translateX(0); }
  }
  @keyframes float-reverse {
    0% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(10px) translateX(-5px); }
    100% { transform: translateY(0) translateX(0); }
  }
  .animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient-x 8s ease infinite;
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  .animate-float-slow {
    animation: float-slow 4s ease-in-out infinite;
  }
  .animate-float-slower {
    animation: float-slower 5s ease-in-out infinite;
  }
  .animate-float-reverse {
    animation: float-reverse 3.5s ease-in-out infinite;
  }
`;

const EventDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return <div className="bg-gray-50 py-6 px-4">
      {/* Injetar estilos de animação */}
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div className="container mx-auto">
        {/* Seção de descrição do evento - visível apenas na página de info-evento */}
        {location.pathname === "/info-evento" && (
          <div className="mb-8 bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
            <div className="relative overflow-hidden text-white p-5 md:p-6">
              {/* Fundo com gradiente animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-cps-blue-dark via-cps-blue to-cps-wine animate-gradient-x"></div>
              
              {/* Elementos decorativos animados */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-40 h-40 bg-white/10 rounded-full -top-10 -right-10 animate-float-slow"></div>
                <div className="absolute w-32 h-32 bg-white/5 rounded-full -bottom-10 -left-10 animate-float-slower"></div>
                <div className="absolute w-24 h-24 bg-cps-blue-light/20 rounded-full top-1/4 right-1/4 animate-float"></div>
                <div className="absolute w-16 h-16 bg-cps-wine/20 rounded-full bottom-1/3 left-1/3 animate-float-reverse"></div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center relative z-10 gap-3">
                <div className="flex items-center">
                  <h2 className="text-xl md:text-2xl font-bold">Encontro CPS</h2>
                </div>
                <div className="bg-gradient-to-r from-cps-blue-light/30 to-cps-wine/30 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium border border-white/20 shadow-inner">
                  Unir caminhos. Alinhar propósitos. Projetar o futuro.
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-cps-wine/10 p-2 rounded-lg mr-3 flex-shrink-0">
                    <Users className="h-6 w-6 text-cps-wine" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-cps-blue-dark mb-2">Sobre o Encontro</h3>
                    <p className="text-gray-700 mb-3">
                      Nas últimas semanas, percorremos uma jornada marcada por escuta ativa, trocas potentes e alinhamentos estratégicos. Reunimos diretores das Etecs e Fatecs, gestores, supervisores pedagógicos regionais, estudantes, coordenadores e assessores da Administração Central. Cada encontro foi importante para a nova gestão do CPS.
                    </p>
                    <p className="text-gray-700 font-medium">
                      Agora, é hora de dar um passo além.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-cps-blue-dark/10 p-2 rounded-lg mr-3 flex-shrink-0">
                    <Lightbulb className="h-6 w-6 text-cps-blue-dark" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-cps-blue-dark mb-2">Visão Integrada</h3>
                    <p className="text-gray-700">
                      Nosso próximo encontro é mais do que a soma de todas essas vozes: é o símbolo de uma visão integrada, do compromisso coletivo e do desejo genuíno de transformar desafios em oportunidades com coragem, inteligência e colaboração.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-cps-blue-light/10 p-2 rounded-lg mr-3 flex-shrink-0">
                    <Target className="h-6 w-6 text-cps-blue-light" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-cps-blue-dark mb-2">Momento de Convergência</h3>
                    <p className="text-gray-700 mb-3">
                      Este será um momento de convergência, onde ideias, experiências e estratégias se unem em torno de um plano comum: um CPS ainda mais inovador, eficiente, humano e conectado às demandas do seu tempo e do futuro.
                    </p>
                    <p className="text-gray-700">
                      Contamos com sua presença para consolidar tudo que construímos juntos até aqui e lançar as bases do que ainda vamos construir.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-cps-wine italic text-sm">
                    "CPS onde os sonhos ganham vida e o futuro é construído."
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <h2 className="text-2xl md:text-3xl font-bold text-cps-blue-dark mb-5 text-center flex items-center justify-center">
          <div className="bg-cps-wine/10 p-2 rounded-full mr-3 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-cps-wine" />
          </div>
          Detalhes do Evento
        </h2>
        
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
          {/* Cabeçalho com data e horário */}
          <div className="bg-gradient-to-r from-cps-blue-dark to-cps-blue-dark/90 text-white p-5 md:p-6 relative overflow-hidden animate-gradient-x" style={{ backgroundSize: '200% 200%' }}>
            {/* Elementos decorativos animados */}
            <div className="absolute w-40 h-40 bg-white/10 rounded-full -top-10 -right-10 animate-float-slow"></div>
            <div className="absolute w-32 h-32 bg-white/5 rounded-full -bottom-10 -left-10 animate-float-slower"></div>
            <div className="absolute w-24 h-24 bg-cps-blue/20 rounded-full top-1/4 right-1/4 animate-float"></div>
            <div className="absolute w-16 h-16 bg-cps-blue-light/20 rounded-full bottom-1/3 left-1/3 animate-float-reverse"></div>
            
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
                    <p className="text-sm font-medium text-cps-wine mt-1">Valor: R$ 60,00</p>
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