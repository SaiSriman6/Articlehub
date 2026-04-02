import {UserTypeModel} from "../models/UserModel.js"
export const CheckUser=async(req,res,next)=>{
    //get user by id
    let uId=req.body?.userId || req.params.id;
    //verify user
    let user=await UserTypeModel.findById(uId);
    //if user not found
    if(!user){
        return res.status(401).json({message:"User not exists"});
    }
    // if user found but role is different
    if(req.user.role !=="USER"){
        return res.status(403).json({message:"User role is not USER"});
    }
    //if user blocked
    if(!user.isActive){
        return res.status(403).json({message:"User is not active"});
    }
    next();
}