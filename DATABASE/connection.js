
// const app=require("../app")

const MongoClient=require('mongodb').MongoClient
const state={
    db:null

}

module.exports.connect=function(done) {
    const url='mongodb+srv://Bride:1234@cluster0.oc4bu50.mongodb.net/?retryWrites=true&w=majority'
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