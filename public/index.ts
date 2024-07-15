import express from 'express';
import path from 'path';

const app = express();

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rota de exemplo
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'));
});

// Iniciar o servidor
const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
