// Utilitários para o PWA

/**
 * Captura a URL atual e a armazena para ser usada como página inicial do PWA
 * Isso garante que o PWA abra na mesma página em que foi instalado
 */
export function setupPWAStartUrl() {
  // Verificar se estamos em um navegador
  if (typeof window === 'undefined') return;

  // Capturar a URL atual (pathname)
  const currentPath = window.location.pathname;
  
  // Armazenar a URL atual no localStorage
  localStorage.setItem('pwa_start_url', currentPath);
  
  // Adicionar um listener para o evento beforeinstallprompt
  window.addEventListener('beforeinstallprompt', () => {
    // Atualizar a URL armazenada quando o prompt de instalação aparecer
    localStorage.setItem('pwa_start_url', window.location.pathname);
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
  
  // Se estamos sendo executados como PWA e temos uma URL armazenada
  if ((isPWA || fromPWA) && localStorage.getItem('pwa_start_url')) {
    const startUrl = localStorage.getItem('pwa_start_url');
    
    // Só redirecionar se não estivermos já na URL correta
    if (startUrl && window.location.pathname !== startUrl) {
      window.location.href = startUrl;
    }
  }
}
