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
        const msj = {msg:'Producto no encontrado'};
        return res.send(msj);
    }else{
        console.log("OK");
    }
    next();
};

function middlewareAdminValid (req, res, next){
    if(!ADM){
        const msj = {
            error: -1,
            descripcion:`Ruta http://localhost:8080/api/productos/${req.params.id} No autorizada.`
        };
        return res.send(msj);
    }else{
        console.log('ADM LOGGED');
    }
    next();
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

routerProductos.delete('/:id', middlewareAdminValid, (req,res)=>{
    let id = Number(req.params.id);
    productos.deleteById(id);
    res.status(200).json({msg:'Producto Borrado'});
})

routerProductos.put('/:id', middlewareAdminValid, (req, res)=>{
    let id = Number(req.params.id);
    let obj = req.body;
    productos.update(id,obj);
    res.status(200).json({msg:'Producto Actualizado', new:{...req.body}});
});

module.exports = routerProductos;