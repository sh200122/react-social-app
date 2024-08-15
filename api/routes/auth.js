import experss from "express";
import { login, register, logout } from "../controllers/auth.js";

const router = experss.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
