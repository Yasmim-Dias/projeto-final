const app = require('./app.js');

// No Vercel NÃO usamos app.listen.
// Apenas exportamos o handler HTTP.

module.exports = app;

// Para rodar localmente:
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
  });
}
