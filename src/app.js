import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewRouter from "./routes/views.router.js";
import productRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import {Server} from "socket.io";
import { logger } from "./utils/logger.js";
import { cartManager } from "./manager/CartManager.js";
import { ProductManager,  Producto} from "./manager/ProductManager.js";

const PORT=8080;        // Puerto de escucha
const app = express();

//Levantando el servidor
const httpServer = app.listen(PORT, ()=>{
    console.log(`The Server is running in port ${PORT}`);
    
});

// Instanciar Websocket
const io = new Server(httpServer);

// Middlewares
app.use(express.urlencoded({ extended:true }));
app.use(express.json());

//Inicializndo el motor
app.engine('hbs', handlebars.engine({
    extname:"hbs",
    defaultLayout:"main"
}));

//Ubicacion de las vistas
app.set('views', `${__dirname}/views`);

//Indico que el motor inicializad
app.set('view engine', 'hbs');

//Seteo de la rutas estática
app.use(express.static(`${__dirname}/public`));

app.use('/', viewRouter);

//Implementaciòn de Socket


app.use(logger);
//console.log("Definicion de Ruta a productos");
app.use("/api/products", productRouter);
//console.log("Definicion de rutas a Carts");
app.use("/api/carts",cartsRouter);

//WebSocket
const managerP = new ProductManager(`${__dirname}/data/productos.json`);

io.on("connection", (socket) => {
    console.log("cliente conectado");
    const productos = managerP.getProducts();
    console.log(productos);
    socket.emit("products_list", productos);
  
    socket.on("product_send", async (data) => {
        console.log(data);
        try {
          const product = new Producto(
            data.title,
            data.description,
            data.code,
            data.price,
            data.status,
            data.stock,
            data.category
          );
          await managerP.addProduct(product);
          
          socket.emit("products_list", managerP.getProducts());
        } catch (error) {
          console.log(error);
        }
      });
      socket.emit("products_list", managerP.getProducts());

      socket.on('product_delete', async(data) => {
        
        try{
            console.log(data);
            await managerP.deleteProduct(data);
            socket.emit("products_list", managerP.getProducts());

        }catch(error){
            console.log(error);
        };
      });
  });



