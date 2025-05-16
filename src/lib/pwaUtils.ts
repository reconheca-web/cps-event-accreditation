// Utilitários para o PWA

/**
 * Captura a URL atual e a armazena para ser usada como página inicial do PWA
 * Isso garante que o PWA abra na mesma página em que foi instalado
 */
export function setupPWAStartUrl() {
  // Verificar se estamos em um navegador
  if (typeof window === 'undefined') return;

  // Não armazenar a página de login como URL inicial
  if (window.location.pathname === '/login') return;

  // Capturar a URL atual completa (pathname + search, exceto o parâmetro source=pwa)
  const currentPath = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.delete('source'); // Remover o parâmetro source se existir
  
  const queryString = searchParams.toString();
  const fullPath = currentPath + (queryString ? `?${queryString}` : '');
  
  // Armazenar a URL atual no localStorage
  localStorage.setItem('pwa_start_url', fullPath);
  console.log('PWA start URL configurada:', fullPath);
  
  // Adicionar um listener para o evento beforeinstallprompt
  window.addEventListener('beforeinstallprompt', () => {
    // Não armazenar a página de login como URL inicial
    if (window.location.pathname === '/login') return;
    
    // Atualizar a URL armazenada quando o prompt de instalação aparecer
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    params.delete('source');
    
    const query = params.toString();
    const fullUrl = path + (query ? `?${query}` : '');
    
    localStorage.setItem('pwa_start_url', fullUrl);
    console.log('PWA start URL atualizada no prompt:', fullUrl);
  });
}

/**
 * Redireciona para a URL armazenada se o aplicativo foi aberto como PWA
 * Deve ser chamado no início da aplicação
 */
export function redirectToPWAStartUrl() {
  // Verificar se estamos em um navegador
  if (typeof window === 'undefined') return;
  
  // Verificar se estamos sendo executados como PWA
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                (window.navigator as any).standalone === true;
  
  // Verificar se temos o parâmetro source=pwa na URL
  const urlParams = new URLSearchParams(window.location.search);
  const fromPWA = urlParams.get('source') === 'pwa';
  
  console.log('Verificando redirecionamento PWA:', { isPWA, fromPWA });
  
  // Se estamos sendo executados como PWA ou fomos abertos com o parâmetro source=pwa
  if ((isPWA || fromPWA) && localStorage.getItem('pwa_start_url')) {
    const startUrl = localStorage.getItem('pwa_start_url');
    console.log('URL armazenada para redirecionamento:', startUrl);
    console.log('URL atual:', window.location.pathname + window.location.search);
    
    // Remover o parâmetro source=pwa da URL atual para comparação
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.delete('source');
    const currentPathWithParams = window.location.pathname + (currentParams.toString() ? `?${currentParams.toString()}` : '');
    
    // Comparar a URL armazenada com a URL atual (sem o parâmetro source=pwa)
    if (startUrl && currentPathWithParams !== startUrl) {
      console.log('Redirecionando para:', startUrl);
      // Usar history.replaceState para evitar problemas com o botão voltar
      window.history.replaceState(null, '', startUrl);
      // Recarregar a página apenas se necessário (se a mudança de URL não for suficiente)
      if (window.location.pathname !== startUrl.split('?')[0]) {
        window.location.href = startUrl;
      }
    } else {
      console.log('Já estamos na URL correta, não é necessário redirecionar');
    }
  }
}
