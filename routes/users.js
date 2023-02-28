
const { response } = require('express');
var express = require('express');
const { request } = require('../app');
const productHelpers = require('../helpers/product-helpers');
const userHelpers=require('../helpers/user-helpers');
var router = express.Router();


//user checking

const verifyloging=(req,res,next)=>{
  if(req.session.loggedIn) {
    next()
  }else{
    res.redirect('/loging')
  }
}
 

/* GET home page. */

router.get('/',function(req,res,next){
  res.render('index',{admin:false})
  
})




router.get('/Productbanner',verifyloging,async(req,res)=>{
  let user=req.session.user
  console.log(user)
  let CartCount=null
  if(req.session.user){
    CartCount=await userHelpers.getCartCount(req.session.user._id)
  }
 
  productHelpers.getallProducts().then((products)=>{
    res.render('user/Productbanner',{products,user,CartCount})
      console.log(products)
  })
})


router.get('/Makeup',(req,res)=>{
  res.render('user/Makeup')
})


router.get('/loging',function(req,res){
  if(req.session.loggedIn) {
    res.redirect('/')
  }else{
    res.render('user/loging',{"loginErr":req.session.loginErr})  
    req.session.loginErr=false     //second tyme passing err
  }

})


router.get('/signup',function(req,res){
  res.render('user/signup')
})

router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
    req.session.loggedIn=true
    req.session.user=response.user
    res.redirect('/Productbanner')
  })

})

router.post('/loging',(req,res)=>{
  userHelpers.doLoging(req.body).then((response)=>{
    console.log(response);
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/Productbanner')   
    }else{
      req.session.loginErr="Invalid Username and Password"
      res.redirect('/loging')
    }
  })

})



router.get('/logout',(req,res)=>{

  req.session.destroy()
  res.redirect('/')


})

 //delete

router.get('/delete-product/:id',async(req,res)=>{

   let proId =req.params.id
   console.log(proId)
   productHelpers.deleteProduct(proId).then((responce)=>{
       res.redirect('/Productbanner')
   })

})








//cart

router.get('/cart',verifyloging,async(req,res)=>{
  console.log("requst id ::  ")
  let products=await userHelpers.getCartProducts(req.session.user._id)
  let totalValue=await userHelpers.getTotalAmount(req.session.user._id)
  console.log(products)
  res.render('user/cart',{products,user:req.session.user,totalValue})
})



router.get('/add-to-cart/:id',(req,res)=>{
  console.log("api calling")
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
  // res.json({status:true})
  res('/Productbanner')
  })
  
 
  })



  router.post('/change-product-quantity',(req,res,next)=>{
    console.log(req.body)
      userHelpers.changeProductQuantity(req.body).then(async(response)=>{
        //req.body= is data from cart
        response.total=await userHelpers.getTotalAmount(req.body.user)
        res.json(response)

        
        
      })
  })
   
  //cart product delete

  router.post("/remove-cart-product", (req, res, next) => {
    userHelper.removeCartProduct(req.body).then((response) => {
      res.json(response);
    });
  });


  //place order

        
  router.get('/place-order',verifyloging,async(req,res)=>{
    let user =req.session.user;
    let userId =req.session.user._id;
    let CartCount=await userHelpers.getCartCount(userId);
     let total=await  userHelpers.getTotalAmount(userId)
     console.log(total)
    res.render('user/place-order',{admin:false,user,CartCount,total});
    
  })


  

   router.post('/place-order',async(req,res)=>{
    let user = req.body.user;
    let products=await userHelpers.getCartProductList(req.body.userId)
    let total=await userHelpers.getTotalAmount(req.body.userId)


    userHelpers
    .placeorder(req.body,products,total,user)
    .then((orderId)=>{
        if (req.body["payment-Method"]=== "COD") {
            res.json({status:true})
        }else {
          //razorpay payment method
          res.json({status:true})
        }
    
        console.log(req.body)
    })


  })
    




   router.get('/OrderSuccess',verifyloging,async(req,res)=>{
    let user =req.session.user;
    let userId=req.session.user._id;
    let CartCount =await userHelpers.getCartCount(userId)
    res.render('user/OrderSuccess',{admin:false,user,CartCount})
   })

   router.get('/Orders',verifyloging,async  (req,res)=>{
    let user =req.session.user;
    let userId =req.session.user._id;
    let cartCount =await userHelpers.getCartCount(userId)
    let orders=await userHelpers.getUserOrder(userId)
    res.render('user/Orders',{admin:false ,user,cartCount,orders})
     console.log(orders)
   })  



   router.get('/view-ordered-products/:id'
   ,verifyloging,
   async(req,res)=>{
    let user =req.session.user;
    let userId =req.session.user._id;
    let cartCount =await userHelpers.getCartCount(userId)
    let orderId =req.session.id;
      let products=await userHelpers.getOrderProducts(orderId)
      res.render('user/order-products',{
        admin:false,
        user,
        cartCount,
        products,
      })
   })


   




module.exports = router;
