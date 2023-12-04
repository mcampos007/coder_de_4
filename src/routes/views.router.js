import { Router } from "express";
import __dirname from "../utils.js";
import {cartManager,  Cart}  from "../manager/CartManager.js";
import { ProductManager } from "../manager/ProductManager.js";


const router = Router();

const managerP = new ProductManager(`${__dirname}/data/productos.json`);

//Ruta principal
router.get('/', (req, res) =>{
    const saludo = {
        msg:"Bienvenido a backend en coderhouse",
        name:"Mario Campos",
        title:"Desafío entregable Nª4",
    } 
    console.log(saludo);
    res.render('index', {saludo});
});

//home de products
router.get('/productshome', (req, res) =>{
    //const managerP = new ProductManager;
    
    const products = managerP.getProducts();
    res.render('home', {
        title:"Listado de Productoos",
        products
    });
})

//realtimeProducts
router.get('/realtimeproducts', (req,res) =>{
    res.render('realTimeProducts', {
        title:"Listado de Productos c/WebSocket"
    })
})

//Lista de Carritos
router.get('/carritos', (req,res) => {
    const saludo = {
        title: "Listado de Carritos",
    }

    res.render('carts',{
        title:"Listado de carritos",
        carritos
    });
})

export default router;




