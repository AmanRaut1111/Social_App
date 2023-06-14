const express= require('express');
const dotenv=require('dotenv');
const db=require('./config/db');
const authRouter=require('./routers/auth');
const userRouter= require('./routers/user');
const postrouter=require('./routers/post')

dotenv.config();

//middleware
const app= express();

app.use(express.json())


app.use('/api',authRouter);
app.use('/user',userRouter);
app.use('/post',postrouter)


app.listen(process.env.PORT,()=>{
    console.log(`Backend server is running on port ${process.env.PORT}`);
})