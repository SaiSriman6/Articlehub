import {UserTypeModel} from "../models/UserModel.js"
export const checkAdmin=async(req,res,next)=>{
    //get user by id
    let uId=req.body?.adminId || req.params.id;
    //verify user
    let user=await UserTypeModel.findById(uId);
    //if user not found
    if(!user){
        return res.status(401).json({message:"User not exists"});
    }
    // if user found but role is different
    if(req.user.role !=="ADMIN"){
        return res.status(403).json({message:"User role is not ADMIN"});
    }
    next();
}