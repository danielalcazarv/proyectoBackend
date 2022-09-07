const fs = require('fs');

class Contenedor {
    constructor(archivo){
        this.archivo = archivo
    };

    async getAll() {
        try{
            const contenido = await fs.promises.readFile(this.archivo,'utf-8');
            if (contenido===""){
                const datos = [];
                return datos;
            }else{
                const datos2 = JSON.parse(contenido);
                return datos2;
            }
        }
        catch (error){
            console.log('Error al leer archivo. Tipo de error: ' + error);
        }
    };

    async save (objeto) {
        const objsCollection = await this.getAll();
        const timestamp = new Date().toLocaleString();
        let newId;
        if (objsCollection.length == 0) {
            newId = 1;
        } else {
            newId = objsCollection[objsCollection.length - 1].id + 1;
        }
        const newProducto = {id:newId, timestamp:timestamp, ...objeto};
        objsCollection.push(newProducto);
        const objsJson = JSON.stringify(objsCollection);
        try {
            await fs.promises.writeFile(this.archivo,objsJson);
            console.log("Guardado exitosamente!.");
        }
        catch (error){
            console.log("Error al guardar. Tipo de error: "+ error);
        }
    };

    async getById (id){
        try{
            const objsCollection = await this.getAll();
            const idFiltrado = objsCollection.find(obj => obj.id === id);
            if (idFiltrado===undefined){
                console.log("Producto no encontrado.");
                const notFound = null;
                return notFound;
            }else{
                return idFiltrado;
            }
        }
        catch (error){
            console.log('No se encontró id. Tipo de error: ' + error);
        }
    };

    async deleteById (id){
        try{
            const objsCollection = await this.getAll();
            const objsCollectionFiltrado = objsCollection.filter(obj => obj.id!=id);
            const objsJson = JSON.stringify(objsCollectionFiltrado);
            await fs.promises.writeFile(this.archivo,objsJson);
            console.log("Producto eliminado.");
        }
        catch(error){
            console.log('No se pudo eliminar id. Tipo de error: ' + error);
        }
    };

    async deleteAll (){
        try{
            const arrVacio = "";
            await fs.promises.writeFile(this.archivo,arrVacio);
            console.log("Se eliminó todo el contenido exitosamente!");
        }
        catch(error){
            console.log(error);
        }
    };

    async update (id,obj){
        const objsCollection = await this.getAll();
        const objsCollectionFiltrado = objsCollection.filter(obj => obj.id!=id);
        const objTargetId = objsCollection.filter(obj => obj.id==id);
        const timestamp = objTargetId[0].timestamp;
        const newProducto = {id:id,timestamp:timestamp, ...obj};
        objsCollectionFiltrado.push(newProducto);
        const objsJson = JSON.stringify(objsCollectionFiltrado);
        try {
            await fs.promises.writeFile(this.archivo,objsJson);
            console.log("Contenido actualizado.");
        }
        catch (error){
            console.log("Error al actualizar. Tipo de error: "+ error);
        }
    };
};

module.exports = Contenedor;