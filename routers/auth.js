const express = require("express");
const router = express.Router();
const userModdel = require("../models/User");
const bcrypt = require("bcrypt");

//register user
router.post("/register", async (req, res) => {
  try {
    const { userName, password, email } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = new userModdel({
      userName: userName,
      password: hash,
      email: email,
    });
    const data = await user.save();
    console.log(data);
    if (data) {
      console.log(data);
      res
        .status(200)
        .json({
          message: "User Is Registerd Sucessfully...!",
          status: true,
          statusCode: 200,
          data: data,
        });
    } else {
      res
        .status(400)
        .json({
          message: "Something Went Wrong..!",
          status: false,
          statusCode: 400,
        });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "Something Went Wrong..!",
        status: false,
        statusCode: 500,
      });
  }
});

//login

router.post('/login',async(req,res)=>{
    try {
        const {email,password}=req.body
        if(email && password){
            const finddata= await userModdel.findOne({email:email});
            if(finddata){
 const match= await bcrypt.compare(password,finddata.password);
             if(match){
                res.status(200).json({message:"Login Sucessfully...!",status:true,statusCode:200,data:finddata})

 }else{
   return res.status(400).json({message:"Wrong Crendialtal..!",status:false,statusCode:400})

 }
            }else{
                return res.status(404).json({message:"User Not found...!",status:false,statusCode:404})
            }
        }else{
             res.status(404).json({message:"User Not found...!",status:false,statusCode:404})  
        }
     
    } catch (error) {

        console.log(error);
        res.status(400).json({message:"Something Went Wrong..!",status:false,statusCode:400})
    }
});

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (email && password) {
//       let getData = await userModdel.findOne({ email: email });
//       if (getData) {
//         let result = await bcrypt.compare(password, getData.password);

//         if (result) {
//           res.status(200).json({
//             status: true,
//             statusCode: 200,
//             message: "Login Successfully...!",
//           });
//         } else {
//           res.status(400).json({
//             status: false,
//             statusCode: 400,
//             message: "Invalid Credentials, Please Try Again",
//           });
//         }
//       } else {
//         res.status(400).json({
//           status: false,
//           statusCode: 400,
//           message: "User is not found please try again...!",
//           status: false,
//         });
//       }
//     }
//   } catch (error) {
//     console.log("error :", error);
//     res.status(500).json({
//       status: false,
//       statusCode: 500,
//       message: "Something Went Wrong..",
//     });
//   }
// });

module.exports = router;
