import express from 'express'
import bcrypt from 'bcrypt'
import { User } from '../model/User.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
const router=express.Router()

router.post('/signup',async(req,res)=>{
    const{username,email,password}=req.body
   const user= await User.findOne({email})
   if(user){
    return res.json({message:"user already exist"})
   }
   const hashpassword=await bcrypt.hash(password,10)
   const newUser= new User({
    username,
    email,
    password:hashpassword,
   })
   await newUser.save()
   console.log("done")
   return res.json({message:" user created"})
})

router.post('/login',async(req,res)=>{
    const{email,password}=req.body
    const user= await User.findOne({email})
    if(!user){
        res.json({message:"user is not register"})
    }
    const validPassword=await bcrypt.compare(password,user.password)
    console.log("password checked")
    if(!validPassword){
        res.send(({message:"password invalid"}))
    }

    // generate tokrn for user if he exist in sign in database
    const token = jwt.sign({username:user.username},process.env.SECRET_KEY,{expiresIn:"1h"})
    console.log(token)
    res.cookie('token',token,{httpOnly:true,maxAge:360000})
    return res.json({status:true,message:"login successfully"})
})



router.post('/forgot-password',async(req,res)=>{
    const {email}=req.body
try{
const user=await User.findOne({email})
if(!user){
    return res.json({message:"user not exist"})
}
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shubham4260shubhu@gmail.com',
      pass: 'shubham4260shubhu@gmail.com'
    }
  });
  
  var mailOptions = {
    from: 'shubham4260shubhu@gmail.com',
    to: email,
    subject: 'Sending Email using Node.js',
    text: `http://localhost:3001/forgotpassword/${token}`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });


}catch(error){
    console.log(error)
}
})


const verifyuser= async(req,res,next)=>{
   try{
    const token = req.cookies.token;
    if(!token){
        return res.json({message:"no token",status:false});
    }
    await jwt.verify(token,process.env.SECRET_KEY)
    next()
}
   catch(error){
  console.log(error)
   }
}

router.get('/verify',verifyuser,(req,res,next)=>{
return res.json({status:true,message:"authorized"})

})


router.get('/logout',(req,res)=>{
    res.clearCookie('token')
    return res.json({status:true})
})

export {router as Userrouter}