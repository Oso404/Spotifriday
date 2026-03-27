import express from "express";
import { getTimeStamp } from "../controllers/timestampController.js";
const router = express.Router();

router.get("/", getTimeStamp);


export default router;