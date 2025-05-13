import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Star, MapPin, ArrowLeft, Pill, ShoppingBag, ExternalLink, Map, Coffee, Utensils, Trees, Building2, Theater, Route, Instagram, Plane, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EventDetails from "@/components/EventDetails";

interface EstabelecimentoProps {
  nome: string;
  tipo: string;
  endereco: string;
  distancia: string;
  avaliacao: number;
  preco: string;
  mapsUrl: string;
  categoria: 'restaurante' | 'farmacia' | 'shopping';
  avaliacoes?: number;
  icone?: React.ReactNode;
}

const estabelecimentos: EstabelecimentoProps[] = [
  // Restaurantes
  {
    nome: "General Prime Steak & Burger – Moema",
    tipo: "Hamburgueria e Steakhouse",
    endereco: "Praça Nossa Senhora Aparecida, 103 – Indianópolis, São Paulo – SP, 04075-010",
    distancia: "Aproximadamente 100 metros do local do evento",
    avaliacao: 4.7,
    avaliacoes: 1200,
    preco: "$$$",

    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Praça+Nossa+Senhora+Aparecida,+103,+São+Paulo",
    categoria: "restaurante",
    icone: <UtensilsCrossed className="h-4 w-4 text-cps-wine" />
  },
  {
    nome: "Sapporo Japanese Food",
    tipo: "Japonês",
    endereco: "Praça Nossa Senhora Aparecida, 114 – Indianópolis, São Paulo – SP, 04075-010",
    distancia: "Aproximadamente 100 metros do local do evento",
    avaliacao: 4.5,
    avaliacoes: 629,
    preco: "$$$",


    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Praça+Nossa+Senhora+Aparecida,+114,+São+Paulo",
    categoria: "restaurante",
    icone: <UtensilsCrossed className="h-4 w-4 text-cps-wine" />
  },
  {
    nome: "Choperia A Estalagem",
    tipo: "Bar",
    endereco: "Avenida Moema, 2 – Indianópolis, São Paulo – SP, 04077-020",
    distancia: "Aproximadamente 300 metros do local do evento",
    avaliacao: 4.3,
    avaliacoes: 81,
    preco: "$$",


    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Avenida+Moema,+2,+São+Paulo",
    categoria: "restaurante",
    icone: <UtensilsCrossed className="h-4 w-4 text-cps-wine" />
  },
  {
    nome: "Don Pepe Di Napoli",
    tipo: "Italiana",
    endereco: "Alameda dos Arapanés, 955 – Moema, São Paulo – SP, 04524-001",
    distancia: "Aproximadamente 1,2 km do local do evento",
    avaliacao: 4.5,
    avaliacoes: 1200,
    preco: "$$",


    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Alameda+dos+Arapanés,+955,+São+Paulo",
    categoria: "restaurante",
    icone: <UtensilsCrossed className="h-4 w-4 text-cps-wine" />
  },
  {
    nome: "Restaurante Vila Moema",
    tipo: "Brasileira",
    endereco: "Av. Moema, 19 - Moema, São Paulo - SP, 04077-020",
    distancia: "Aproximadamente 350 metros do local do evento",
    avaliacao: 4.3,
    avaliacoes: 150,
    preco: "$$",


    mapsUrl: "https://maps.app.goo.gl/GXq8s7Kq6BH3wJs77",
    categoria: "restaurante",
    icone: <UtensilsCrossed className="h-4 w-4 text-cps-wine" />
  },
  {
    nome: "Rizz Restaurante - Moema",
    tipo: "Brasileira",
    endereco: "Alameda Iraé, 398 – Indianópolis, São Paulo – SP, 04075-000",
    distancia: "Aproximadamente 300 metros do local do evento",
    avaliacao: 4.2,
    avaliacoes: 500,
    preco: "$$",


    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Alameda+Iraé,+398,+São+Paulo",
    categoria: "restaurante",
    icone: <UtensilsCrossed className="h-4 w-4 text-cps-wine" />
  },
  
  // Farmácias
  {
    nome: "Drogaria São Paulo",
    tipo: "Farmácia de rede",
    endereco: "Avenida Moema, 300 – Moema, São Paulo – SP, 04077-020",
    distancia: "Aproximadamente 400 metros do local do evento",
    avaliacao: 4.3,
    avaliacoes: 120,
    preco: "$$",


    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Avenida+Moema,+300,+São+Paulo",
    categoria: "farmacia",
    icone: <Pill className="h-4 w-4 text-cps-wine" />
  },
  {
    nome: "Drogasil",
    tipo: "Farmácia de rede",
    endereco: "Avenida Ibirapuera, 2000 – Moema, São Paulo – SP, 04028-001",
    distancia: "Aproximadamente 600 metros do local do evento",
    avaliacao: 4.2,
    avaliacoes: 95,
    preco: "$$",


    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Avenida+Ibirapuera,+2000,+São+Paulo",
    categoria: "farmacia",
    icone: <Pill className="h-4 w-4 text-cps-wine" />
  },
  
  // Shoppings
  {
    nome: "Shopping Ibirapuera",
    tipo: "Shopping Center",
    endereco: "Avenida Ibirapuera, 3103 – Moema, São Paulo – SP, 04029-902",
    distancia: "Aproximadamente 1,5 km do local do evento",
    avaliacao: 4.5,
    avaliacoes: 11000,
    preco: "$$$",


    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Avenida+Ibirapuera,+3103,+São+Paulo",
    categoria: "shopping",
    icone: <ShoppingBag className="h-4 w-4 text-cps-wine" />
  },
  {
    nome: "Shopping Moema",
    tipo: "Shopping Center",
    endereco: "Alameda dos Maracatins, 1435 – Moema, São Paulo – SP, 04089-015",
    distancia: "Aproximadamente 1,2 km do local do evento",
    avaliacao: 4.3,
    avaliacoes: 1800,
    preco: "$$",


    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Alameda+dos+Maracatins,+1435,+São+Paulo",
    categoria: "shopping",
    icone: <ShoppingBag className="h-4 w-4 text-cps-wine" />
  }
];

