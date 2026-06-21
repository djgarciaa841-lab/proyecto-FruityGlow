const jwt = require("jsonwebtoken");

// Verifica el token enviado en el header Authorization: Bearer <token>
// Si es válido, agrega req.usuarioId con el id del usuario autenticado.
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "No se envió un token de autenticación" });
  }

  const partes = authHeader.split(" ");
  if (partes.length !== 2 || partes[0] !== "Bearer") {
    return res.status(401).json({ error: "Formato de token inválido" });
  }

  const token = partes[1];

  jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
    if (error) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }
    req.usuarioId = payload.id;
    next();
  });
}

module.exports = verificarToken;
