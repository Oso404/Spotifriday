import express from "express";
import { getCurrentSong , getNextSong} from "../controllers/playerController.js";
const router = express.Router();

router.get("/current", getCurrentSong);
router.get("/next", getNextSong);


export default router;