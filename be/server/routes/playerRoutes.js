import express from "express";
import { getCurrentSong } from "../controllers/playerController.js";
const router = express.Router();

router.get("/current", getCurrentSong);

export default router;