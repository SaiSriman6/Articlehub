import exp from "express";
import {register,authenticate} from "../services/authServices.js"
import { ArticleModel } from "../models/ArticleModel.js"
import { UserTypeModel } from "../models/UserModel.js"
import {checkAuthor} from "../middleWares/checkAuthor.js"
import { verifyToken } from "../middleWares/verifyToken.js"
import {upload} from '../config/multer.js'
import {uploadToCloudinary} from '../config/cloudinaryUpload.js'
import cloudinary from '../config/cloudinary.js'

export const authorRoute=exp.Router();

//register author(public route)
// authorRoute.post('/users',async(req,res)=>{
//     //get userObj from req
//     let userObj=req.body;
//     //call register
//     let newUserObj=await register({...userObj,role:'AUTHOR'})
//     //send res
//     res.status(201).json({message:"author created",payload:newUserObj});
// })


authorRoute.post("/users",upload.single("profileImageUrl"),async (req, res, next) => {
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
                role: "AUTHOR",
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


//create article(protected route)
authorRoute.post('/articles',verifyToken("AUTHOR"),async(req,res)=>{
    //get article for req
    let article=req.body;
    article.author=req.user._id
    // create new article and push into database
    let newArticleDoc= new ArticleModel(article);
    let createdArticle=await newArticleDoc.save();
    
    // send response
    return res.status(201).json({message:"article created",payload:createdArticle})

})

//read article of author(protected route)
authorRoute.get('/articles/:id',verifyToken("AUTHOR"),async(req,res)=>{
    //get author from req
    let authorId=req.params.id;
    if(authorId!==req.user._id){
        return res.status(403).json({message:"You are not allowed"})
    }
    //send article by this author
    let articles= await ArticleModel.find({author:authorId})
    .populate("author","firstName email")
    .populate("comments.user", "firstName email");;
    //send res
    res.status(200).json({message:"articles are",payload:articles})
})

//edit article(protected route)
authorRoute.put('/articles',verifyToken("AUTHOR"),async(req,res)=>{
    //get modified article 
    
    let {articleId,title,category,content,author}=req.body;
    //check article
    let checkArticle= await ArticleModel.findOne({_id:articleId,author:author});

    if(!checkArticle){
        return res.status(401).json({message:"Article not found"});
    }
    if(author.toString() !== req.user._id.toString()){
        return res.status(403).json({message:"You dont have access"})
    }
    //update article
    let latestArticle = await ArticleModel.findByIdAndUpdate(
  articleId,
  { $set: { title, category, content } },
  { new: true }
)
.populate("author", "firstName email")
.populate("comments.user", "firstName email");
    if(!latestArticle){
        return res.status(401).json({message:"article not found"});
    }
    //send res
    res.status(200).json({message:"article updated",payload:latestArticle});

})

//delete(soft delete) article(Protected route)
authorRoute.patch("/articles/:id/status", verifyToken("AUTHOR"), async (req, res) => {

  const { id } = req.params;
  const { isArticleActive } = req.body;
 
  // Find article
  const article = await ArticleModel.findById(id); //.populate("author");
  //console.log(article)
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  //console.log(req.user.userId,article.author.toString())
  // AUTHOR can only modify their own articles
  if (req.user.role === "AUTHOR" && 
    article.author.toString() !== req.user._id) {
    return res
    .status(403)
    .json({ message: "Forbidden. You can only modify your own articles" });
  }
  // Already in requested state
  if (article.isArticleActive === isArticleActive) {
    return res.status(400).json({
      message:`Article is already ${isArticleActive ? "active" : "deleted"}`,
    });
  }

  //update status
  article.isArticleActive = isArticleActive;
  let updatedArticle = await article.save();

updatedArticle = await updatedArticle.populate([
  { path: "author", select: "firstName email" },
  { path: "comments.user", select: "firstName email" }
]);
 
  //send res
  res.status(200).json({
    message: `Article ${isArticleActive ? "restored" : "deleted"} successfully`,payload: updatedArticle});
}); 

authorRoute.get('/article/:id',verifyToken("AUTHOR"),async(req,res)=>{
    let articleId=req.params.id
    let article=await ArticleModel.find({_id:articleId})
    .populate("author","firstName email")
   .populate("comments.user","firstName email")
   res.status(200).json({
    message: `Article is`,payload: article});
})