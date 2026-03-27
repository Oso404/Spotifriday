import express from "express";
import { getCurrentSong , getNextSong, getPreviousSong} from "../controllers/playerController.js";
const router = express.Router();

router.get("/current", getCurrentSong);
router.get("/next", getNextSong);
router.get("/previous", getPreviousSong);


export default router;