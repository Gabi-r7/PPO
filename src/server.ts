import express from 'express';
import path from 'path';
import routes from '../src/api/routes/routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware para servir arquivos estáticos
app.use('/src', express.static(path.join(__dirname, '..', 'src')));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'src')));
app.use(cookieParser());

app.use(routes);

// Iniciar o servidor
const PORT = process.env.PORT || 6969;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
