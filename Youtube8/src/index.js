// index.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import mongoose from "mongoose";

dotenv.config({ path: "./env" });

const app = express();
app.use(express.json()); // to parse JSON body

// Connect DB
connectDB();

// ✅ Example Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const User = mongoose.model("User", UserSchema);

// ✅ Test POST request
app.post("/test", async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = new User({ name, email });
    await newUser.save();
    res.status(201).json({ message: "Data saved!", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
