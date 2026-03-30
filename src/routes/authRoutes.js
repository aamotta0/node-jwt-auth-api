const express = require("express");
const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Rutas públicas
router.post("/register", register);
router.post("/login", login);

// Rutas protegidas (requieren token)
router.get("/profile", protect, getProfile);

module.exports = router;
