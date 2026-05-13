import exp from "express";
import {verifyToken} from "../middleWares/verifyToken.js";
import {UserTypeModel} from "../models/UserModel.js"
import { checkAdmin } from "../middleWares/checkAdmin.js";
import {ArticleModel} from "../models/ArticleModel.js"



export const adminRoute=exp.Router();

//read all articles
 adminRoute.get('/articles',verifyToken('ADMIN'),async(req,res)=>{
    //get all articles
    let articlesList=await ArticleModel.find({isArticleActive:true})
    .populate("author","firstName email")
    .populate("comments.user", "firstName email");

    res.status(200).json({message:"Articles are",payload:articlesList});
 })

// get article by Id
 adminRoute.get('/articles/:id',verifyToken('ADMIN'),async(req,res)=>{
  let articleId=req.params.id;
  let article=await ArticleModel.findById(articleId)
  .populate("author","firstName email")
  .populate("comments.user", "firstName email");
  res.status(200).json({message:"Article is",payload:article});
 })
 


//Block / Unblock User
adminRoute.patch("/users/:id/status", verifyToken("ADMIN"), async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  
  // Find article
  const user = await UserTypeModel.findById(id); //.populate("author");
  //console.log(article)
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  
  // Already in requested state
  if (user.isActive === isActive) {
    return res.status(400).json({
      message:`User is already ${isActive ? "active" : "blocked"}`,
    });
  }

  //update status
  user.isActive = isActive;
  await user.save();

  //send res
  res.status(200).json({
    message: `User ${isActive ? "Unblocked" : "blocked"} successfully`});
}); 

//get all users

adminRoute.get('/users',verifyToken("ADMIN"),async(req,res)=>{
    let users = await UserTypeModel.find();
    let usersWithoutAdmins=users.filter((user)=> user.role!=="ADMIN")
   
    res.status(200).json({message:"All users",payload:usersWithoutAdmins});
})
