const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Middleware
const errorHandler = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const combinedSearchRoutes = require("./routes/combinedSearchRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const donorRoutes = require("./routes/donorRoutes");

const app = express();

// --- Middleware ---
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/search", combinedSearchRoutes);
app.use("/api/admin", adminRoutes);   
app.use("/api/users", userRoutes);
app.use("/api/donors", donorRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Catch-all 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler (should always be last)
app.use(errorHandler);

// --- DB Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

mongoose.connection.once("open", () =>
  console.log("Connected to DB:", mongoose.connection.name)
);

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
