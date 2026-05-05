const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(express.json());

// 🔹 CONEXIÓN DB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 🔹 RUTA BASE
app.get('/', (req, res) => {
  res.send('Backend funcionando en Railway 🚀');
});

// 🔹 REGISTRO
app.post('/registro', async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO clientes (usuario, password) VALUES ($1, $2)',
      [usuario, hashedPassword]
    );

    res.status(201).json({ mensaje: 'Usuario registrado' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 LOGIN
app.post('/login', async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM clientes WHERE usuario = $1',
      [usuario]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no existe' });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json({ mensaje: 'Login exitoso' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 PUERTO (IMPORTANTE)
const PORT = process.env.PORT || 3000;

// 🔹 INICIAR SERVIDOR (SIEMPRE AL FINAL)
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});