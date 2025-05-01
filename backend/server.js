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

const uploadRoutes = require('./routes/upload');

app.use('/upload', uploadRoutes);


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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
