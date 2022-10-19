
var express = require('express');
const productHelpers = require('../helpers/product-helpers');
const userHelpers=require('../helpers/user-helpers');
var router = express.Router();

/* GET home page. */

router.get('/',function(req,res,next){
  res.render('index',{admin:false})
  
})




router.get('/Productbanner',function(req,res,next){
  productHelpers.getallProducts().then((products)=>{
    res.render('user/Productbanner',{user:true,products})
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
    console.log(response)
  })

})










module.exports = router;
