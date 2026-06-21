const express = require("express");
const db = require("../db");
const verificarToken = require("../middleware/auth");

const router = express.Router();

// Todas las rutas de carrito requieren estar logueado
router.use(verificarToken);

// Simulamos 100 unidades de stock disponibles por producto (no se le muestra al usuario)
const STOCK_DISPONIBLE = 100;

// GET /api/carrito
// Devuelve los productos del carrito del usuario logueado, con sus datos completos.
router.get("/", (req, res) => {
  const sql = `
    SELECT c.id, c.producto_id, c.cantidad,
           p.nombre, p.precio, p.imagen_url, p.descuento
    FROM carrito c
    JOIN productos p ON p.id = c.producto_id
    WHERE c.usuario_id = ?
    ORDER BY c.fecha_agregado DESC
  `;

  db.query(sql, [req.usuarioId], (error, filas) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al obtener el carrito" });
    }
    res.json(filas);
  });
});

// POST /api/carrito
// Agrega un producto al carrito. Si ya existe, incrementa la cantidad.
// body: { producto_id, cantidad }  (cantidad es opcional, por defecto 1)
router.post("/", (req, res) => {
  const { producto_id } = req.body;
  const cantidad = Number(req.body.cantidad) || 1;

  if (!producto_id) {
    return res.status(400).json({ error: "producto_id es requerido" });
  }

  // Confirmamos que el producto existe
  db.query("SELECT id FROM productos WHERE id = ?", [producto_id], (error, productos) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al verificar el producto" });
    }
    if (productos.length === 0) {
      return res.status(404).json({
        error: `El producto no existe (producto_id recibido: ${producto_id})`
      });
    }

    // Vemos si ya está en el carrito de este usuario
    db.query(
      "SELECT * FROM carrito WHERE usuario_id = ? AND producto_id = ?",
      [req.usuarioId, producto_id],
      (error, existentes) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Error al consultar el carrito" });
        }

        if (existentes.length > 0) {
          const fila = existentes[0];
          const nuevaCantidad = fila.cantidad + cantidad;

          if (nuevaCantidad > STOCK_DISPONIBLE) {
            return res.status(400).json({ error: "No hay suficiente stock disponible" });
          }

          db.query(
            "UPDATE carrito SET cantidad = ? WHERE id = ?",
            [nuevaCantidad, fila.id],
            (error) => {
              if (error) {
                console.error(error);
                return res.status(500).json({ error: "Error al actualizar el carrito" });
              }
              res.json({ mensaje: "Cantidad actualizada", cantidad: nuevaCantidad });
            }
          );
        } else {
          if (cantidad > STOCK_DISPONIBLE) {
            return res.status(400).json({ error: "No hay suficiente stock disponible" });
          }

          db.query(
            "INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)",
            [req.usuarioId, producto_id, cantidad],
            (error, resultado) => {
              if (error) {
                console.error(error);
                return res.status(500).json({ error: "Error al agregar al carrito" });
              }
              res.status(201).json({ mensaje: "Producto agregado", id: resultado.insertId });
            }
          );
        }
      }
    );
  });
});

// DELETE /api/carrito/:id
// Elimina una fila del carrito (id de la tabla carrito, no del producto).
// Solo permite borrar filas que pertenezcan al usuario logueado.
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM carrito WHERE id = ? AND usuario_id = ?",
    [id, req.usuarioId],
    (error, resultado) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al eliminar el producto" });
      }
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ error: "No se encontró ese producto en tu carrito" });
      }
      res.json({ mensaje: "Producto eliminado" });
    }
  );
});

module.exports = router;

