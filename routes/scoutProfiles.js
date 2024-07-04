import express from "express";
import { getUser } from "../controllers/scoutProfiles.js";

const router = express.Router();

router.get("/find/:userId", getUser);

export default router;
