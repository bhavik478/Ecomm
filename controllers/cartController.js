const Cart = require("../models/Cart");

const createCart = async (req, res) => {
  try {
    const cart = new Cart(req.body);
    const savedCart = await cart.save();
    res.status(201).json(savedCart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getCartbyUserID = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      "products.productId"
    );

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: req.body },
      { new: true }
    );
    res.json(updatedCart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: "Cart deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createCart,
  getCartbyUserID,
  updateCart,
  deleteCart,
};
