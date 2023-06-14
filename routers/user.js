const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose=require('mongoose')

const User = require("../models/User");

//update user
router.put("/updateUser/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { userName, password, email } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const data = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          userName: userName,
          password: hash,
          email: email,
        },
      },
      { new: true }
    );
    if (data) {
      res
        .status(200)
        .json({
          message: "User Is Updated Sucessfully...!",
          status: true,
          statusCode: 200,
          data: data,
        });
    } else {
      res
        .status(400)
        .json({
          message: "Something Went wrong...!",
          status: false,
          statusCode: 400,
        });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "Something Went wrong...!",
        status: false,
        statusCode: 500,
      });
  }
});

//delete user

router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findByIdAndDelete(id);
    if (data) {
      res
        .status(200)
        .json({
          message: "User Account has been deleted Sucessfully...!",
          status: true,
          statusCode: 200,
        });
    } else {
      res
        .status(400)
        .json({
          message: "Something Went Wrong...!",
          status: false,
          statusCode: 400,
        });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({
        message: "Something Went Wrong...!",
        status: false,
        statusCode: 400,
      });
  }
  try {
    const id = req.params.id;
    const data = await User.findByIdAndDelete(id);
    if (data) {
      res
        .status(200)
        .json({
          message: "User Account has been deleted Sucessfully...!",
          status: true,
          statusCode: 200,
        });
    } else {
      res
        .status(400)
        .json({
          message: "Something Went Wrong...!",
          status: false,
          statusCode: 400,
        });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({
        message: "Something Went Wrong...!",
        status: false,
        statusCode: 400,
      });
  }
});
//get user

router.get("/getUser/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const data = await User.findById(id);
    if (data) {
      res
        .status(200)
        .json({
          message: "Data Found Sucessfully..!",
          status: true,
          statusCode: 200,
          data: data,
        });
    } else {
      res
        .status(400)
        .json({
          message: "Something Went Wrong...!",
          status: false,
          statusCode: 400,
        });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        message: "Something Went Wrong...!",
        status: false,
        statusCode: 500,
      });
  }
});



router.put("/follow/:id", async (req, res) => {
  try {
    if (req.body.userId !== req.params.id) {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: new mongoose.Types.ObjectId(req.body.userId) } });
        await currentUser.updateOne({ $push: { following: new mongoose.Types.ObjectId(req.body.userId) } });
        res.status(200).json({ message: `you follow ${user.userName}` });
      } else {
        res
          .status(400)
          .json({
            messsage: "You already follow this user",
            status: false,
            statusCode: 400,
          });
      }
    } else {
      res
        .status(400)
        .json({
          messsage: "You Cant follow yourself",
          status: false,
          statusCode: 400,
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Something Went Wrong..!",status:false,statusCode:500})
  }
});

//unfollow

router.put("/unfollow/:id", async (req, res) => {
  try {
    if (req.params.id !== req.body.userId) {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await User.updateOne({ $pull: { followers:new  mongoose.Types.ObjectId(req.body.userId) } });
        await currentUser.updateOne({ $pull: { followers:new mongoose.Types.ObjectId(req.body.userId) } });
        res.status(200).json({ message: `you Unfollow ${user.userName}` });
      }
    } else {
      res
        .status(200)
        .json({
          message: "You alredy Unfollow ",
          status: false,
          statusCode: 400,
        });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({
        messsage: "You Cant Unfollow yourself",
        status: false,
        statusCode: 400,
      });
  }
});

// get userdetail & get list of followers and follwing

router.get('/getuser',async(req,res)=>{
  try {
    const userdata=await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.query._id)
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          as: "followersData",
        },
      },
      {
        $unwind: {
          path: "$followersData",
        },
      },
      {
        $project: {
          "followersData.userName": 1,
        },
      },
    ])

    
    if(userdata){
 const count= userdata.length;
 const finalCount=count>0 ?count:0;


res.status(200).json({message:"Data Found Sucessfully" ,status:true, statusCode:200,userdata:userdata, TotalFollower:finalCount})
    }else{
      res.status(400).json({message:"This user has No follwers..!",status:false,statusCode:400})
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Something Went Wrong..!",status:false,statusCode:500})
  }
});

 //pagination
router.get('/page',async(req,res)=>{
  try {
    let page=req.query.page;
    let limit=req.query.limit
    const data= await User.aggregate([
      {
        '$skip': (page-1)*limit
      }, {
        '$limit': parseInt(limit)
      }, {
        '$sort': {
          '_id': -1
        }
      }
    ]);
  if(data){
  res.status(200).json({message:"Data found..!",status:true, statusCode:200,data:data})
  }else{
    res.status(400).json({message:"Something Went Wrong..!",status:false,statusCode:400})
  }
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Something Went Wrong..!",status:false,statusCode:500})
  }
})
module.exports = router;





