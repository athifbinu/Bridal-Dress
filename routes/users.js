'use strict';
const { response } = require('express');
var express = require('express');
const productHelpers = require('../helpers/product-helpers');
const userHelpers=require('../helpers/user-helpers');
var router = express.Router();

/* GET home page. */

router.get('/',function(req,res,next){
  res.render('index',{admin:false})
  
})




router.get('/Productbanner',function(req,res,next){

  let users=req.ExSession.user            //check user to loging
  console.log(users)
  productHelpers.getallProducts().then((products)=>{
    res.render('user/Productbanner',{products})
  })

})

router.get('/loging',function(req,res){
  res.render('user/loging')  
})

router.get('/signup',function(req,res){
  res.render('user/signup')
})

router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response);
    res.redirect('/Productbanner')
  })

})

router.post('/loging',(req,res)=>{
  userHelpers.doLoging(req.body).then((response)=>{
    if(response.status){
    
      req.ExSession.loggedIn=true;   
      req.ExSession.user=response.user 
      res.redirect('/Productbanner')   
    }else{
      req.ExSession.logingErr=true;
      res.redirect('/loging')
    }
  })

})


router.get('/logout',(req,res)=>{
  req.ExSession.destroy()
  res.redirect('/')

})





module.exports = router;
