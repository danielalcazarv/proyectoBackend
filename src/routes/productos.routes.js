/******Modulos******/
const express = require ('express');
const Contenedor = require('../models/contenedor.js');
const productos = new Contenedor('./src/db/productos.json');

const routerProductos = express.Router();
const ADM = true;

/******Middleware******/
async function middlewareGetIdNotFound (req,res,next){
    let id = Number(req.params.id);
    const prod = await productos.getById(id);
    if (prod==null){
        const msj = {
            error:404,
            descripcion:`Not found. El producto no existe. Ruta: ${req.baseUrl}${req.url} || Método: ${req.method}`};
        res.status(404).json(msj);
    }else{
        next();
    }
};

function middlewareAdminValid (req, res, next){
    if(!ADM){
        const msj = {
            error: 403,
            descripcion:`Forbidden Access. Require permisos de admin. Ruta: ${req.baseUrl}${req.url} || Método: ${req.method} No autorizado.`
        };
        res.status(403).json(msj);
    }else{
        next();
    }
};

/******Rutas******/
routerProductos.get('/', async (req,res)=>{
    const prods = await productos.getAll();
    return res.status(200).json(prods);
});

routerProductos.get('/:id', middlewareGetIdNotFound, async (req,res)=>{
    let id = Number(req.params.id);
    const prod = await productos.getById(id);
    res.status(200).json(prod);
});

routerProductos.post('/', middlewareAdminValid, (req,res)=>{
    let obj = req.body;
    productos.save(obj)
    res.status(200).json({msg:'Producto Agregado', data: req.body});
});

routerProductos.delete('/:id', middlewareAdminValid, middlewareGetIdNotFound, (req,res)=>{
    let id = Number(req.params.id);
    productos.deleteById(id);
    res.status(200).json({msg:'Producto Borrado'});
})

routerProductos.put('/:id', middlewareAdminValid, middlewareGetIdNotFound, (req, res)=>{
    let id = Number(req.params.id);
    let obj = req.body;
    productos.update(id,obj);
    res.status(201).json({msg:'Producto Actualizado', new:{...req.body}});
});

module.exports = routerProductos;