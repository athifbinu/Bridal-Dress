'use strict';
const { response } = require('express');
var express = require('express');
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



router.get('/Productbanner',verifyloging,(req,res)=>{
  productHelpers.getallProducts().then((products)=>{

    res.render('user/Productbanner',{products})
      console.log(products)
  })
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
    if(response.status){
    console.log(response)
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
  req.session.user=null
  res.redirect('/')


})

//cart
router.get('/cart',verifyloging,async(req,res)=>{
  
  res.render('user/cart')
})



router.get('/add-to-cart/:id',verifyloging,(req,res)=>{
  console.log("api calling")
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.redirect('/Productbanner')
       
  })
  

})







module.exports = router;
