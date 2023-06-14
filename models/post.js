const mongoose=require('mongoose');


const postSchema= mongoose.Schema({
userId:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
},
desc:{
    type:String
},
img:{
    type:String
},
likes:{
    type:Array,
    default:[]
},
createdAt:{
    type:Date,
    default:new Date()
},

createdAt:{
    type:Date,
    default:new Date()
}
});

module.exports= mongoose.model('post',postSchema)