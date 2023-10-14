const expressAsyncHandler = require("express-async-handler");
const fs = require("fs");
const PostModel = require('../Models/PostModels')
const jwt = require("jsonwebtoken");

const postBlog = expressAsyncHandler(async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await PostModel.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});



const updateBlog = expressAsyncHandler(async (req,res) => {
  let newPath = null;
  if (req.file) {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  }

  const {token} = req.cookies;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, {}, async (err,info) => {
    if (err) throw err;
    const {id,title,summary,content} = req.body;
    const postDoc = await PostModel.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('you are not the author');
    }
    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    postDoc.cover = newPath ? newPath : postDoc.cover;

    await postDoc.save();

    res.json(postDoc);
  });


});

const getBlogs = expressAsyncHandler(async (req, res) => {
  res.json(
    await PostModel.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});


const getBlogbyId = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const postDoc = await PostModel.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

const deleteBlogById = expressAsyncHandler(async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findByIdAndRemove(postId);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = {
  postBlog,
  updateBlog,
  getBlogs,
  getBlogbyId,
  deleteBlogById,
};
