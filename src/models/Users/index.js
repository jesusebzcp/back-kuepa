const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: { type: String, required: true, trim: true, unique: true },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  create: {
    type: Date,
    default: Date.now(),
  },
  moderator: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Users", UserSchema);
