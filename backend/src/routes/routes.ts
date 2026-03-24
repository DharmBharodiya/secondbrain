import express from "express";
import type { Response } from "express";
import bcrypt from "bcrypt";
import { ContentModel, LinkModel, UserModel, TagModel } from "../db.js";
import jwt from "jsonwebtoken";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";
import type { CustomRequest } from "../middlewares/AuthMiddleware.js";
import mongoose from "mongoose";
import { generateHash } from "../utils/utils.js";

const JWT_SECRET = "thisisasecret";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await UserModel.create({
    username: username,
    password: hashedPassword,
  });

  res.status(201).json({ message: "Signed Up successfully." });
});

router.post("/signin", async (req, res) => {
  // const JWT_SECRET = process.env.JWT_SECRET_USER;

  // if (!JWT_SECRET) {
  //   return res.status(500).json({ message: "Server configuration error" });
  // }

  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const verifiedUser = await UserModel.findOne({ username: username });

  if (!verifiedUser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const passwordMatch = await bcrypt.compare(password, verifiedUser.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: verifiedUser._id.toString() }, JWT_SECRET);

  res.status(200).json({ message: "Signed In Successfully.", token: token });
});

router.post(
  "/content",
  AuthMiddleware,
  async (req: CustomRequest, res: Response) => {
    const { title, link, type } = req.body;
    const userId = req.id;

    await ContentModel.create({
      title: title,
      link: link,
      type: type,
      userId: new mongoose.Types.ObjectId(userId),
      tags: [],
    });

    res.status(201).json({ message: "Content added." });
  },
);

router.get(
  "/content",
  AuthMiddleware,
  async (req: CustomRequest, res: Response) => {
    const userId = req.id;

    //populate helps you fill in the information, as references were used during schema definition
    const contents = await ContentModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).populate("userId", "username");

    res.json({ contents });
  },
);

router.delete("/content", AuthMiddleware, async (req: CustomRequest, res) => {
  const userId = req.id;
  const contentId = req.body.contentId;

  const deleted = await ContentModel.deleteOne({
    _id: new mongoose.Types.ObjectId(contentId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (deleted.deletedCount > 0) {
    res.json({ message: "Content deleted successfully." });
  } else {
    res.status(404).json({ message: "Content not found." });
  }
});

router.post("/brain/share", AuthMiddleware, async (req: CustomRequest, res) => {
  const userId = req.id;
  const share = req.body.share;

  const hash = generateHash(10);

  const isAlreadySharing = await LinkModel.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (isAlreadySharing) {
    res.json({ message: "/share/" + isAlreadySharing.hash });
    return;
  }

  if (share) {
    await LinkModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      hash: hash,
    });

    res.json({ message: "/share/" + hash });
  } else {
    await LinkModel.deleteOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    res.json({ message: "Link removed." });
  }
});

router.get("/brain/:shareId", async (req, res) => {
  const shareId = req.params.shareId;

  const brain = await LinkModel.findOne({ hash: shareId });

  if (!brain || !brain.userId) {
    return res.status(404).json({ message: "Sorry! No such brains." });
  }

  const content = await ContentModel.find({ userId: brain.userId });

  res.json({ content: content });
});

export { router };
