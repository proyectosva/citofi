const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(express.json());

// Conexión automática con Railway (usando la variable de entorno)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Ruta para registrar usuarios (POST)
app.post('/registro', async (req, res) => {
  const { usuario, password } = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    await pool.query(
      'INSERT INTO clientes (usuario, password) VALUES ($1, $2)',
      [usuario, hashedPassword]
    );
    res.status(201).json({ mensaje: 'Usuario registrado con éxito en Railway' });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar: ' + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));