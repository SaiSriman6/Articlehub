import jwt from "jsonwebtoken";
import {config} from "dotenv";
config();

export const verifyToken=(...allowedRoles)=>{
    return async(req,res,next)=>{
    try{
    //read token from req
    console.log("cookies:", req.cookies);
    let token=req.cookies.token;
    if(token===undefined){
        return res.status(400).json({message:"Unauthorized req.Please Login"});
    }
    //verify the validity of the token(decoding the token)
    let decodedToken=jwt.verify(token,process.env.JWT_SECRET);

    
    if(!allowedRoles.includes(decodedToken.role)){
        return res.status(403).json({message:"Forbidden.You don't have access"})
    }
    
    req.user=decodedToken; 
    //forward req to next middlewaare/route
    next();
    }catch(err){
       if(err.name==='TokenExpiredError'){
        return res.status(401).json({message:"Session expired"})
       }
      if(err.name==='JsonWebTokenError'){
        return res.status(401).json({message:"Invalid Token.Please login again"})
      }
}

}
}