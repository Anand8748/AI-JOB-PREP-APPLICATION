import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { DevDatabase } from "../utils/devDatabase.js";

// Validation schemas
const signupSchema = z.object({
  userName: z.string().trim().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "7d",
  });
};

// Signup controller
export async function signup(req, res) {
  try {
    console.log("Signup request body:", req.body);
    console.log("MongoDB URI:", process.env.MONGODB_URI ? "Set" : "Not set");
    console.log("JWT Secret:", process.env.JWT_SECRET ? "Set" : "Not set");
    
    const { userName, email, password } = signupSchema.parse(req.body);
    console.log("Validated data:", { email, passwordLength: password.length });

    const db = await DevDatabase.getDatabase();
    const users = db.collection("users");
    console.log("Connected to database");

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    console.log("Existing user check:", existingUser ? "User exists" : "User not found");
    
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // Create user
    const result = await users.insertOne({
      userName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });
    console.log("User inserted:", result);

    const userId = result.insertedId.toString();

    // Generate token
    const token = generateToken(userId);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      userId,
      token,
      userName,
    });
  } catch (error) {
    console.error("Signup error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    if (error instanceof z.ZodError) {
      console.error("Zod validation errors:", error.errors);
      return res.status(400).json({ error: error.errors[0].message });
    }
    
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  } finally {
    // Connection is managed by the mongoDB singleton
  }
}

// Login controller
export async function login(req, res) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const db = await DevDatabase.getDatabase();
    const users = db.collection("users");

    // Find user
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const userId = user._id.toString();

    // Generate token
    const token = generateToken(userId);

    res.json({
      success: true,
      message: "Login successful",
      userId,
      token,
      userName: user.userName || null,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Login error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  } finally {
    // Connection is managed by the mongoDB singleton
  }
}

// Verify token controller
export async function verifyToken(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    
    res.json({
      success: true,
      userId: decoded.userId,
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
