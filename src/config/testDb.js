const mongoose = require("mongoose");

// Usar una base de datos diferente para tests
const TEST_DB_URI =
  process.env.MONGODB_URI?.replace("/tienda", "/tienda_test") ||
  "mongodb+srv://tu-usuario:tu-contraseña@cluster0.q7czs06.mongodb.net/tienda_test";

const connectTestDB = async () => {
  try {
    await mongoose.connect(TEST_DB_URI);
    console.log("✅ Test DB conectada");
  } catch (error) {
    console.error("❌ Error conectando Test DB:", error);
  }
};

const disconnectTestDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("✅ Test DB desconectada");
  } catch (error) {
    console.error("❌ Error desconectando Test DB:", error);
  }
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
};

module.exports = { connectTestDB, disconnectTestDB, clearDatabase };
