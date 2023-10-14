const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please choose a appropriate username"],
  },
  password: {
    type: String,
    required: [true, "Please add the Password"],
  },
},{
    timestamps:true,
});


module.exports=mongoose.model("User",userSchema);
