const express = require('express');
const { resolve } = require('path');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const User=require('./models/User');
const bodyParser=require("body-parser");

const app = express();
app.use(bodyParser.json());
const port = 3010;

app.use(express.static('static'));

mongoose.connect("mongodb+srv://ayishathnahdas69:Nahda@databaseca1.s55vu.mongodb.net/")
.then(()=>console.log("MongoDb connected"))
.catch(err =>console.error("Mongob failed",err));

//signup
app.post('/signup',async(req,res)=>{
  const {username, email,password}=req.body;

  if(!username || !email || !password){
    return res.status(400).json({message:"all fields r required"});
  }
  try{
    const existingUser=await User.findOne({email});
    if(existingUser){
      return res.status(400).json("user alr exists");

    }

    //hash

    const salt=await bcrypt.genSalt(10);
    const hashedPssword= await bcrypt.hash(password,salt);

    const newuser=new User({username,email,password:hashedPssword});
    await newuser.save();

    res.status(201).json({message:"user registered succesfully"});

  }catch(err){
    res.status(500).json({message:"server error",err:err.message});
    
  }
})

//login

app.post("/login",async(req,res)=>{
  const {email,password}=req.body;

  if(!email || !password){
    return res.status(400).json({message:"feilds r required"});
  }
  try{
    const user=await User.findOne({email});
    if(!User){
      return res.status(400).json({message:"User not found"});
    }

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(400).json({message:"Invalid credentials"});

    }
    res.status(200).json({message:"login successful"});
  }catch(error){
    res.status(500).json({message:"server error",error:error.message});
  }
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
