import express from "express";
import type { Response } from "express";
import bcrypt from "bcrypt";
import {
  ContentModel,
  LinkModel,
  UserModel,
  TagModel,
  StarModel,
} from "../db.js";
import jwt from "jsonwebtoken";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";
import type { CustomRequest } from "../middlewares/AuthMiddleware.js";
import mongoose from "mongoose";
import { generateHash } from "../utils/utils.js";
import * as z from "zod";
import upload from "../middlewares/UploadFile.js";
import { UploadFile } from "../utils/UploadFile.js";
import bodyParser from "body-parser";
import { model } from "../config/gemini.js";

const JWT_SECRET = process.env.JWT_SECRET_USER || "thisisactuallyasecret";

const router = express.Router();

// Zod schemas
const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  sharedQuote: z.string(),
});

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password, sharedQuote } = authSchema.parse(req.body);

    const userAlreadyExists = await UserModel.findOne({ username });

    if (userAlreadyExists) {
      return res.status(400).json({ message: "The user already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      username: username,
      password: hashedPassword,
      sharedQuote,
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
    const { username, password } = loginSchema.parse(req.body);

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
  title: z.string().min(3, "Please give proper title."),
  link: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .pipe(z.string().url().optional()),
  type: z.string(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string(),
});

router.put("/user", AuthMiddleware, async (req: CustomRequest, res) => {
  const userId = req.id;
  const username = req.body.username;

  const result = await UserModel.updateOne(
    { _id: new mongoose.Types.ObjectId(userId) },
    {
      username: username,
    },
  );

  res.status(200).json({ message: "Username updated." });
});

router.post(
  "/content",
  AuthMiddleware,
  upload.single("file"),
  async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.id;
      const file = req.file; // the req.file here is populated my multer
      let fileUrl = null;
      if (file) {
        const fileUploadRes: any = await UploadFile(file.buffer);
        fileUrl = fileUploadRes.secure_url;
      }

      // const { title, link, type, notes, tags } = contentSchema.parse({
      //   ...req.body,
      //   imageUrl: fileUrl || "",
      // });

      const { title, link, type, notes, tags, sharing } = req.body;

      let tagIds: mongoose.Types.ObjectId[] = [];

      // Handle tags - convert to array if it's a string
      let tagsArray = tags;
      if (typeof tags === "string") {
        tagsArray = tags
          .split(",")
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag !== "");
      } else if (!Array.isArray(tags)) {
        tagsArray = [];
      }

      if (tagsArray && tagsArray.length > 0) {
        for (let tagname of tagsArray) {
          let tag = await TagModel.findOne({ title: tagname });

          if (!tag) {
            tag = await TagModel.create({
              title: tagname,
            });
          }

          tagIds.push(tag._id);
        }
      }

      await ContentModel.create({
        title: title,
        link: link || null,
        type: type,
        notes: notes || null,
        userId: new mongoose.Types.ObjectId(userId),
        tags: tagIds || [],
        imageUrl: fileUrl || "",
        sharing: sharing,
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

router.post(
  "/star/:contentId",
  AuthMiddleware,
  async (req: CustomRequest, res) => {
    const userId = req.id;
    const contentId = req.params.contentId as string;

    const alreadyStarred = await StarModel.findOne({
      contentId: new mongoose.Types.ObjectId(contentId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (alreadyStarred) {
      await StarModel.deleteOne({
        userId: new mongoose.Types.ObjectId(userId),
        contentId: new mongoose.Types.ObjectId(contentId),
      });
      return res.status(200).send({ message: "Removed from starred" });
    } else {
      await StarModel.create({
        contentId: new mongoose.Types.ObjectId(contentId),
        userId: new mongoose.Types.ObjectId(userId),
      });
      res.status(200).send({ message: "Starred." });
    }
  },
);

router.get("/star", AuthMiddleware, async (req: CustomRequest, res) => {
  const userId = req.id;

  const starredPosts = await StarModel.find({
    userId: new mongoose.Types.ObjectId(userId),
  }).populate("contentId");

  res.json({ starredPosts });
});

router.get("/user", AuthMiddleware, async (req: CustomRequest, res) => {
  const userId = req.id;

  const userInfo = await UserModel.findOne({
    _id: new mongoose.Types.ObjectId(userId),
  });

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
        res.json({
          message: "/brain/" + isAlreadySharing.hash,
        });
        return;
      }

      const hash = generateHash(10);
      const newBrain = await LinkModel.create({
        userId: new mongoose.Types.ObjectId(userId),
        hash: hash,
      });

      res.json({
        message: "/brain/" + hash,
      });
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

    const content = await ContentModel.find({
      userId: brain.userId,
      sharing: "public",
    });

    const shareQuote = await UserModel.findOne({
      _id: brain.userId,
    });

    res.json({ content: content, shareQuote });
  } catch (e) {
    console.log("Error: " + e);
  }
});

router.post(
  "/brain/make-public/",
  AuthMiddleware,
  async (req: CustomRequest, res) => {
    try {
      const userId = req.id;
      const contentId = req.body.contentId as string;

      const findContent = await ContentModel.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        _id: new mongoose.Types.ObjectId(contentId),
      });

      if (!findContent) {
        return res.status(404).json({ message: "Content not found." });
      }

      const sharing = findContent.sharing;
      const setSharing = sharing === "public" ? "private" : "public";

      await ContentModel.updateOne(
        {
          userId: new mongoose.Types.ObjectId(userId),
          _id: new mongoose.Types.ObjectId(contentId),
        },
        {
          $set: {
            sharing: setSharing,
          },
        },
      );

      res.json({
        message: setSharing === "public" ? "public" : "private",
      });
    } catch (e) {
      res.status(500).json({ message: "Server error" });
    }
  },
);

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

router.get("/chat", async (req: CustomRequest, res) => {
  try {
    const result = await model.generateContent("explain react in simple terms");
    const response = await result.response;

    res.json({
      answer: response.text(),
    });
  } catch (e) {
    console.log("chat error: ", e);
    res.json({ message: "cannot find answer" });
  }
});

router.post("/chat-ai", AuthMiddleware, async (req: CustomRequest, res) => {
  const userId = req.id;
  try {
    const { question } = req.body;

    const userContent = await ContentModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).populate("tags", "title");

    const words = question.toLowerCase().split(" ");

    // Filter out common stop words
    const stopWords = new Set([
      "what",
      "is",
      "the",
      "that",
      "i",
      "a",
      "an",
      "and",
      "or",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "this",
      "you",
      "me",
      "my",
      "they",
    ]);
    const meaningfulWords = words.filter(
      (word: string) => !stopWords.has(word) && word.length > 2,
    );

    const relevantContent = userContent
      .map((item) => {
        const tagTitles = (item.tags as any[])
          .map((tag: any) => tag.title)
          .join(" ");
        const text =
          `${item.title} ${item.notes} ${item.link} ${item.type} ${tagTitles}`.toLowerCase();

        // Count how many meaningful words match
        const matchCount = meaningfulWords.filter((word: string) =>
          text.includes(word),
        ).length;

        return { item, matchCount };
      })
      .filter(({ matchCount }) => matchCount > 0) //keep only items with at least 1 match
      .sort((a, b) => b.matchCount - a.matchCount) //rank them, arrange by highest score to lowest score
      .map(({ item }) => item); //and extracct just the items, no matchcount

    const topContent = relevantContent.slice(0, 5);

    if (topContent.length === 0) {
      return res.json({
        answer: "I couldn't find anything relevant in your saved content.",
      });
    }

    const prompt = `
You are a friendly and intelligent assistant chatting with a user about their saved content.

Your tone should be:
- Conversational and natural (like ChatGPT)
- Helpful and slightly engaging
- Not robotic or overly formal

User Question:
${question}

Here is the user's saved content:
${topContent
  .map(
    (c, i) => `
${i + 1}.
Title: ${c.title}
Notes: ${c.notes}
Link: ${c.link}
Type: ${c.type}
Tags: ${(c.tags as any[]).map((tag: any) => tag.title).join(", ") || "No tags"}
`,
  )
  .join("\n")}

Instructions:
- Answer like you're having a conversation with the user
- Use a friendly tone (e.g., "Looks like you saved...", "You have a few things about...")
- ONLY use the provided content to answer
- If multiple items match, naturally summarize them
- If nothing is clearly relevant, say:
  "Hmm, I couldn't find anything relevant in your saved content."
- Keep the answer concise but human-like
- Answer in a conversational tone
- Use proper markdown formatting (bold, lists, paragraphs)
- Do NOT use quotes inside bold text
- Example: **The pink beach:** instead of **"The pink beach":**
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    // 7. Send response
    res.json({ answer });
  } catch (e: any) {
    console.error("Chat error:", e);

    // Handle service unavailability
    if (e.status === 503) {
      return res.status(503).json({
        error: "AI service is currently busy. Please try again in a moment.",
      });
    }

    res.status(500).json({ error: "Something went wrong" });
  }
});

export { router };
