const express = require ('express');
const Carrito = require('../models/contenedor.js');
const carritos = new Carrito('./src/models/carritos.json');

const routerCarrito = express.Router();

/******Middleware******/
async function middlewareGetIdNotFound (req,res,next){
    let id = Number(req.params.id);
    const cart = await carritos.getById(id);
    if (cart==null){
        const msj = {msg:'Carrito de Usuario no encontrado'};
        return res.send(msj);
    }else{
        console.log("OK");
    }
    next();
};

/******Rutas******/
routerCarrito.get('/', (req,res)=>{
    return res.send("armando carrito")
})

module.exports = routerCarrito;