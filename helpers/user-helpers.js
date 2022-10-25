//user related funtion
var db=require('../DATABASE/connection')
var collection=require('../DATABASE/collections')
const bcrypt=require('bcrypt');



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

    }
 
}



