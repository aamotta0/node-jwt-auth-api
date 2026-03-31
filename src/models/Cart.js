const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "El producto es obligatorio"],
  },
  quantity: {
    type: Number,
    required: [true, "La cantidad es obligatoria"],
    min: [1, "La cantidad debe ser al menos 1"],
    default: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario es obligatorio"],
      unique: true, // Un usuario tiene UN SOLO carrito
    },
    items: [cartItemSchema],
    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Método para calcular el total del carrito
cartSchema.methods.calculateTotal = async function () {
  // Populate para obtener los precios de los productos
  await this.populate("items.product");

  let total = 0;
  for (const item of this.items) {
    total += item.product.price * item.quantity;
  }

  this.total = total;
  return total;
};

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
