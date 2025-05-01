require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rotas públicas
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API Cuida operacional');
});

// Exemplo de rota protegida
app.get('/me', authMiddleware, (req, res) => {
  // req.user foi adicionado pelo middleware
  res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email } });
});

app.listen(3000, () => {
  console.log('Servidor a correr em http://localhost:3000');
});
