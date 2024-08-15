import experss from "express";
import { getComments, addComment } from "../controllers/comment.js";
const router = experss.Router();
router.get("/", getComments);
router.post("/", addComment);
export default router;
