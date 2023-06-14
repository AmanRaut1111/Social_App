const mongoose=require('mongoose');


const userSchema= mongoose.Schema({
    userName:{
        type:String,
        required :true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required :true,
    },
    profilepic:{
        type:String,
        default:""
    },
    coverpic:{
        type:String,
        default:""
    },

    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    },
    isAdmin:{
        type:Boolean,
        default:false
    },

    desc:{
        type:String
    },

    city:{
        type:String
    },
    relationship:{
   type:Number,
   enum:[1,2,3]
    },

    createdAt:{
        type:Date,
        degault:new Date()
    },

    updatedAt:{
        type:Date,
        degault:new Date()
    },
});

module.exports= mongoose.model('user',userSchema)