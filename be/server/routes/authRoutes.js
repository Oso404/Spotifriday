import express from "express";
import { login, callback, refreshToken } from "../controllers/authController.js";

const router = express.Router();

router.get("/login", login); //called by button in fe to start auth flow 
router.get("/callback", callback); //called by spotify after user gives us permission 
router.post("/refresh", refreshToken); //i have a button thatll trigger this (will have this when we have to refresh via api calls )

export default router;