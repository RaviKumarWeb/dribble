import express from "express";
import {
  signup,
  signin,
  createProfile,
  addProfileOptions,
  resendVerificationEmail,
  getUserById,
} from "../controllers/userCtrl.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.get("/", authMiddleware, getUserById);
router.post("/create-profile", authMiddleware, createProfile);

router.post("/profile-options", authMiddleware, addProfileOptions);

router.post(
  "/resend-verification-email",
  authMiddleware,
  resendVerificationEmail
);

export default router;
