import exp from "express";
import {register,authenticate} from '../services/authServices.js'
import { verifyToken } from "../middleWares/verifyToken.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { upload } from "../config/multer.js";
import cloudinary  from '../config/cloudinary.js'
import {uploadToCloudinary} from '../config/cloudinaryUpload.js'

export const userRoute=exp.Router();

//Register User
userRoute.post("/users",upload.single("profileImageUrl"),async (req, res, next) => {
        let cloudinaryResult;
            try {
                let userObj = req.body;
                //  Step 1: upload image to cloudinary from memoryStorage (if exists)
                if (req.file) {
                cloudinaryResult = await uploadToCloudinary(req.file.buffer);
                }
                // Step 2: call existing register()
                const newUserObj = await register({
                ...userObj,
                role: "USER",
                profileImageUrl: cloudinaryResult?.secure_url,
                });
                res.status(201).json({
                message: "user created",
                payload: newUserObj,
                });
            } catch (err) {
                // Step 3: rollback 
                if (cloudinaryResult?.public_id) {
                await cloudinary.uploader.destroy(cloudinaryResult.public_id);
                }
                next(err); // send to your error middleware
            }
        }
        );


//Add comment to an article(protected)
userRoute.put('/comments',verifyToken("USER"),async(req,res)=>{
   // get userId,articleId,comments form request
   let {userId,articleId,comments}=req.body;
   //check user
   if(userId!==req.user._id){
      return res.status(403).json({message:"You are not allowed"})
   }

   //find article by id
   let checkArticle=await ArticleModel.find({_id:articleId});
   // if article not found
   if(!checkArticle){
    return res.status(404).json({message:"Article not found"});
   }
   //update article
   let updatedArticle=await ArticleModel.findByIdAndUpdate(articleId,{$push:{comments:{user:userId,comment:comments}}},{new:true,runValidators:true})
   .populate("author","firstName email")
   .populate("comments.user", "firstName email");
   res.status(200).json({message:"Comment added",payload:updatedArticle});
})


//Read all articles
userRoute.get('/articles',verifyToken("USER"),async(req,res)=>{
   //get all articles
   let articlesList=await ArticleModel.find({isArticleActive:true})
   .populate("author","firstName email")
   .populate("comments.user","firstName email")
   res.status(200).json({message:"Articles are",payload:articlesList});

})

userRoute.get('/article/:id',verifyToken("USER"),async(req,res)=>{
    let articleId=req.params.id;
    let article=await ArticleModel.find({_id:articleId})
    .populate("author","firstName email")
   .populate("comments.user","firstName email")
    res.status(200).json({message:"Articles are",payload:article});

})
