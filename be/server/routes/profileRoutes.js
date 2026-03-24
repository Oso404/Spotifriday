import express from "express";
import { getProfile } from "../controllers/profileController.js";

const router = express.Router();

//will be called with /spotify/profile/....
router.get("/", getProfile);



export default router;