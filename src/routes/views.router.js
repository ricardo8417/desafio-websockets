import { Router } from "express";
import ProductManager from "../manager/ProductManager.js";

const router = Router()
const productos = new ProductManager("./dataBase/productos.json");

router.get('/',(req,res)=>{
    res.render('index',{})
})

//Consultamos la lista de productos de Nuestra BD
router.get("/products", async (req, res) => {
  try {
    const products = await productos.getProduct();

    res.render("products", { products });
  } catch (e) {
    console.error(e);
  }
});


router.get("/products-realtime", async (req, res) => {
  try {
    const products = await productos.getProduct();

res.render("products_realtime", { products, title:'Formulario Productos' });
  } catch (e) {
    console.error(e);
  }
});


  //Ruta de formulario de Productos.
  router.get("/form-products", async (req, res) => {

  try {
    
    res.render("form", {});
    
  } catch(e) {
    console.error(e)
  }

});

//Creamos el post para el formulario
 router.post("/form-products", async (req, res) => {
   try {
     
     //Se instancia en el body cada campo.
     const title = req.body.title;
     const descripcion = req.body.descripcion;
     const price = req.body.price;
     const thumbnail = req.body.thumbnail;
     const code = req.body.code;
     const stock = req.body.stock;
     const addProduct = await productos.addProduct(title,descripcion,price,thumbnail,code,stock);
    
     res.redirect('/products')
    //  res.render("form", {});
   } catch (e) {
     console.error(e);
   }
 });

export default router