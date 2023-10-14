const express = require("express");
const userController = require("../Controller/userController");
const route = express.Router();

route.post("/register",userController.registerUser );
route.post("/login", userController.loginUser);
route.get("/profile",userController.currentUser);
route.post("/logout",userController.LogoutUser);





module.exports = route;
