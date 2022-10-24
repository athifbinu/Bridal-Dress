
var db=require('../DATABASE/connection')
var collection=require('../DATABASE/collections')
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
    }

    
}