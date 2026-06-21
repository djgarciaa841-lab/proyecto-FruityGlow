const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const SALT_ROUNDS = 10;

// POST /api/auth/registro
// Crea un usuario nuevo. La contraseña se guarda hasheada, nunca en texto plano.
router.post("/registro", (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Nombre, email y contraseña son requeridos" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  // Verificamos primero si el correo ya existe, para devolver un mensaje claro
  db.query("SELECT id FROM usuarios WHERE email = ?", [email], (error, filas) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al verificar el usuario" });
    }

    if (filas.length > 0) {
      return res.status(409).json({ error: "Ese correo ya está registrado" });
    }

    bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al procesar la contraseña" });
      }

      db.query(
        "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
        [nombre, email, hash],
        (error, resultado) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al crear el usuario" });
          }

          const usuarioId = resultado.insertId;
          const token = jwt.sign({ id: usuarioId }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });

          res.status(201).json({
            token,
            usuario: { id: usuarioId, nombre, email },
          });
        }
      );
    });
  });
});

// POST /api/auth/login
// Verifica las credenciales y devuelve un token si son correctas.
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son requeridos" });
  }

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], (error, filas) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al buscar el usuario" });
    }

    if (filas.length === 0) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }

    const usuario = filas[0];

    bcrypt.compare(password, usuario.password, (error, coincide) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al verificar la contraseña" });
      }

      if (!coincide) {
        return res.status(401).json({ error: "Correo o contraseña incorrectos" });
      }

      const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({
        token,
        usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
      });
    });
  });
});

module.exports = router;
