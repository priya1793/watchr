import express from "express";
import {
  getWatchlist,
  addToWatchlist,
  updateWatchedItem,
  removeFromWatchlist,
} from "../controllers/watchlistController";
import requireAuth from "../middleware/authMiddleware";

const router = express.Router();

router.use(requireAuth);

router.get("/", getWatchlist);
router.post("/", addToWatchlist);
router.put("/:movieId", updateWatchedItem);
router.delete("/:movieId", removeFromWatchlist);

export default router;
