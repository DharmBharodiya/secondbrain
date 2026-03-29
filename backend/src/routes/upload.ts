import express, { type Request, type Response } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Extend Request type to include file
interface MulterRequest extends Request {
  file: Express.Multer.File;
}

router.post(
  "/",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const fileReq = req as MulterRequest;

      if (!fileReq.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const result = await cloudinary.uploader.upload(fileReq.file.path);

      // delete local file
      fs.unlinkSync(fileReq.file.path);

      res.json({
        imageUrl: result.secure_url,
      });
    } catch (err) {
      res.status(500).json({ error: "Upload failed" });
    }
  },
);

export default router;
