const mysql = require("mysql2");

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "windows789.4",
    database: "proyect_final"

});

 
conexion.connect((error) =>{
    if(error){
        console.error( "Error al conectar a MySQL", error);
        return;

    }
    console.log("conexión exitosa a MySQL: ");
});

module.exports = conexion;

