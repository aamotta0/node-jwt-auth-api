const mongoose = require("mongoose");

// Definimos el esquema (la estructura)
const productSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      enum: {
        values: ["ropa", "tecnologia", "hogar", "libros"],
        message: "{VALUE} no es una categoría válida",
      },
      trim: true,
    },
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true, // Elimina espacios al inicio y final
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
      validate: {
        validator: function (v) {
          // Los precios en ecommerce real se manejan en centavos (enteros)
          return Number.isInteger(v);
        },
        message: "El precio debe ser un número entero (centavos)",
      },
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"],
      default: 0,
    },
    description: {
      type: String,
      maxlength: [500, "La descripción no puede exceder 500 caracteres"],
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Agrega automáticamente createdAt y updatedAt
  },
);

// Creamos el modelo (Mongoose lo usará para interactuar con la colección "products")
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
