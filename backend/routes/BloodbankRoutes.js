const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const adminMiddleware = require("../middleware/adminMiddleware");

const FILE_PATH = path.join(__dirname, "../data/bloodbanks.json");

// Get all bloodbanks
router.get("/manage-bloodbanks", adminMiddleware, (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  res.json(data);
});

// Add a bloodbank
router.post("/manage-bloodbanks", adminMiddleware, (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  const newBloodbank = {
    id: data.length ? data[data.length - 1].id + 1 : 1,
    ...req.body,
  };
  data.push(newBloodbank);
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  res.json(newBloodbank);
});

// Delete a bloodbank
router.delete("/manage-bloodbanks/:id", adminMiddleware, (req, res) => {
  let data = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  const id = parseInt(req.params.id);
  data = data.filter((b) => b.id !== id);
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  res.json({ message: "Deleted successfully" });
});

module.exports = router;
