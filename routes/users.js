
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
  


  //place order

        
  router.get('/place-order',verifyloging,async(req,res)=>{
     let total=await  userHelpers.getTotalAmount(req.session.user._id)
     console.log(total)
    res.render('user/place-order',{total,user:req.session.user})
    
  })

  
   router.post('/place-order',async(req,res)=>{
    console.log(req.body)
    let products=await userHelpers.getCartProductList(req.body.userId)
    let total=await userHelpers.getTotalAmount(req.body.userId)
    userHelpers.placeorder(req.body,products,total).then((response)=>{

        res.json({status:true})
    })

   })


   router.get('/OrderSuccess',(req,res)=>{
    res.render('user/OrderSuccess',{user:req.body.session.user})
   })

   router.get('/Orders',async(req,res)=>{
    let orders=await userHelpers.getUserOrder(req.session.user._id)
    res.render('user/Orders',{user:req.session.user.orders})
     console.log(orders)
   })  


   router.get('/view-ordered-products/:id',async(res,res)=>{
      let products=await userHelpers.getOrderProducts(req.params._id)
      res.render('user/view-ordered-products',{user:res.session.user.products})
      console.log(products)
   })




module.exports = router;
