import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { supabase } from '../lib/supabaseClient';
import { Loader2, Users, CheckCircle2, XCircle, CheckSquare, RefreshCw } from 'lucide-react';

import { useToast } from '../components/ui/use-toast';

interface DashboardStats {
  total_inscritos: number;
  total_aprovados: number;
  total_rejeitados: number;
  total_check_in: number;
}

export function Dashboard() {
  const { toast } = useToast();
  const { data: stats, isLoading, refetch } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inscricoes_evento_cps')
        .select('id, status_inscricao, check_in');

      if (error) throw error;
      if (!data) return {
        total_inscritos: 0,
        total_aprovados: 0,
        total_rejeitados: 0,
        total_check_in: 0
      };

      return {
        total_inscritos: data.length,
        total_aprovados: data.filter(row => row.status_inscricao === 'aprovado').length,
        total_rejeitados: data.filter(row => row.status_inscricao === 'rejeitado').length,
        total_check_in: data.filter(row => row.check_in !== null).length
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-cps-wine" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <img src="/favicon.png" alt="CPS Logo" className="h-8" />
          <h1 className="text-xl font-semibold text-cps-wine">Dashboard de Credenciamento</h1>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <h2 className="text-xl font-semibold text-cps-wine">Resumo do Evento</h2>
            <p className="text-sm text-gray-500">Atualizado em: {new Date().toLocaleString('pt-BR')}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => {
              refetch();
              toast({
                title: "Dashboard atualizado",
                description: "Os dados foram atualizados com sucesso.",
              });
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar Dados
          </Button>
        </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Total de Inscritos</p>
                  <p className="text-2xl font-bold text-cps-wine">{stats?.total_inscritos || 0}</p>
                </div>
                <Users className="h-5 w-5 text-cps-wine" />
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-cps-wine rounded-full" style={{ width: '100%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Aprovados</p>
                  <p className="text-2xl font-bold text-green-600">{stats?.total_aprovados || 0}</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 rounded-full transition-all" 
                  style={{ width: `${((stats?.total_aprovados || 0) / (stats?.total_inscritos || 1)) * 100}%` }} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Rejeitados</p>
                  <p className="text-2xl font-bold text-red-600">{stats?.total_rejeitados || 0}</p>
                </div>
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-600 rounded-full transition-all" 
                  style={{ width: `${((stats?.total_rejeitados || 0) / (stats?.total_inscritos || 1)) * 100}%` }} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Check-ins</p>
                  <p className="text-2xl font-bold text-blue-600">{stats?.total_check_in || 0}</p>
                </div>
                <CheckSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all" 
                  style={{ width: `${((stats?.total_check_in || 0) / (stats?.total_aprovados || 1)) * 100}%` }} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Distribuição de Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-600" />
                  <span className="text-sm font-medium">Aprovados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{stats?.total_aprovados || 0}</span>
                  <span className="text-xs text-gray-500">
                    ({((stats?.total_aprovados || 0) / (stats?.total_inscritos || 1) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 rounded-full transition-all" 
                  style={{ width: `${((stats?.total_aprovados || 0) / (stats?.total_inscritos || 1)) * 100}%` }} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-600" />
                  <span className="text-sm font-medium">Rejeitados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{stats?.total_rejeitados || 0}</span>
                  <span className="text-xs text-gray-500">
                    ({((stats?.total_rejeitados || 0) / (stats?.total_inscritos || 1) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-600 rounded-full transition-all" 
                  style={{ width: `${((stats?.total_rejeitados || 0) / (stats?.total_inscritos || 1)) * 100}%` }} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                  <span className="text-sm font-medium">Pendentes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {(stats?.total_inscritos || 0) - ((stats?.total_aprovados || 0) + (stats?.total_rejeitados || 0))}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({(((stats?.total_inscritos || 0) - ((stats?.total_aprovados || 0) + (stats?.total_rejeitados || 0))) / (stats?.total_inscritos || 1) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all" 
                  style={{ 
                    width: `${((stats?.total_inscritos || 0) - ((stats?.total_aprovados || 0) + (stats?.total_rejeitados || 0))) / (stats?.total_inscritos || 1) * 100}%` 
                  }} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Check-ins vs Aprovados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                  <span className="text-sm font-medium">Check-ins Realizados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{stats?.total_check_in || 0}</span>
                  <span className="text-xs text-gray-500">
                    ({((stats?.total_check_in || 0) / (stats?.total_aprovados || 1) * 100).toFixed(1)}% dos aprovados)
                  </span>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all" 
                  style={{ width: `${((stats?.total_check_in || 0) / (stats?.total_aprovados || 1)) * 100}%` }} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-600" />
                  <span className="text-sm font-medium">Total de Aprovados</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{stats?.total_aprovados || 0}</span>
                  <span className="text-xs text-gray-500">(100%)</span>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {((stats?.total_check_in || 0) / (stats?.total_aprovados || 1) * 100).toFixed(1)}% dos participantes aprovados já realizaram check-in no evento.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-4">
        <Card className="bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle>Acompanhamento do Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status das Inscrições</span>
                    <span className="text-sm text-gray-500">{stats?.total_inscritos || 0} total</span>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="bg-green-500 transition-all"
                        style={{ width: `${((stats?.total_aprovados || 0) / (stats?.total_inscritos || 1)) * 100}%` }}
                      />
                      <div
                        className="bg-red-500 transition-all"
                        style={{ width: `${((stats?.total_rejeitados || 0) / (stats?.total_inscritos || 1)) * 100}%` }}
                      />
                      <div
                        className="bg-gray-400 transition-all"
                        style={{ width: `${(((stats?.total_inscritos || 0) - ((stats?.total_aprovados || 0) + (stats?.total_rejeitados || 0))) / (stats?.total_inscritos || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Aprovados ({stats?.total_aprovados || 0})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      <span>Rejeitados ({stats?.total_rejeitados || 0})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-gray-400" />
                      <span>Pendentes ({(stats?.total_inscritos || 0) - ((stats?.total_aprovados || 0) + (stats?.total_rejeitados || 0))})</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium">Distribuição de Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-600" />
                            <span className="text-sm font-medium">Aprovados</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{stats?.total_aprovados || 0}</span>
                            <span className="text-xs text-gray-500">
                              ({((stats?.total_aprovados || 0) / (stats?.total_inscritos || 1) * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-600 rounded-full transition-all" 
                            style={{ width: `${((stats?.total_aprovados || 0) / (stats?.total_inscritos || 1)) * 100}%` }} 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-600" />
                            <span className="text-sm font-medium">Rejeitados</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{stats?.total_rejeitados || 0}</span>
                            <span className="text-xs text-gray-500">
                              ({((stats?.total_rejeitados || 0) / (stats?.total_inscritos || 1) * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-600 rounded-full transition-all" 
                            style={{ width: `${((stats?.total_rejeitados || 0) / (stats?.total_inscritos || 1)) * 100}%` }} 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-600" />
                            <span className="text-sm font-medium">Pendentes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {(stats?.total_inscritos || 0) - ((stats?.total_aprovados || 0) + (stats?.total_rejeitados || 0))}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({(((stats?.total_inscritos || 0) - ((stats?.total_aprovados || 0) + (stats?.total_rejeitados || 0))) / (stats?.total_inscritos || 1) * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full transition-all" 
                            style={{ 
                              width: `${((stats?.total_inscritos || 0) - ((stats?.total_aprovados || 0) + (stats?.total_rejeitados || 0))) / (stats?.total_inscritos || 1) * 100}%` 
                            }} 
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg font-medium">Check-ins vs Aprovados</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-600" />
                            <span className="text-sm font-medium">Check-ins Realizados</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{stats?.total_check_in || 0}</span>
                            <span className="text-xs text-gray-500">
                              ({((stats?.total_check_in || 0) / (stats?.total_aprovados || 1) * 100).toFixed(1)}% dos aprovados)
                            </span>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full transition-all" 
                            style={{ width: `${((stats?.total_check_in || 0) / (stats?.total_aprovados || 1)) * 100}%` }} 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-600" />
                            <span className="text-sm font-medium">Total de Aprovados</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{stats?.total_aprovados || 0}</span>
                            <span className="text-xs text-gray-500">(100%)</span>
                          </div>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-green-600 rounded-full" style={{ width: '100%' }} />
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {((stats?.total_check_in || 0) / (stats?.total_aprovados || 1) * 100).toFixed(1)}% dos participantes aprovados já realizaram check-in no evento.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
