const express = require('express');
const cors = require("cors");
const db = require("./db");

const app = express();

app.use( express.json());
app.use(cors());


app.post("/api/usuarios", (req, res) => {
    const { email, password1 } = req.body;

    if (!email || !password1) {
        return res.status(400).json({error: "email y contraseña son requeridos"});

    }
   db.query("INSERT INTO usuarios (email, password1) VALUES (?, ?)",
     [email, password1], (error, resultado) => {
        if (error) { return res.status(500).json({error: "error al insertar"}); };

        res.json({id: resultado.insertId, email, password1});
     });
});

app.get("/", (req, res) => {
    db.query("select * from usuarios", (error, resultados) => {
        if (error) { return res.status(500).json({error: "error al leer"}); };

        res.json(resultados);
    })
});



app.listen(3000, () => {
console.log("servido backend corriendo en http://localhost:3000");

});


