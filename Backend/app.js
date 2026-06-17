const express = require('express');
const app = express();

app.get("/", (req, res) => {
  res.send("hola respuesta desde node.js");
});

app.listen(2500,() => {
console.log("http://localhost:3000");
})

