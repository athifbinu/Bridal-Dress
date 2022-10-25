
var express = require('express');
const {response}=require('../app')
var router = express.Router();
var productHelpers=require('../helpers/product-helpers');



/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getallProducts().then((products)=>{
    res.render('admin/view-products',{admin:true,products})
  })

});

router.get('/add-product',function(req,res){  
  res.render('admin/add-product')
  
})

router.post('/add-product',(req,res)=>{
    console.log(req.body)
    console.log(req.files.Image)
 productHelpers.addProduct(req.body,(id)=>{
  let image=req.files.Image
    console.log(image)
  image.mv('./public/product.images/'+id+'.jpg',(err,done)=>{
    if(!err){
      res.render("admin/add-product")
    
    
    }else {
      console.log(err)
    }
  })
       
 })

})

router.get('/delete-product/:id',(req,res)=>{
       let proId=req.params.id
       console.log(proId)
       productHelpers.deleteProducts(proId).then((response)=>{
        res.redirect('/admin/')
       })
       
})

router.get('/edit-product/:id',async(req,res)=>{
  let product=await productHelpers.getProductDetails(req.params.id)
  console.log(product)
  res.render('admin/edit-product',{product})
})

router.post('/edit-product/:id',(req,res)=>{
  let id=req.params.id
  console.log(req.params.id)
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let Image=req.files.Image
      Image.mv('./public/product.images/'+id+'.jpg')
  
    }

  })
})






module.exports = router;
