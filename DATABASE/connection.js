
// const app=require("../app")
const dotenv = require('dotenv');


dotenv.config();


const MongoClient=require('mongodb').MongoClient
const state={
    db:null

}

const db_url=process.env.MONGODB__URL

module.exports.connect=function(done) {
    const url=(db_url)
    const dbName="BrideDb"
    

    MongoClient.connect(url,(err,data)=>{
        if(err) return done(err)     //error passing
        state.db=data.db(dbName)     //db connection 

          done()
    })
    
}
module.exports.get=function(){
    return state.db
}