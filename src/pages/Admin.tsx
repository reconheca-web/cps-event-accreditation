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
import { UsersIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from 'lucide-react';

import { Inscricao, StatusInscricao } from "@/types/supabase";

interface DashboardStats {
  total: number;
  aprovados: number;
  rejeitados: number;
  pendentes: number;
}

export default function Admin() {
  const [guests, setGuests] = useState<Inscricao[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [stats, setStats] = useState<DashboardStats>({ 
    total: 0,
    aprovados: 0,
    rejeitados: 0,
    pendentes: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchGuests();
  }, [statusFilter]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
    }
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

      // Calcular estatísticas
      const newStats: DashboardStats = {
        total: inscricoes.length,
        aprovados: inscricoes.filter(g => g.status_inscricao === 'aprovado').length,
        rejeitados: inscricoes.filter(g => g.status_inscricao === 'rejeitado').length,
        pendentes: inscricoes.filter(g => g.status_inscricao === 'pendente' || !g.status_inscricao).length
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
      const { error } = await supabase
        .from("inscricoes_evento_cps")
        .update({ status_inscricao: newStatus as StatusInscricao })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Convidado ${newStatus} com sucesso!`,
      });

      fetchGuests();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: error.message,
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <section className="bg-cps-wine text-white md:py-8 py-[16px] px-[25px]">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left order-2 md:order-1">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">
                Gestão de Inscritos
              </h1>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm mb-4 md:mb-0 order-1 md:order-2">
              <img
                src="/lovable-uploads/46413f67-28f7-49ff-a512-9b2eed73faf3.png"
                alt="Logo CPS"
                className="h-14 md:h-20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Admin Content */}
      <main className="flex-grow container mx-auto py-8 px-4 space-y-6">
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        </div>

        {/* Tabela de Inscritos */}
        <div className="bg-white rounded-lg shadow-sm p-6 overflow-hidden">
          {/* Wrapper para scroll horizontal */}
          <div className="overflow-x-auto">
            {/* Container para manter largura mínima e evitar quebra */}
            <div className="min-w-[1024px]">

          {/* Header Actions */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
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
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full md:w-auto"
            >
              Sair
            </Button>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Nome</TableHead>
                  <TableHead className="w-[15%]">Email</TableHead>
                  <TableHead className="w-[12%]">Telefone</TableHead>
                  <TableHead className="w-[10%]">Tipo Unidade</TableHead>
                  <TableHead className="w-[15%]">Nome Unidade</TableHead>
                  <TableHead className="w-[10%]">Status</TableHead>
                  <TableHead className="w-[10%]">Data Inscrição</TableHead>
                  <TableHead className="w-[8%]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell className="truncate">{guest.nome_completo}</TableCell>
                    <TableCell className="truncate">{guest.email}</TableCell>
                    <TableCell className="whitespace-nowrap">{guest.telefone}</TableCell>
                    <TableCell className="whitespace-nowrap">{guest.tipo_unidade}</TableCell>
                    <TableCell className="truncate">{guest.nome_unidade}</TableCell>
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
                    <TableCell className="whitespace-nowrap">
                      {guest.created_at ? new Date(guest.created_at).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGuestStatus(guest.id, "aprovado")}
                          disabled={guest.status_inscricao === "aprovado"}
                          className="border-green-500 text-green-600 hover:bg-green-50 px-2 py-1 h-auto"
                        >
                          Aceitar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateGuestStatus(guest.id, "rejeitado")}
                          disabled={guest.status_inscricao === "rejeitado"}
                          className="border-red-500 text-red-600 hover:bg-red-50 px-2 py-1 h-auto"
                        >
                          Rejeitar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
