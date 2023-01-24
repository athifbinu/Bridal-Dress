//user related funtion
var db=require('../DATABASE/connection')
var collection=require('../DATABASE/collections')
const bcrypt=require('bcrypt');
const { resolve, reject } = require('promise')
var Promise = require('promise');
const { response } = require('../app');
const { ObjectID } = require('mongodb');
// const { Promise } = require('mongodb');
var ObjectId=require('mongodb').ObjectId


module.exports={
    doSignup:(userData)=>{
        console.log(userData);
        return new Promise(async(resolve,reject)=>{
            userData.password=await bcrypt.hash(userData.password,10)
            db.get().collection(collection.USER_COLLECTIONS).insertOne(userData).then((data)=>{
                userData._id=data.insertedId
               resolve(userData)
              
            })
        })
    },

    doLoging:(userData)=>{
        console.log(userData)
        return new Promise(async(resolve,reject)=>{
            let logingStatus=false
            let response={}
            //fist check email adress in databse
     let user=await db.get().collection(collection.USER_COLLECTIONS).findOne({Email:userData.Email})
            //lets combare in db password(bycript) and our code password
            if(user) {
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        console.log("Loging Succcess")
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("Loging Error")
                        resolve({status:false})
                        
                    }
                })
                //never get data 
            }else{
                console.log("no data found")
                resolve({status:false})
            }
        })

    }, 

    
         //cart section

         addToCart:(proId,userId)=>{
            let proObj={
                item:ObjectId(proId),
                quantity:1
            }
            return new Promise(async(resolve,riject)=>{
                let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
                if(userCart){
                    let proExist=userCart.products.findIndex(product=> product.item==proId)
                    console.log(proExist)
                    if(proExist!=-1){
                         db.get().collection(collection.CART_COLLECTION)
                         .updateOne({user:ObjectId(userId),'products.item':ObjectId(proId)},
                         {
                            $inc:{'products.$.quantity':1}
    
                         }
                         ).then(()=>{
                            resolve()
                         })
                    }else{
    
                 
                      db.get(collection.CART_COLLECTION)
                    db.get().collection(collection.CART_COLLECTION)
                      .updateOne({user:ObjectId(userId)},
                        
                      {
                            
                            $push:{products:proObj}
                        
                
                      }
                      
                      ).then((response)=>{
                        resolve()
                      })
                    }
                }else{
                    let cartObj={
                        user:ObjectId(userId),
                        products:[proObj]
                    }
                    db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                        resolve()
                    })
                
                }
            })
          },

      
          getCartProducts:(userId)=>{
            console.log("Cartproducts:",userId)
            return new Promise(async(resolve,riject)=>{
                let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
                    {
                        $match:{user:ObjectId(userId)}
                    },
                    {
                        
                        $unwind: "$products"
                    },
                    {
                        $project:{
                            item:'$products.item',
                            quantity:'$products.quantity'
                            
                        }      
                    },
                    {
                        $lookup:{
                            from:collection.PRODUCT_COLLECTION,
                            localField:'item',
                            foreignField:'_id',
                            as:'product'

                        }
                    },
                    {
                        $project:{
                            item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                        }
                    }
                  
                ]).toArray()
                resolve(cartItems)
    
            })
        },

        getCartCount:(userId)=>{
            return new Promise(async(resolve,riject)=>{
                let count=0
                let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
                if(cart){
                    count=cart.products.length
                }
                resolve(count)
            })
        },

        changeProductQuantity:(details)=>{
            count=parseInt(details.count)
               //convert count and quantity to intiger
            details.quantity= parseInt(details.quantity)
              return new Promise((resolve,riject)=>{
                  if(details.count==-1 && details.quantity==1){
                    db.get().collection(collection.CART_COLLECTION).updateOne({_id:ObjectId(details.cart)},
                  {
                     $pull:{products:{item:ObjectId(details.product)}}
      
                  }
                  ).then((response)=>{
      
                     resolve({removeProduct:true}) 
                    //   resolve({status:true})
                  })
      
             
          }else{
            db.get().collection(collection.CART_COLLECTION)
            .updateOne({_id:ObjectId(details.cart),'products.item':ObjectId(details.product)},
              {
                  $inc:{'products.$.quantity':count}
              }
          ).then((response)=>{
              
            resolve({status:true});
      
            })
          }
      
       })

   },

    getTotalAmount:(userId)=>{
      
    return new Promise(async(resolve,riject)=>{
        let total=await db.get().collection(collection.CART_COLLECTION).aggregate([
            {
                $match:{user:ObjectId(userId)}
            },
            {
                $unwind:"$products"

            },
            {
                $project:{
                    item:'$products.item',
                    quantity:'$products.quantity'
                }
            },
            {
                $lookup:{
                    from:collection.PRODUCT_COLLECTION,
                    localField:'item',
                    foreignField:'_id',
                    as:'product'
                     
                }
            },
            {
                $project:{
                    item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                }
            },
            {
                $group:{
                    _id:null,
                    total:{$sum: {$multiply: [{$toInt: "$quantity"}, {$toInt: "$product.Price" }]}}

                }
            }

        ]).toArray()
        resolve(total[0].total)
        console.log(total[0].total)
        
    })
   },


   //place order

   placeorder:(order,products,total)=>{

    return new Promise((resolve,reject)=>{
        console.log(order,products,total)
        let status=order['payment-Method']==='COD'?'placed':'pending'
        let orderObject={
             deliveryDetails:{
                mobile:order.mobile,
                adress:order.adress,
                pincode:order.pincode
             },
             userId:ObjectId(order.userId),
             paymentMethod:order['payment-Method'],
             products:products,
             totalAmount:total,
             status:status,
             date:new date()
             
     
             
        }
        db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObject).then((responce)=>{
            db.get().collection(collection.CART_COLLECTION).deleteOne({user:ObjectId(order.userId)})
            console.log("order id",responce.ops[0]._id)
            resolve(responce.ops[0]._id)
        })

    })
          
   },
   getCartProductList(userId){
            return new Promise(async(resolve,riject)=>{
                console.log(userId)
                let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
                console.log(cart)
                resolve(cart.products)
               
            })
   },


   getUserOrder(userId){
    return new Promise(async(resolve,riject)=>{
        console.log(userId)
        let orders=await db.get().collection(collection.ORDER_COLLECTION)
        .find({userId:ObjectId(userId)}).toArray()
        console.log(orders)
        resolve(orders)
    })
   },


   getOrderProducts: (orderId) => {
        return new Promise(async (resolve, reject) => {
        let orderItems = await db
            .get()
            .collection(collection.ORDER_COLLECTION)
             .aggregate([
          {
            $match: { _id:ObjectId(orderId) },
          },
          {
            $unwind: "$orderObject.products",
          },
          {
            $project: {
              item: "$orderObject.products.item",
              quantity: "$orderObject.products.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
        ])
        .toArray();
        console.log(orderItems)
      resolve(orderItems);
    });
},






   

 }



