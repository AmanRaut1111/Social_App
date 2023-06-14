const express = require("express");
const router = express.Router();
const postModel = require("../models/post");
const mongoose = require("mongoose");

//create post

router.post("/", async (req, res) => {
  try {
    const postdata = new postModel(req.body);
    const data = await postdata.save();
    if (data) {
      res
        .status(200)
        .json({
          message: "Post created Sucessfully...!",
          status: true,
          statusCode: 200,
          data: data,
        });
    } else {
      res
        .status(400)
        .json({
          message: "Spmething Went Wrong...!",
          status: false,
          statusCode: 400,
        });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({
        message: "Spmething Went Wrong...!",
        status: false,
        statusCode: 400,
      });
  }
});

//update post

router.put("/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await postModel.updateOne({ $set: req.body });
      res.status(200).json({ message: "post updated Sucessfully..!" });
    } else {
      res.status(400).json({ mesage: "You can update only your post" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({
        message: "S0mething Went Wrong...!",
        status: false,
        statusCode: 400,
      });
  }
});

//delete

router.delete("/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await postModel.deleteOne();
      res.status(200).json({ message: "post deleted Sucessfully..!" });
    } else {
      res.status(400).json({ mesage: "You can delete only your post" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({
        message: "S0mething Went Wrong...!",
        status: false,
        statusCode: 400,
      });
  }
});

//post  like and dislike

router.put("/like/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await postModel.updateOne({
        $push: { likes: new mongoose.Types.ObjectId(req.body.userId) },
      });
      res
        .status(200)
        .json({
          message: "Post Has Been like...!",
          status: true,
          statusCode: 200,
        });
    } else {
      await postModel.updateOne({
        $pull: { likes: new mongoose.Types.ObjectId(req.body.userId) },
      });
      res
        .status(201)
        .json({
          message: "Post Has been disliked...!",
          status: true,
          statusCode: 201,
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

// findOut who likes your post and  Get total count

router.get("/findlikes", async (req, res) => {
  try {
    const likesdata = await postModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "likes",
          foreignField: "_id",
          as: "data",
        },
      },
      {
        $unwind: {
          path: "$data",
        },
      },
      {
        $project: {
          "data.userName": 1,
        },
      },
    ]);

    const data = likesdata.length;

    if (likesdata) {
      res
        .status(200)
        .json({
          message: "Likesdata Found sucessfully...!",
          status: true,
          statusCode: 200,
          data: likesdata,
          TotalLikes: data,
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
module.exports = router;
