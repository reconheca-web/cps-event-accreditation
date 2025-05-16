import { registerSW } from 'virtual:pwa-register';

// Este arquivo é responsável por registrar o service worker do PWA
// e configurar a atualização automática quando uma nova versão estiver disponível

const updateSW = registerSW({
  // Quando uma nova versão do service worker estiver disponível
  onNeedRefresh() {
    // Chamar a callback no objeto window se existir
    if (window.updateSWCallbacks?.onNeedRefresh) {
      window.updateSWCallbacks.onNeedRefresh();
    }
  },
  // Quando o service worker estiver offline
  onOfflineReady() {
    // Chamar a callback no objeto window se existir
    if (window.updateSWCallbacks?.onOfflineReady) {
      window.updateSWCallbacks.onOfflineReady();
    } else {
      console.log('Aplicativo pronto para uso offline');
    }
  },
});

export default updateSW;
