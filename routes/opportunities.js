import express from "express";
import { getUser } from "../controllers/opportunities.js";

const router = express.Router();

router.get("/find/:userId", getUser);

export default router;
