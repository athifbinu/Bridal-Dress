//user related funtion
var db=require('../DATABASE/connection')
var collection=require('../DATABASE/collections')
const bcrypt=require('bcrypt');
const { response } = require('../app');
const ObjectId=require('mongodb').ObjectId


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
        return new Promise(async(resolve,riject)=>{
            let logingStatus=false;
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
     
       return new Promise(async(resolve,riject)=>{
        let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
        if(userCart){
            
          db.get().collection(collection.CART_COLLECTION)
          .updateOne({user:ObjectId(userId)}),
              {
             
                    $push:{products:ObjectId(proId)}
         
              }.then((response)=>{
                resolve()
              })
        }else{
            let cartobj={
                user:ObjectId(userId),
                products:[ObjectId(proId)]
            }
            db.get().collection(collection.CART_COLLECTION).insertOne(cartobj).then((response)=>{
                resolve()
            })
        }

       })
    }



 

   

}



