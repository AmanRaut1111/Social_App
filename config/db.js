const mongoose=require('mongoose');

const dotenv=require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("connected");
}).catch((error)=>{
    console.log("connection failed",error);
})