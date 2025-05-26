import express from "express";
import requireAuth from "../middleware/authMiddleware";
import {
  getProfile,
  updateFavoriteGenres,
} from "../controllers/profileController";

const router = express.Router();

router.get("/", requireAuth, getProfile);
router.patch("/genres", requireAuth, updateFavoriteGenres);

export default router;
