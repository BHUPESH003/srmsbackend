const express = require("express");
const { getBlogbyId } = require("../Controller/PostController");
const { getBlogs } = require("../Controller/PostController");
const { updateBlog } = require("../Controller/PostController");
const { postBlog } = require("../Controller/PostController");
const { deleteBlogById } = require("../Controller/PostController");

const multer=require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });

const route = express.Router();

route.post('/post', uploadMiddleware.single('file'), postBlog);
route.get('/post', uploadMiddleware.single('file'), getBlogs);
route.get('/post/:id', uploadMiddleware.single('file'), getBlogbyId);
route.delete('/post/:id', uploadMiddleware.single('file'), deleteBlogById);

route.put('/post',uploadMiddleware.single('file'), updateBlog);





module.exports = route;
