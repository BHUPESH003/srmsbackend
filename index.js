const express = require("express");
const dotenv = require("dotenv").config();
const ErrorHandler = require("./MiddleWare/ErrorHandler");
const cors = require("cors"); // Import the cors middleware
const connectDb = require("./dbConnect");
const app = express();
const cookieParser = require("cookie-parser");
const ContactModel = require("./Models/FormModel");

connectDb();

const port = process.env.PORT || 5000;

// Use the cors middleware to enable CORS for all routes
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.get("/", (req, res) => {
  res
    .status(201)
    .json(`Hey There ! 😊😊.This is a HomePage and also a default Route.❤️`);
});
app.post("/submit-form",async (req, res) => {
  const { name, email, phone, query } = req.body;

  // Create a new document using the ContactForm model
  const postDoc = await ContactModel.create({
    name,
    email,
    phone,
    query,
  });
  res.json(postDoc);
});

app.use("/user", require("./routes/userRoutes"));
app.use("/blog", require("./routes/BlogRoutes"));

app.use(ErrorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
