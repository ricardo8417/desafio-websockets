import  express from "express";
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'
import productsRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'
import viewsRouter from './routes/views.router.js'
import ProductManager from "./manager/ProductManager.js";
import __dirname from './utils.js'


const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//Creación handlebars
app.engine('handlebars',handlebars.engine())
app.set('views', __dirname + '/views' )
app.set('view engine', 'handlebars')

app.use('/', viewsRouter)
app.use('/api/products',productsRouter)
app.use('/api/carts',cartRouter)

//Configuracoón socket.io
const httpServer= app.listen(8080);
const io=new Server(httpServer)

io.on('connection', socket=>{
    socket.on('new-product', async data=>{
        try{
             
              const { title, descripcion, price,thumbnail, code, stock } =data;
            //    const thumbnail = Array.isArray(data.thumbnail)
            //      ? data.thumbnail
            //      : [data.thumbnail];
                  if (!title ||!descripcion ||!price ||!code ||!stock 
                  ) {
                    console.log("All fields are required");
                  }
           const productManager = new ProductManager("./dataBase/productos.json");

await productManager.addProduct(title,descripcion,price,thumbnail,code,stock);

const productos= await productManager.getProduct()
socket.emit('reload-table',productos)


        }catch(e){
        console.error(e)
        }
        
    })
})