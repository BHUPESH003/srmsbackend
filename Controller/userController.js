const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require('../Models/UserModels')
const jwt = require("jsonwebtoken");
require('dotenv').config();

const secret=process.env.ACCESS_TOKEN_SECERT

// Access the secret key from the environment
//@desc get all contacts
//@route GET /api/user/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400);
    throw new Error("All credentials are required");
  }
  const usernameAvailable = await User.findOne({ username });


  if (usernameAvailable) {
    res.status(400);
    throw new Error("Username Already taken");
  }

 
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password: ", hashedPassword);
  const user = await User.create({
    username,
    
    password: hashedPassword,
  });

  console.log(`User created ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id});
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  res.json({ message: "Register the user" });
});
//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const {username,password} = req.body;
  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(401).json('wrong credentials');
  }
  
});
//@desc Login user
//@route POST /api/users/login
//@access private
const currentUser = asyncHandler(async(req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) throw err;
    res.json(info);
  });   
});

const LogoutUser = asyncHandler(async(req,res) => {
  res.cookie('token', '').json('ok');
});

module.exports = { registerUser, loginUser, currentUser,LogoutUser };
