import express from "express";
import { getStories } from "../controllers/story.js";

const router = express.Router();

router.get("/", getStories);

export default router;
