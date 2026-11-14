// Нужен только для установки как приложение. Ничего не кэширует: всегда свежая версия с сервера,
// поэтому правки видны сразу после перезапуска окна.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
