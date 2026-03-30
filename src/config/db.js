const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB conectado correctamente");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

/**
 * ¿Qué hace esto?
 * Usa mongoose.connect() con la URI que guardamos en .env
 * Si funciona, muestra un mensaje de éxito
 * Si falla, muestra el error y detiene el proceso
 */
