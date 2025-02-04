import { Request, Response } from "express";
import { getUserTestAttempts } from "../models/firstTimeUserModel";

export const getTestAttempts = async (req: Request, res: Response) => {
  const userId = parseInt(req.query.userId as string, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ success: false, message: "Invalid or missing User ID" });
  }

  try {
    const attempts = await getUserTestAttempts(userId);

    if (!attempts || attempts.length === 0) {
      return res.status(404).json({ success: true, message: "No test attempts found", data: [] });
    }

    res.json({ success: true, data: attempts });
  } catch (error) {
    console.error("Error fetching test attempts:", error);
    res.status(500).json({ success: false, message: "Something went wrong, please try again" });
  }
};
