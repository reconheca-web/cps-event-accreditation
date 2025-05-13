import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Componente de redirecionamento da rota antiga /restaurantes para a nova rota /info-evento
 */
const Restaurantes: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redireciona para a nova rota
    navigate('/info-evento', { replace: true });
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <p>Redirecionando para a página de informações do evento...</p>
    </div>
  );
};

export default Restaurantes;
/* Código removido e movido para InfoEvento.tsx
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
    preco: "$$$"
*/
