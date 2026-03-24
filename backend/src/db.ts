import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => console.log("Database connected."))
  .catch((err) => console.log("Error in DB: " + err));

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const TagSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
});

const LinkSchema = new Schema({
  hash: {
    type: String,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    unique: true,
  },
});

const ContentSchema = new Schema({
  link: String,
  type: String,
  title: String,
  notes: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tags" }],
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = model("Users", UserSchema);
const TagModel = model("Tags", TagSchema);
const LinkModel = model("Links", LinkSchema);
const ContentModel = model("Content", ContentSchema);

export { UserModel, ContentModel, LinkModel, TagModel };
