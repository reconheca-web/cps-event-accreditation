import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import { supabase } from "../lib/supabaseClient";
import { UsersIcon, CheckCircleIcon, XCircleIcon, ClockIcon, PencilIcon, PlusIcon, QrCodeIcon, RefreshCwIcon, CheckIcon, AlertCircleIcon, DownloadIcon } from 'lucide-react';
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { unidadesList } from "@/data/locations";
import { QRCodeScanner } from "../components/QRCodeScanner";

import { Inscricao, StatusInscricao } from "@/types/supabase";

interface DashboardStats {
  total: number;
  aprovados: number;
  rejeitados: number;
  pendentes: number;
  checkins: number;
}

export default function Admin() {
  const [guests, setGuests] = useState<Inscricao[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Inscricao[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Inscricao | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Chave para forçar re-renderização
  const [formData, setFormData] = useState<Partial<Inscricao>>({
    nome_completo: "",
    email: "",
    telefone: "",
    tipo_unidade: "",
    nome_unidade: "",
    cargo: "",
    status_inscricao: "pendente" as StatusInscricao,
  });
  const [stats, setStats] = useState<DashboardStats>({ 
    total: 0,
    aprovados: 0,
    rejeitados: 0,
    pendentes: 0,
    checkins: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Efeito para carregar dados quando o filtro muda ou quando a chave de atualização muda
  useEffect(() => {
    checkAuth();
    fetchGuests();
  }, [statusFilter, refreshKey]);
  
  // Efeito para filtrar os inscritos com base no termo de busca
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredGuests(guests);
      return;
    }
    
    const term = searchTerm.toLowerCase().trim();
    const filtered = guests.filter(guest => {
      return (
        guest.nome_completo?.toLowerCase().includes(term) ||
        guest.email?.toLowerCase().includes(term) ||
        guest.telefone?.includes(term) ||
        guest.tipo_unidade?.toLowerCase().includes(term) ||
        guest.nome_unidade?.toLowerCase().includes(term) ||
        guest.cargo?.toLowerCase().includes(term)
      );
    });
    
    setFilteredGuests(filtered);
  }, [guests, searchTerm]);
  
  // Efeito para garantir que os dados sejam recarregados quando o modal é fechado
  useEffect(() => {
    if (!isQRScannerOpen) {
      // Força uma nova busca de dados quando o modal é fechado
      fetchGuests();
    }
  }, [isQRScannerOpen]);

  useEffect(() => {
    checkAuthorization();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
    }
  };

  const checkAuthorization = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email === 'web@dkseventos.com.br') {
      setIsAuthorized(true);
    }
  };
  
  const handleOpenQRScanner = () => {
    // Armazena a URL atual antes de abrir o scanner
    setIsQRScannerOpen(true);
  };

  const handleCloseQRScanner = () => {
    // Primeiro atualizamos os dados
    fetchGuests();
    
    // Depois fechamos o modal
    setIsQRScannerOpen(false);
    
    // Força uma re-renderização do componente para evitar a tela branca
    setRefreshKey(prevKey => prevKey + 1);
  };

  const fetchGuests = async () => {
    try {
      let query = supabase
        .from("inscricoes_evento_cps")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter !== "todos") {
        query = query.eq("status_inscricao", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      const inscricoes = data || [];
      setGuests(inscricoes);
      setFilteredGuests(inscricoes); // Define os inscritos filtrados inicialmente como todos os inscritos

      // Calcular estatísticas
      const newStats: DashboardStats = {
        total: inscricoes.length,
        aprovados: inscricoes.filter(g => g.status_inscricao === 'aprovado').length,
        rejeitados: inscricoes.filter(g => g.status_inscricao === 'rejeitado').length,
        pendentes: inscricoes.filter(g => g.status_inscricao === 'pendente' || !g.status_inscricao).length,
        checkins: inscricoes.filter(g => g.check_in !== null).length
      };
      setStats(newStats);
      setLoading(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar convidados",
        description: error.message,
        
      });
    } finally {
      setLoading(false);
    }
  };

  const updateGuestStatus = async (id: string, newStatus: string) => {
  try {
    console.log(`Atualizando status para ${newStatus} no ID: ${id}`);
    
    // Usar o cliente Supabase diretamente para atualizar apenas o status
    const { error } = await supabase
      .from("inscricoes_evento_cps")
      .update({ status_inscricao: newStatus as StatusInscricao })
      .eq("id", id);
    
    if (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
       
    // Toast super compacto com emoji
    const statusEmoji = newStatus === "aprovado" ? "✅" : 
                      newStatus === "rejeitado" ? "❌" : 
                      newStatus === "check-in" ? "🔖" : "📝";
    
    toast({
      title: `${statusEmoji} ${newStatus}`,
      description: undefined,
      duration: 500,
      className: "p-1.5 max-w-[140px] xs:max-w-[120px] text-center border-green-500 bg-green-50 dark:bg-green-900/20 text-sm ml-auto mr-2 sm:mr-4",
      variant: "default",
    });
    
    fetchGuests();
  } catch (error: any) {
    console.error('Erro ao atualizar status:', error);
    toast({
      variant: "destructive",
      title: "⚠️ Erro",
      description: typeof error.message === 'string' ? error.message.substring(0, 30) : undefined,
      className: "p-1.5 max-w-[140px] xs:max-w-[120px] text-sm ml-auto mr-2 sm:mr-4",
      duration: 600,
    });
  }
};

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Função para atualizar apenas a tabela de inscritos sem recarregar a página
  const handleRefreshData = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Previne qualquer comportamento padrão que possa causar recarregamento
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    
    // Cria uma função local para buscar os dados sem afetar o estado global de loading
    const atualizarDadosLocalmente = async () => {
      // Indicador de carregamento local apenas para a tabela
      const loadingToastId = toast({
        title: "Atualizando dados...",
        description: "Buscando os dados mais recentes...",
        duration: 1000,
      });
      
      try {
        // Busca os dados diretamente do Supabase sem usar a função global
        let query = supabase
          .from("inscricoes_evento_cps")
          .select("*")
          .order("created_at", { ascending: false });

        if (statusFilter !== "todos") {
          query = query.eq("status_inscricao", statusFilter);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Atualiza apenas os dados necessários sem recarregar a página
        const inscricoes = data || [];
        setGuests(inscricoes);

        // Atualiza as estatísticas
        const newStats: DashboardStats = {
          total: inscricoes.length,
          aprovados: inscricoes.filter(g => g.status_inscricao === 'aprovado').length,
          rejeitados: inscricoes.filter(g => g.status_inscricao === 'rejeitado').length,
          pendentes: inscricoes.filter(g => g.status_inscricao === 'pendente' || !g.status_inscricao).length,
          checkins: inscricoes.filter(g => g.check_in !== null).length
        };
        setStats(newStats);
        
        // Notifica o usuário sobre o sucesso
        toast({
          title: "Dados atualizados",
          description: "A lista de inscritos foi atualizada com sucesso.",
          duration: 1500,
        });
      } catch (error: any) {
        console.error("Erro ao atualizar dados:", error);
        toast({
          variant: "destructive",
          title: "Erro ao atualizar",
          description: error.message || "Não foi possível atualizar os dados.",
          duration: 1500,
        });
      }
    };
    
    // Executa a atualização sem afetar o estado global de loading
    atualizarDadosLocalmente();
    
    // Retorna false para garantir que não haja comportamento padrão
    return false;
  };
  
  // Função para exportar os dados para CSV
  const exportToCSV = () => {
    try {
      // Define os cabeçalhos do CSV
      const headers = [
        "Nome Completo",
        "Email",
        "Telefone",
        "Tipo de Unidade",
        "Nome da Unidade",
        "Cargo",
        "Status",
        "Check-in",
        "Data de Inscrição"
      ];
      
      // Formata os dados para CSV
      const csvData = filteredGuests.map(guest => [
        guest.nome_completo || "",
        guest.email || "",
        guest.telefone || "",
        guest.tipo_unidade || "",
        guest.nome_unidade || "",
        guest.cargo || "",
        guest.status_inscricao || "pendente",
        guest.check_in ? "Sim" : "Não",
        guest.created_at ? new Date(guest.created_at).toLocaleString('pt-BR') : ""
      ]);
      
      // Adiciona os cabeçalhos ao início dos dados
      csvData.unshift(headers);
      
      // Converte os dados para formato CSV
      const csvContent = csvData.map(row => row.map(cell => 
        // Escapa aspas duplas e envolve células com aspas se contiverem vírgulas ou aspas
        `"${String(cell).replace(/"/g, '""')}"`
      ).join(',')).join('\n');
      
      // Cria um blob com os dados CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Cria um URL para o blob
      const url = URL.createObjectURL(blob);
      
      // Cria um elemento de link para download
      const link = document.createElement('a');
      link.href = url;
      
      // Define o nome do arquivo com data atual
      const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
      link.download = `inscritos-evento-cps-${date}.csv`;
      
      // Adiciona o link ao documento, clica nele e depois remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Libera o URL do objeto
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download iniciado",
        description: "O arquivo CSV com os dados dos inscritos está sendo baixado.",
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao exportar dados",
        description: error.message,
      });
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cps-wine to-cps-wine/90 text-white md:py-10 py-[20px] px-[25px]">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Title com efeito decorativo */}
            <div className="text-center md:text-left order-2 md:order-1 relative">
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/30 rounded-tl-lg -mt-3 -ml-3 hidden md:block"></div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold drop-shadow-sm">
                Gestão de Inscritos
              </h1>
              <div className="w-20 h-1 bg-white/70 mx-auto md:mx-0 my-3 rounded-full"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/30 rounded-br-lg -mb-3 -mr-3 hidden md:block"></div>
            </div>
            
            {/* Logo com efeito de brilho */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-4 md:mb-0 order-1 md:order-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-50/30 to-transparent animate-pulse"></div>
              <img
                src="/lovable-uploads/46413f67-28f7-49ff-a512-9b2eed73faf3.png"
                alt="Logo CPS"
                className="h-16 md:h-24 w-auto relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Admin Content */}
      <main className="flex-grow container mx-auto py-8 px-4 space-y-6">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-cps-wine">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Inscritos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-cps-wine bg-opacity-10 rounded-full">
                <UsersIcon className="w-6 h-6 text-cps-wine" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprovados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.aprovados}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejeitados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejeitados}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <XCircleIcon className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendentes}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <ClockIcon className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Check-ins</p>
                <p className="text-2xl font-bold text-gray-900">{stats.checkins}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-500">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Inscritos */}
        <div className="mb-6">
          <div className="flex flex-col justify-center items-center mb-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-cps-wine mb-3">
              Inscritos
            </h2>
            <div className="w-20 h-1 bg-cps-wine rounded-full mb-4"></div>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Gerencie todos os participantes inscritos no evento
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 overflow-hidden">
          {/* Wrapper para scroll horizontal com largura mínima para garantir rolagem */}
          <div className="overflow-x-auto overflow-y-visible" style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* Container responsivo com largura mínima para forçar rolagem horizontal em telas pequenas */}
            <div className="w-full min-w-[800px]">

          {/* Header Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="rejeitado">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="relative w-full md:w-[280px]">
                <Input
                  type="text"
                  placeholder="Buscar por nome, email, telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-2 justify-start md:justify-end w-full md:w-auto">
              {isAuthorized && (
                <>
                  <Button
                    variant="default"
                    onClick={() => {
                      setEditingGuest(null);
                      setFormData({
                        nome_completo: "",
                        email: "",
                        telefone: "",
                        tipo_unidade: "",
                        nome_unidade: "",
                        cargo: "",
                        status_inscricao: "pendente",
                      });
                      setIsModalOpen(true);
                    }}
                    className="bg-cps-wine hover:bg-cps-wine/90 w-auto"
                    size="sm"
                  >
                    <PlusIcon className="mr-1 h-4 w-4" />
                    <span className="whitespace-nowrap text-sm">Adicionar</span>
                  </Button>
                  
                  {/* Botão de Check-in via QR Code */}
                  <Button
                    variant="default"
                    onClick={handleOpenQRScanner}
                    className="bg-cps-wine hover:bg-cps-wine/90 w-auto"
                    size="sm"
                  >
                    <QrCodeIcon className="mr-1 h-4 w-4" />
                    <span className="whitespace-nowrap text-sm">Check-in</span>
                  </Button>
                </>
              )}
              
              {/* Botão de Atualizar Registros - Visível para todos os usuários */}
              <div 
                className="inline-block" 
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  type="button"
                  variant="default"
                  onClick={handleRefreshData}
                  className="bg-cps-wine hover:bg-cps-wine/90 w-auto"
                  size="sm"
                  onSubmit={(e) => {
                    e.preventDefault();
                    return false;
                  }}
                >
                  <RefreshCwIcon className="mr-1 h-4 w-4" />
                  <span className="whitespace-nowrap text-sm">Atualizar</span>
                </Button>
              </div>
              
              {/* Botão para exportar dados para CSV */}
              <div 
                className="inline-block" 
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  type="button"
                  variant="default"
                  onClick={exportToCSV}
                  className="bg-cps-wine hover:bg-cps-wine/90 w-auto"
                  size="sm"
                >
                  <DownloadIcon className="mr-1 h-4 w-4" />
                  <span className="whitespace-nowrap text-sm">Exportar CSV</span>
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                onClick={handleLogout}
                size="sm"
                className="w-auto"
              >
                <span className="whitespace-nowrap text-sm">Sair</span>
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[15%]">Nome</TableHead>
                  <TableHead className="w-[15%]">Email</TableHead>
                  <TableHead className="w-[10%]">Telefone</TableHead>
                  <TableHead className="w-[8%]">Tipo Unidade</TableHead>
                  <TableHead className="w-[15%]">Nome Unidade</TableHead>
                  <TableHead className="w-[12%]">Cargo</TableHead>
                  <TableHead className="w-[10%]">Status</TableHead>
                  <TableHead className="w-[10%]">Check-in</TableHead>
                  <TableHead className="w-[15%]">Data de Inscrição</TableHead>
                  <TableHead className="w-[15%] sticky right-0 bg-white">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      {searchTerm ? (
                        <>
                          <div className="flex flex-col items-center justify-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-10 w-10 text-gray-400"
                            >
                              <circle cx="11" cy="11" r="8"></circle>
                              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <p className="font-medium">Nenhum resultado encontrado para "{searchTerm}"</p>
                            <p className="text-sm">Tente outro termo de busca ou limpe o filtro</p>
                          </div>
                        </>
                      ) : (
                        "Nenhum inscrito encontrado"
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGuests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell className="break-words max-w-[150px]" title={guest.nome_completo}>{guest.nome_completo}</TableCell>
                    <TableCell className="break-words max-w-[150px]" title={guest.email}>{guest.email}</TableCell>
                    <TableCell className="whitespace-nowrap">{guest.telefone}</TableCell>
                    <TableCell className="whitespace-nowrap">{guest.tipo_unidade}</TableCell>
                    <TableCell className="break-words" title={guest.nome_unidade}>{guest.nome_unidade}</TableCell>
                    <TableCell className="break-words" title={guest.cargo}>{guest.cargo}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 rounded-full text-sm whitespace-nowrap ${
                        guest.status_inscricao === "aprovado"
                          ? "bg-green-100 text-green-800"
                          : guest.status_inscricao === "rejeitado"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {guest.status_inscricao || 'pendente'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {guest.check_in ? (
                        <span className="inline-flex px-2 py-1 rounded-full text-sm bg-green-100 text-green-800">
                          Realizado
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                          Pendente
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="break-words">
                      {guest.created_at ? new Date(guest.created_at).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="sticky right-0 bg-white">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGuestStatus(guest.id, "aprovado")}
                          disabled={guest.status_inscricao === "aprovado"}
                          className="border-green-500 text-green-600 hover:bg-green-50 px-1 py-1 h-auto text-xs"
                        >
                          Aceitar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGuestStatus(guest.id, "rejeitado")}
                          disabled={guest.status_inscricao === "rejeitado"}
                          className="border-red-500 text-red-600 hover:bg-red-50 px-1 py-1 h-auto text-xs"
                        >
                          Rejeitar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingGuest(guest);
                            setFormData(guest);
                            setIsModalOpen(true);
                          }}
                          className="border-gray-500 text-gray-600 hover:bg-gray-50 px-1 py-1 h-auto"
                        >
                          <PencilIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
            </Table>
          </div>
            </div>
          </div>
        </div>
      </main>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex flex-col justify-center items-center text-center">
              <DialogTitle className="text-xl font-bold text-cps-wine">
                {editingGuest ? "Editar Inscrição" : "Nova Inscrição"}
              </DialogTitle>
              <div className="w-16 h-1 bg-cps-wine rounded-full my-2"></div>
            </div>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                if (editingGuest) {
                  const { error } = await supabase
                    .from("inscricoes_evento_cps")
                    .update(formData)
                    .eq("id", editingGuest.id);

                  if (error) throw error;

                  toast({
                    title: "Sucesso",
                    description: "Inscrição atualizada com sucesso!",
                  });
                } else {
                  const { error } = await supabase
                    .from("inscricoes_evento_cps")
                    .insert([formData]);

                  if (error) throw error;

                  toast({
                    title: "Sucesso",
                    description: "Nova inscrição criada com sucesso!",
                  });
                }

                setIsModalOpen(false);
                fetchGuests();
              } catch (error: any) {
                toast({
                  variant: "destructive",
                  title: "Erro ao salvar",
                  description: error.message,
                });
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome Completo</label>
                <Input
                  value={formData.nome_completo || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      nome_completo: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Telefone</label>
                <Input
                  value={formData.telefone || ""}
                  onChange={(e) => {
                    // Remove todos os caracteres não numéricos
                    const numericValue = e.target.value.replace(/\D/g, '');
                    
                    // Limita a 11 dígitos (DDD + 9 dígitos para celular)
                    const truncatedValue = numericValue.slice(0, 11);
                    
                    // Aplica a máscara (00) 00000-0000
                    let formattedValue = '';
                    if (truncatedValue.length > 0) {
                      // Adiciona o DDD entre parênteses
                      formattedValue = `(${truncatedValue.slice(0, 2)}`;
                      
                      if (truncatedValue.length > 2) {
                        // Adiciona o fechamento do parênteses e espaço
                        formattedValue += `) ${truncatedValue.slice(2, 7)}`;
                        
                        if (truncatedValue.length > 7) {
                          // Adiciona o hífen e o restante dos números
                          formattedValue += `-${truncatedValue.slice(7, 11)}`;
                        }
                      }
                    }
                    
                    setFormData((prev) => ({ ...prev, telefone: formattedValue }));
                  }}
                  placeholder="(00) 00000-0000"
                  required
                  maxLength={15} // Tamanho máximo com a máscara
                />
              </div>

              <div>
                <label className="text-sm font-medium">Tipo de Unidade</label>
                <Select
                  value={formData.tipo_unidade || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, tipo_unidade: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETEC">ETEC</SelectItem>
                    <SelectItem value="FATEC">FATEC</SelectItem>
                    <SelectItem value="Núcleo Regional">Núcleo Regional</SelectItem>
                    <SelectItem value="Administração Central">Administração Central</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Nome da Unidade</label>
                {["Núcleo Regional", "Administração Central"].includes(formData.tipo_unidade) ? (
                  <Input
                    value={formData.nome_unidade || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nome_unidade: e.target.value }))
                    }
                    placeholder="Digite o nome da coordenadoria"
                    required
                  />
                ) : (
                  <>
                    <Select
                      value={formData.nome_unidade || ""}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          nome_unidade: value,
                        }))
                      }
                      disabled={!formData.tipo_unidade}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {formData.tipo_unidade && unidadesList[formData.tipo_unidade as keyof typeof unidadesList]?.map((unidade) => (
                          <SelectItem key={unidade} value={unidade}>
                            {unidade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!formData.tipo_unidade && (
                      <p className="text-sm text-gray-500 mt-1">
                        Selecione primeiro o tipo de unidade
                      </p>
                    )}
                  </>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Cargo</label>
                <Input
                  value={formData.cargo || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, cargo: e.target.value }))
                  }
                  placeholder="Digite o cargo"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-cps-wine hover:bg-cps-wine/90">
                {editingGuest ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para o Scanner de QR Code - Implementação robusta para múltiplos check-ins consecutivos */}
      {isQRScannerOpen && (
        <Dialog 
          open={isQRScannerOpen} 
          onOpenChange={(open) => {
            if (!open) {
              // Primeiro atualizamos os dados
              fetchGuests();
              // Depois fechamos o modal
              setIsQRScannerOpen(false);
              // Força uma re-renderização do componente
              setRefreshKey(prevKey => prevKey + 1);
            }
          }}
        >
          <DialogContent 
            className="sm:max-w-md max-h-[90vh] overflow-y-auto"
          >
            <DialogHeader className="pb-2">
              <div className="flex flex-col justify-center items-center text-center">
                <DialogTitle className="text-xl font-bold text-cps-wine">
                  Scanner de QR Code para Check-in
                </DialogTitle>
                <div className="w-16 h-1 bg-cps-wine rounded-full my-2"></div>
                <p className="text-sm text-gray-500 mt-1">
                  Escaneie o QR Code do participante para registrar o check-in no evento
                </p>
              </div>
            </DialogHeader>
            <QRCodeScanner onClose={handleCloseQRScanner} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
