import express from "express";
import type { Response } from "express";
import bcrypt from "bcrypt";
import { ContentModel, LinkModel, UserModel, TagModel } from "../db.js";
import jwt from "jsonwebtoken";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";
import type { CustomRequest } from "../middlewares/AuthMiddleware.js";
import mongoose from "mongoose";
import { generateHash } from "../utils/utils.js";
import * as z from "zod";

const JWT_SECRET = process.env.JWT_SECRET_USER || "thisisactuallyasecret";

const router = express.Router();

// Zod schemas
const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = authSchema.parse(req.body);

    const userAlreadyExists = await UserModel.findOne({ username });

    if (userAlreadyExists) {
      return res.status(400).json({ message: "The user already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      username: username,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Signed Up successfully." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error });
    }
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/signin", async (req, res) => {
  // const JWT_SECRET = process.env.JWT_SECRET_USER;

  // if (!JWT_SECRET) {
  //   return res.status(500).json({ message: "Server configuration error" });
  // }
  try {
    const { username, password } = authSchema.parse(req.body);

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
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ errors: e.issues });
    }
    res.status(500).json({ message: "Server error" });
  }
});

const contentSchema = z.object({
  title: z
    .string()
    .min(3, "Please give proper title.")
    .max(18, "Title is too long."),
  link: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .pipe(z.string().url().optional()),
  type: z.string(),
  notes: z.string().optional(),
  tags: z.array(z.string()),
});

router.post(
  "/content",
  AuthMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const { title, link, type, notes, tags } = contentSchema.parse(req.body);
      const userId = req.id;

      let tagIds: mongoose.Types.ObjectId[] = [];

      for (let tagname of tags) {
        let tag = await TagModel.findOne({ title: tagname });

        if (!tag) {
          tag = await TagModel.create({
            title: tagname,
          });
        }

        tagIds.push(tag._id);
      }

      await ContentModel.create({
        title: title,
        link: link || null,
        type: type,
        notes: notes || null,
        userId: new mongoose.Types.ObjectId(userId),
        tags: tagIds || [],
      });

      res.status(201).json({ message: "Content added." });
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.issues });
      }
      res.status(500).json({ message: "Server error" });
    }
  },
);

router.get("/user", AuthMiddleware, async (req: CustomRequest, res) => {
  const userId = req.id;

  const userInfo = await UserModel.findOne({ _id: userId });

  return res.status(200).json({ user: userInfo });
});

router.get(
  "/content",
  AuthMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.id;

      //populate helps you fill in the information, as references were used during schema definition
      const contents = await ContentModel.find({
        userId: new mongoose.Types.ObjectId(userId),
      })
        .populate("userId", "username")
        .populate("tags", "title");

      res.json({ contents });
    } catch (e) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

router.delete(
  "/content/:contentId",
  AuthMiddleware,
  async (req: CustomRequest, res) => {
    try {
      const userId = req.id;
      const contentId = req.params.contentId as string;

      const deleted = await ContentModel.deleteOne({
        _id: new mongoose.Types.ObjectId(contentId),
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (deleted.deletedCount > 0) {
        res.json({ message: "Content deleted successfully." });
      } else {
        res.status(404).json({ message: "Content not found." });
      }
    } catch (e) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

const contentUpdateSchema = z.object({
  title: z.string().min(3, "Please give proper title.").optional(),
  link: z.url().optional(),
  type: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

router.put(
  "/content/:contentId",
  AuthMiddleware,
  async (req: CustomRequest, res) => {
    try {
      const userId = req.id;
      const contentId = req.params.contentId as string;

      const { title, link, tags, type, notes } = contentUpdateSchema.parse(
        req.body,
      );

      let tagIds: mongoose.Types.ObjectId[] = [];
      if (tags) {
        for (let tagname of tags) {
          let tag = await TagModel.findOne({ title: tagname });

          if (!tag) {
            tag = await TagModel.create({ title: tagname });
          }

          tagIds.push(tag._id);
        }
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (type !== undefined) updateData.type = type;
      if (link !== undefined) updateData.link = link;
      if (tags !== undefined) updateData.tags = tagIds;
      if (notes !== undefined) updateData.notes = notes;

      const result = await ContentModel.updateOne(
        {
          _id: new mongoose.Types.ObjectId(contentId),
          userId: new mongoose.Types.ObjectId(userId),
        },
        {
          $set: updateData,
        },
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Content not found." });
      }

      res.json({ message: "Content updated successfully." });
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ errors: e.issues });
      }
      res.status(500).json({ message: "Server error" });
    }
  },
);

const shareSchema = z.boolean();

router.post("/brain/share", AuthMiddleware, async (req: CustomRequest, res) => {
  try {
    const userId = req.id;
    const share = shareSchema.parse(req.body.share);

    if (share) {
      const isAlreadySharing = await LinkModel.findOne({
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (isAlreadySharing) {
        res.json({ message: "/brain/" + isAlreadySharing.hash });
        return;
      }

      const hash = generateHash(10);
      await LinkModel.create({
        userId: new mongoose.Types.ObjectId(userId),
        hash: hash,
      });

      res.json({ message: "/brain/" + hash });
    } else {
      await LinkModel.deleteOne({
        userId: new mongoose.Types.ObjectId(userId),
      });

      res.json({ message: "Link removed." });
    }
  } catch (e) {
    if (e instanceof z.ZodError) {
      return res.status(400).json({ errors: e.issues });
    }
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/brain/:shareId", async (req, res) => {
  try {
    const shareId = req.params.shareId;

    const brain = await LinkModel.findOne({ hash: shareId });

    if (!brain || !brain.userId) {
      return res.status(404).json({ message: "Sorry! No such brains." });
    }

    const content = await ContentModel.find({ userId: brain.userId });

    res.json({ content: content });
  } catch (e) {
    console.log("Error: " + e);
  }
});

//search route
router.get(
  "/content/search/:querySearch",
  AuthMiddleware,
  async (req: CustomRequest, res) => {
    try {
      const userId = req.id;
      const querySearch = req.params.querySearch as string;

      if (!querySearch) {
        return res.json({ message: "Please enter something to be searched." });
      }

      const results = await ContentModel.find({
        userId: new mongoose.Types.ObjectId(userId),
        title: { $regex: querySearch, $options: "i" },
      }).limit(20);

      res.json({ searchResults: results });
    } catch (e) {
      console.log("Error: " + e);
    }
  },
);

export { router };