const EstabelecimentoCard: React.FC<EstabelecimentoProps> = ({
  nome,
  tipo,
  endereco,
  distancia,
  avaliacao,
  preco,
  mapsUrl,
  avaliacoes,
  icone
}) => {
  
  // Função para renderizar as estrelas de avaliação
  const renderEstrelas = () => {
    const estrelas = [];
    const estrelasInteiras = Math.floor(avaliacao);
    const temMeiaEstrela = avaliacao % 1 >= 0.5;
    
    // Adiciona estrelas cheias
    for (let i = 0; i < estrelasInteiras; i++) {
      estrelas.push(
        <Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }
    
    // Adiciona meia estrela se necessário
    if (temMeiaEstrela) {
      estrelas.push(
        <Star key="half-star" className="h-4 w-4 text-yellow-400" />
      );
    }
    
    // Adiciona estrelas vazias
    const estrelasVazias = 5 - estrelasInteiras - (temMeiaEstrela ? 1 : 0);
    for (let i = 0; i < estrelasVazias; i++) {
      estrelas.push(
        <Star key={`empty-star-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }
    
    return estrelas;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-cps-blue-dark">{nome}</h3>
          {icone}
        </div>
        
        <p className="text-gray-600 text-sm mb-2">{tipo}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex mr-2">
            {renderEstrelas()}
          </div>
          <span className="text-sm text-gray-600">{avaliacao} {avaliacoes && `(${avaliacoes})`}</span>
          <span className="ml-auto text-sm font-medium text-gray-700">{preco}</span>
        </div>
        
        <div className="flex items-start mb-3">
          <MapPin className="h-4 w-4 text-cps-wine mt-1 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-700">{endereco}</p>
            <p className="text-xs text-gray-500 mt-1">{distancia}</p>
          </div>
        </div>
        
        <a 
          href={mapsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center text-cps-wine hover:text-cps-wine/80 text-sm font-medium"
        >
          Ver no mapa
          <ArrowLeft className="h-3.5 w-3.5 ml-1 rotate-180" />
        </a>
      </div>
    </div>
  );
};

const InfoEvento: React.FC = () => {
  const navigate = useNavigate();

  // Filtrar estabelecimentos por categoria
  const restaurantes = estabelecimentos.filter(e => e.categoria === 'restaurante');
  const farmacias = estabelecimentos.filter(e => e.categoria === 'farmacia');
  const shoppings = estabelecimentos.filter(e => e.categoria === 'shopping');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
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
                <p className="text-white/90 text-sm md:text-base max-w-xl">
                  Informações completas sobre o evento, localização e serviços próximos
                </p>
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/30 rounded-br-lg -mb-3 -mr-3 hidden md:block"></div>
              </div>
              
              {/* Icon com efeito de brilho */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-4 md:mb-0 order-1 md:order-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-50/30 to-transparent animate-pulse"></div>
                <img src="/lovable-uploads/46413f67-28f7-49ff-a512-9b2eed73faf3.png" alt="Logo CPS" className="h-16 md:h-24 w-auto relative z-10" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Informativo Reconheça São Paulo */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="container mx-auto py-3 px-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <p className="text-gray-700">
                  <span className="font-medium">Dica:</span> Ao final da página, conheça a <span className="text-cps-wine font-medium">Agência Reconheça</span> e descubra experiências incríveis em São Paulo.
                </p>
              </div>
              <a 
                href="#agencia-reconheca" 
                className="inline-flex items-center px-4 py-1.5 bg-cps-wine text-white text-sm rounded-md hover:bg-cps-wine/90 transition-colors shadow-sm"
              >
                Explorar agora
                <ArrowLeft className="h-3.5 w-3.5 ml-1.5 rotate-180" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Informações do Evento */}
        <EventDetails />
        
        {/* Conteúdo principal */}
        <section className="py-8 md:py-12 px-6">
          <div className="container mx-auto px-[8px]">
            <div className="flex flex-col justify-center items-center mb-10 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-cps-wine mb-3">
                Estabelecimentos próximos ao evento
              </h2>
              <div className="w-20 h-1 bg-cps-wine rounded-full mb-4"></div>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Confira algumas opções de estabelecimentos próximos ao local do evento para sua comodidade.
              </p>
            </div>
            
            {/* Seção de Restaurantes */}
            <div className="mb-12">
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-cps-blue-dark flex items-center">
                  <UtensilsCrossed className="h-5 w-5 mr-2 text-cps-wine" />
                  Restaurantes
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurantes.map((estabelecimento, index) => (
                  <EstabelecimentoCard key={`restaurante-${index}`} {...estabelecimento} />
                ))}
              </div>
            </div>
            
            {/* Seção de Farmácias */}
            <div className="mb-12">
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-cps-blue-dark flex items-center">
                  <Pill className="h-5 w-5 mr-2 text-cps-wine" />
                  Farmácias
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farmacias.map((estabelecimento, index) => (
                  <EstabelecimentoCard key={`farmacia-${index}`} {...estabelecimento} />
                ))}
              </div>
            </div>
            
            {/* Seção Reconheça São Paulo */}
            <div id="agencia-reconheca" className="mb-12 scroll-mt-16">
              <div className="bg-cps-wine p-4 rounded-lg mb-6 text-white">
                <h3 className="text-xl font-bold flex items-center justify-center">
                  <Map className="h-5 w-5 mr-2" />
                  Explore mais sobre São Paulo
                </h3>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-cps-wine">
                <div className="md:flex">
                  <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                    <div className="text-center">
                      <div className="mb-5">
                        <h4 className="text-2xl md:text-3xl font-bold text-cps-wine inline-flex flex-col items-center">
                          <span className="relative z-10 px-2">Reconheça São Paulo</span>
                          <span className="h-2 bg-cps-wine/20 rounded-full w-full mt-1"></span>
                        </h4>
                        <p className="text-cps-blue-dark font-medium mt-3 italic">Conectando pessoas, histórias e experiências</p>
                      </div>
                      <p className="text-gray-700 mb-4 mx-auto max-w-md">
                        Aproveite sua estadia em São Paulo para descobrir os melhores atrativos turísticos, exposições, 
                        eventos culturais e experiências gastronômicas que a cidade tem a oferecer.
                      </p>
                      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Coffee className="h-4 w-4 text-cps-wine" />
                          <span>Gastronomia</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Utensils className="h-4 w-4 text-cps-wine" />
                          <span>Restaurantes</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Trees className="h-4 w-4 text-cps-wine" />
                          <span>Parques</span>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Building2 className="h-4 w-4 text-cps-wine" />
                          <span>Museus</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Theater className="h-4 w-4 text-cps-wine" />
                          <span>Teatros</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Route className="h-4 w-4 text-cps-wine" />
                          <span>Roteiros</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                      <a 
                        href="https://www.reconhecasaopaulo.com.br/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-2 bg-cps-wine text-white rounded-md hover:bg-cps-wine/90 transition-colors shadow-sm"
                      >
                        Visite o site
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 bg-gray-50 p-6 md:p-8 flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-white p-4 rounded-lg inline-block mb-4 shadow-md">
                        <img 
                          src="/images/Captura de tela 2025-05-13 132055.png" 
                          alt="Logo da Agência Reconheça São Paulo" 
                          className="h-auto w-full max-h-24" 
                          loading="lazy"
                        />
                      </div>
                      <h5 className="text-xl font-semibold text-cps-blue-dark mb-2">Agência Reconheça</h5>
                      <p className="text-gray-700">
                        Sua plataforma de descobertas que conecta pessoas, histórias e experiências autênticas em São Paulo
                      </p>
                      <div className="mt-4 flex flex-col items-center gap-2">
                        <a 
                          href="https://www.reconhecasaopaulo.com.br/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cps-wine font-medium inline-flex items-center hover:underline"
                        >
                          www.reconhecasaopaulo.com.br
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                        <div className="flex items-center gap-3 mt-1">
                          <a 
                            href="https://www.instagram.com/reconhecasp/?hl=pt" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-cps-wine font-medium inline-flex items-center hover:underline hover:text-cps-wine/80 transition-colors"
                            aria-label="Instagram da Agência Reconheça"
                          >
                            <Instagram className="h-5 w-5" />
                          </a>
                          <a 
                            href="https://www.tiktok.com/@reconhecasp" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-cps-wine font-medium inline-flex items-center hover:underline hover:text-cps-wine/80 transition-colors"
                            aria-label="TikTok da Agência Reconheça"
                          >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default InfoEvento;
