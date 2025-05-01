require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middlewares/authMiddleware');
const uploadRoutes = require('./routes/upload');

const app = express();
const prisma = new PrismaClient();

// === Configurar CORS ===
// Permite requisições de todas as origens. Para restringir, passa
// origin: 'http://teu-front-end.com' no objecto abaixo.
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Rotas de upload de ficheiros
app.use('/upload', uploadRoutes);

// Rotas de autenticação pública
app.use('/auth', authRoutes);

// Rota base
app.get('/', (req, res) => {
  res.send('API Cuida operacional');
});

// Rota protegida de exemplo
app.get('/me', authMiddleware, (req, res) => {
  res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email } });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
