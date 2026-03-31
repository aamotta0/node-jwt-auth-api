const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// Rutas públicas (cualquiera puede ver productos)
router.get("/", getProducts);
router.get("/:id", getProductById);

// Rutas protegidas (solo usuarios autenticados pueden modificar)
// authorize('admin') asegura que solo administradores puedan hacer estas acciones
router.post("/", protect, authorize("admin"), createProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

module.exports = router;
