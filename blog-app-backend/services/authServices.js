 import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import { UserTypeModel }  from '../models/UserModel.js';
import {config} from 'dotenv'

config();
//register function
export const register= async (userObj) => {
 //create document
 const userDoc= new UserTypeModel(userObj);
 //validate for empty passwords
 await userDoc.validate();
 //hash and replace with plain password
 userDoc.password= await bcrypt.hash(userDoc.password,10);
 //save
 const created= await userDoc.save();
 //convert document to object to remove password
 const newUserObj=created.toObject();
 //remove password 
 delete newUserObj.password;
 //return user Obj without password
 return newUserObj;
};

//authenticate function
export const authenticate=async({email,password})=>{
 //check user wih email
 const user=await UserTypeModel.findOne({email});
 if(!user){
    const err= new Error("Invalid email");
    err.status=401;
    throw err;
 }
 // compare passwords
 const isMatch = await bcrypt.compare(password,user.password);
 if(!isMatch){
    const err=new Error("Invalid password");
    err.status=401;
    throw err;
 }
 // if user blocked
 if(!user.isActive){
   const err=new Error(`${user.firstName} blocked by admin`);
   err.status=403;
   throw err;
 }

 //generate token
 const token = jwt.sign({ _id: user._id, role:user.role ,email:user.email , firstName:user.firstName , profileImageUrl: user.profileImageUrl},process.env.JWT_SECRET,{expiresIn:'1h'});

 // create object for response and delete password
 const userObj = user.toObject();
 delete userObj.password;

 return {token,userObj}

}