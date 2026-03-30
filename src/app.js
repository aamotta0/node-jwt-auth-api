const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importar rutas
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middlewares globales
app.use(cors()); // Permite peticiones desde otros dominios
app.use(express.json()); // Hace que Express entienda JSON en las peticiones

// Ruta de prueba para verificar que todo funciona
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

// Montamos las rutas
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
module.exports = app;

// Petición HTTP → app.js (middlewares) → productRoutes.js → productController.js → Product.js (modelo) → MongoDB
