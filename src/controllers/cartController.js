const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Obtener el carrito del usuario autenticado
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
    );

    if (!cart) {
      // Si no tiene carrito, crear uno vacío
      cart = await Cart.create({
        user: req.user.id,
        items: [],
        total: 0,
      });
    }

    await cart.calculateTotal();
    await cart.save();

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener carrito",
      error: error.message,
    });
  }
};

// Agregar producto al carrito
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Verificar que el producto existe y está activo
    const product = await Product.findOne({ _id: productId, active: true });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado o no disponible",
      });
    }

    // Verificar stock (simplificado por ahora)
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Stock insuficiente. Disponible: ${product.stock}`,
      });
    }

    // Buscar o crear carrito del usuario
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [],
        total: 0,
      });
    }

    // Verificar si el producto ya está en el carrito
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      // Si ya existe, actualizar cantidad
      existingItem.quantity += quantity;
    } else {
      // Si no existe, agregar nuevo item
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    // Recalcular total
    await cart.calculateTotal();
    await cart.save();

    // Populate para respuesta detallada
    await cart.populate("items.product");

    res.json({
      success: true,
      message: "Producto agregado al carrito",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al agregar al carrito",
      error: error.message,
    });
  }
};

// Eliminar producto del carrito
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Carrito no encontrado",
      });
    }

    // Filtrar para eliminar el producto
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    // Recalcular total
    await cart.calculateTotal();
    await cart.save();

    await cart.populate("items.product");

    res.json({
      success: true,
      message: "Producto eliminado del carrito",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar del carrito",
      error: error.message,
    });
  }
};

// Vaciar carrito completo
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Carrito no encontrado",
      });
    }

    cart.items = [];
    cart.total = 0;
    await cart.save();

    res.json({
      success: true,
      message: "Carrito vaciado correctamente",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al vaciar carrito",
      error: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};
