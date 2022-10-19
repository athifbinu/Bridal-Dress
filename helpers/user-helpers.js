//user related funtion
var db=require('../DATABASE/connection')
var collection=require('../DATABASE/collections')
const bcrypt=require('bcrypt')


module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.password=await bcrypt.hash(userData.password,10)
            db.get().collection(collection.USER_COLLECTIONS).insertOne(userData).then((data)=>{
               userData._id= data.insertedId;
               resolve(userData)
            })
        })
    }

}