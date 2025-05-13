import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Star, MapPin, ArrowLeft, Pill, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    tipo: "Centro comercial",
    endereco: "Avenida Ibirapuera, 3103 – Moema, São Paulo – SP, 04029-200",
    distancia: "Aproximadamente 1,2 km do local do evento",
    avaliacao: 4.5,
    avaliacoes: 35000,
    preco: "$$$",


    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Avenida+Ibirapuera,+3103,+São+Paulo",
    categoria: "shopping",
    icone: <ShoppingBag className="h-4 w-4 text-cps-wine" />
  },
  {
    nome: "Shopping Vila Olímpia",
    tipo: "Centro comercial",
    endereco: "Rua Olimpíadas, 360 – Vila Olímpia, São Paulo – SP, 04551-000",
    distancia: "Aproximadamente 3,5 km do local do evento",
    avaliacao: 4.4,
    avaliacoes: 28000,
    preco: "$$$",


    mapsUrl: "https://www.google.com/maps/dir/?api=1&destination=Rua+Olimpíadas,+360,+São+Paulo",
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
  const renderEstrelas = () => {
    const estrelas = [];
    const notaInteira = Math.floor(avaliacao);
    const temMeiaEstrela = avaliacao % 1 >= 0.5;

    for (let i = 0; i < notaInteira; i++) {
      estrelas.push(<Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (temMeiaEstrela) {
      estrelas.push(
        <div key="half-star" className="relative">
          <Star className="h-4 w-4 text-yellow-400" />
          <Star className="absolute top-0 left-0 h-4 w-4 fill-yellow-400 text-yellow-400 overflow-hidden" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </div>
      );
    }

    return estrelas;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
            {icone}
            <span className="ml-1 text-xs font-medium text-gray-700">{preco}</span>
          </div>
          <div className="flex items-center">
            {renderEstrelas()}
            <span className="ml-1 text-sm font-medium text-gray-700">{avaliacao}</span>
            {avaliacoes && <span className="ml-1 text-xs text-gray-500">({avaliacoes})</span>}
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-cps-blue-dark mb-1">{nome}</h3>
          <p className="text-sm text-gray-500">{tipo}</p>
        </div>
        
        <div className="flex items-start mb-4">
          <MapPin className="h-4 w-4 text-cps-wine mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-700">{endereco}</p>
            <p className="text-xs text-gray-500 mt-1">{distancia}</p>
          </div>
        </div>
      </div>
      
      <div className="px-5 pb-5 mt-auto">
        <Button 
          className="w-full bg-cps-wine text-white hover:bg-cps-wine/90 transition-colors"
          onClick={() => window.open(mapsUrl, "_blank")}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Como chegar
        </Button>
      </div>
    </div>
  );
};

const Restaurantes: React.FC = () => {
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
        <section className="bg-cps-wine text-white md:py-8 py-[16px] px-[25px]">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Title */}
              <div className="text-center md:text-left order-2 md:order-1">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">
                  Estabelecimentos Próximos
                </h1>
              </div>
              
              {/* Icon */}
              <div className="bg-white p-3 rounded-lg shadow-sm mb-4 md:mb-0 order-1 md:order-2">
                <UtensilsCrossed className="h-14 md:h-20 text-cps-wine" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Conteúdo principal */}
        <section className="py-8 md:py-12 px-6">
          <div className="container mx-auto px-[8px]">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-cps-blue-dark text-center md:text-left">
                Estabelecimentos próximos ao evento
              </h2>
              <Button 
                variant="outline" 
                className="border-cps-wine text-cps-wine hover:bg-cps-wine/10 w-full md:w-auto"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
            
            <p className="text-gray-700 mb-8">
              Confira algumas opções de estabelecimentos próximos ao local do evento para sua comodidade.
            </p>
            
            {/* Seção de Restaurantes */}
            <div className="mb-12">
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-cps-blue-dark flex items-center">
                  <UtensilsCrossed className="h-5 w-5 mr-2 text-cps-wine" />
                  Restaurantes Próximos
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurantes.map((estabelecimento, index) => (
                  <EstabelecimentoCard key={`restaurante-${index}`} {...estabelecimento} />
                ))}
              </div>
            </div>
            
            {/* Seção de Shoppings */}
            <div className="mb-12">
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-cps-blue-dark flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-cps-wine" />
                  Shoppings Próximos
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shoppings.map((estabelecimento, index) => (
                  <EstabelecimentoCard key={`shopping-${index}`} {...estabelecimento} />
                ))}
              </div>
            </div>
            
            {/* Seção de Farmácias */}
            <div className="mb-12">
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-cps-blue-dark flex items-center">
                  <Pill className="h-5 w-5 mr-2 text-cps-wine" />
                  Farmácias Próximas
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {farmacias.map((estabelecimento, index) => (
                  <EstabelecimentoCard key={`farmacia-${index}`} {...estabelecimento} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Restaurantes;
