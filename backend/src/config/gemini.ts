import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview",
});
