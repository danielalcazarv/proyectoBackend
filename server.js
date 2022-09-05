/******Modulos******/
const express = require ('express');
const path = require('path');
const morgan = require('morgan');

//Instancias de servidor
const app = express();
const routerProductos = require('./src/routes/productos.routes.js');
const routerCarritos = require('./src/routes/carrito.routes.js');

/******Middleware******/
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));
app.use(morgan('dev'));

/******Rutas******/
app.use('/api/productos', routerProductos);
//app.use('/api/carrito', routerCarritos);

//Errores globales
app.use(function(err,req,res,next){
    console.error(err.stack);
    res.status(err.status || 500).send({error: "Algo se rompió"})
});

/******Servidor******/
const port = 8080;
app.listen(port, ()=>{
    console.log("Tu servidor esta corriendo en el puerto " + port);
})
app.on("error", error=> console.log("El error es: " + error))