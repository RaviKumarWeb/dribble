import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  profileOptions: {
    type: String,
    // enum: ["designer", "hireDesigner", "inspiration"],
  },
  avatar: {
    type: String,
  },
  profileBackgroundColor: {
    type: String,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("Username already taken. Please try another."));
  } else {
    next(error);
  }
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
