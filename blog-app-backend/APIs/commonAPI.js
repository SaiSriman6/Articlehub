import exp from 'express';
import {authenticate,register} from '../services/authServices.js'
import {UserTypeModel} from "../models/UserModel.js"
import bcrypt from 'bcryptjs';
import { verifyToken } from '../middleWares/verifyToken.js';
export const commonRouter=exp.Router();

//login
commonRouter.post('/login',async(req,res)=>{
 //get userCred from req
 let userCred=req.body;
 //call authenticate service
 let {token,userObj}= await authenticate(userCred);
 //save token as httpOnly cookie
 res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  domain: ".onrender.com",
  maxAge: 60 * 60 * 1000
});
 res.status(200).json({message:"login success",payload:userObj});
})

//logout
commonRouter.get('/logout',async(req,res)=>{
  //clear the cookie named token
  res.clearCookie('token',{
  httpOnly:true,
  secure:true,
  sameSite:'none'
})
  res.status(200).json({messaage:"logged out successfully"})
})

//password changing
commonRouter.put('/change-password',verifyToken,async(req,res)=>{
    //get old password and new password from req
    let { email,currentPassword,newPassword } =req.body;
    //get user
    let user=await UserTypeModel.findOne({email});
    //compare old password is correct or not
    let isMatch= await bcrypt.compare(currentPassword,user.password);
    
    if(!isMatch){
        return res.status(401).json({message:"Invalid password"})
    }
    //replace current with new password
    user.password=newPassword;
    await user.validate();
    //hash password and replace
    user.password=await bcrypt.hash(user.password,10);
    await user.save();
    //send response
    res.status(200).json({message:"password Updated"})

})

commonRouter.get("/check-auth",verifyToken("USER","AUTHOR","ADMIN"),(req,res)=>{
  res.status(200).json({message:"authenticated",payload:req.user})
})