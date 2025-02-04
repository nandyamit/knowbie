import express from "express";
import { getTestAttempts } from "../controllers/testAttemptController";

const router = express.Router();

router.get("/test-attempts", getTestAttempts);

export default router;
