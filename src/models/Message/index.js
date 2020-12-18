const mongoose = require("mongoose");

const MessageModel = mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  create: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Message", MessageModel);
