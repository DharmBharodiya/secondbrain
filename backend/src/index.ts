import express from "express";
import dotenv from "dotenv";
import { router } from "./routes/routes.js";
import cors from "cors";

const JWT_SECRET = "thisisasecret";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/v1", router);

app.listen(8000, () => {
  console.log("Backend started at 8000");
});
