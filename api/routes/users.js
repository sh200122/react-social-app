import express from "express";
import { getUser, updateUser } from "../controllers/user.js";
const router = express();
router.get("/find/:userId", getUser);
router.put("/", updateUser);
export default router;
