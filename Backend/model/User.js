import mongoose, { Schema } from "mongoose";

const Userschema=new Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const UserModel=mongoose.model('User',Userschema)
export {UserModel as User}