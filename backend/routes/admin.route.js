import express from "express";
import { DevDatabase } from "../utils/devDatabase.js";

const router = express.Router();

// Debug endpoint to view users
router.get("/users", async (req, res) => {
  try {
    const db = await DevDatabase.getDatabase();
    const users = db.collection("users");
    
    const allUsers = await users.find({}).toArray();
    
    res.json({
      success: true,
      users: allUsers.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;
