
var db=require('../DATABASE/connection')
var collection=require('../DATABASE/collections')
// const { ObjectID, ObjectId } = require('bson')
const { response } = require('../app')
const { resolve } = require('promise')
const ObjectId=require('mongodb').ObjectId
//product related funtions
module.exports={

    addProduct:(product,callback)=>{
       console.log(product)

        db.get().collection('product').insertOne(product).then((data)=>{
             callback(data.insertedId)
             
            
        })

    },
    getallProducts:()=>{
        return new Promise(async(resolve,riject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    //admin side delete
    deleteProducts:(proId)=>{
        return new Promise((resolve,riject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:ObjectId(proId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    getProductDetails:(proId)=>{
        return new Promise ((resolve,riject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(proId)}).then((product)=>{
                resolve(product)
            
                
            })
        })
    },

      //user side delete
    deleteProduct:(proId)=>{
        return new Promise((resolve,riject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:ObjectId(proId)}).then((response)=>{
                resolve(response)
                console.log("product deleted")
            })
        })
    },
    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,riject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectId(proId)},{
                //which tropics you want update
                $set:{
                    Name:proDetails.Name,
                    Description:proDetails.Description,
                    Price:proDetails.Price,
                    Category:proDetails.Category
                }
            }).then((response)=>{
                resolve()
            })
        })

    }

    
}

