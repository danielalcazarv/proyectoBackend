const express = require ('express');
const Contenedor = require('../models/contenedor.js');
const carritos = new Contenedor('./src/db/carritos.json');
const productos = new Contenedor('./src/db/productos.json');

const routerCarrito = express.Router();

/******Middleware******/
//Valida id de carritos.
async function middlewareGetCartId (req,res,next){
    let id = Number(req.params.id);
    const cart = await carritos.getById(id);
    if (cart==null){
        const msj = {
            error:404,
            descripcion:`Not found. Carrito de Usuario no encontrado. Ruta: ${req.baseUrl}${req.url} || Método: ${req.method}`};
        res.status(404).json(msj);
    }else{
        next();
    }
};

//Valida si el carrito tiene productos
async function middlewareGetCartProdNotFound (req,res,next){
    let id = Number(req.params.id);
    const cart = await carritos.getById(id);
    const index = cart.productos.findIndex(x=>x.id);
    if (index == -1){
        const msj = {
            error:404,
            descripcion:`Not found. Carrito de Usuario vacio. Ruta: ${req.baseUrl}${req.url} || Método: ${req.method}`};
        res.status(404).json(msj);
    }else{
        next();
    }
};

//Valida si el producto existe en db
async function middlewareProdNotFound (req,res,next){
    let id = Number(req.body.id);
    const prod= await productos.getById(id);
    if (prod==null){
        const msj = {
            error:404,
            descripcion:`Not found. Producto inexsistente. Ruta: ${req.baseUrl}/${req.body.id} || Método: ${req.method}`};
        res.status(404).json(msj);
    }else{
        next();
    }
};

/******Rutas******/
routerCarrito.post('/', (req,res)=>{
    carritos.save({productos:[]});
    res.status(200).json({msg:`Carrito creado`});
});

routerCarrito.delete('/:id', middlewareGetCartId, (req,res)=>{
    let id = Number(req.params.id);
    carritos.deleteById(id);
    res.status(200).json({msg:'Carrito borrado'});
});

routerCarrito.get('/:id/productos', middlewareGetCartId, middlewareGetCartProdNotFound, async (req,res)=>{
    let id = Number(req.params.id);
    const cart = await carritos.getById(id);
    const prods = cart.productos;
    res.status(200).json(prods);
});

routerCarrito.post('/:id/productos/', middlewareGetCartId, middlewareProdNotFound, async (req,res)=>{ 
    let idCart = Number(req.params.id);
    const currentCart = await carritos.getById(idCart);
    const newProducto = await productos.getById(req.body.id);
    currentCart.productos.push(newProducto);
    carritos.update(idCart,{productos:[...currentCart.productos]});
    res.status(200).json({msg:'Producto Agregado al Carrito'});
});

routerCarrito.delete('/:id/productos/:id_prod', middlewareGetCartId, middlewareGetCartProdNotFound, async (req,res)=>{
    let idCart = Number(req.params.id);
    let idProd = Number(req.params.id_prod);
    const getCurrentCart = await carritos.getById(idCart);
    const newCart = getCurrentCart.productos.filter(obj=>obj.id!=idProd);
    carritos.update(idCart,{productos:[...newCart]});
    res.status(200).json({msg:'Producto eliminado del Carrito'});
});

module.exports = routerCarrito;