import { UserTypeModel } from "../models/UserModel.js";

export const checkAuthor=async(req,res,next)=>{
    //get author by id
    let aId=req.body?.author || req.params?.id;
    //verify author
   
    let author=await UserTypeModel.findById(aId);
    //if author not found
    if(!author ){
        return res.status(401).json({message:"Author not exists"})
    }
    // if author found but role is different
    if(req.user.role  !=='AUTHOR'){
        return res.status(403).json({message:"User is not an author"});
    }
    //if author blocked
    if(!author.isActive){
        return res.status(403).json({message:"User is not Active"});
    }
    next();
};

