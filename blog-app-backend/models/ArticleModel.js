import {Schema,model} from "mongoose";

//create user comment schema
const userCommentSchema= new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    comment:{
        type:String
    }
})

//create article schema
const articleSchema=new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:[true,"Author ID required"]
    },
    title:{
        type:String,
        required:[true,"Title required"]
    },
    category:{
        type:String,
        required:[true,"category required"]
    },
    content:{
        type:String,
        required:[true,"content required"]
    },
    comments:[userCommentSchema],
    isArticleActive:{
        type:Boolean,
        default:true
    }

},{
    strict:"throw",
    timestamps:true,
    versionKey:false
})

export const ArticleModel=model('article',articleSchema)