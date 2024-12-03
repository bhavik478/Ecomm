const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const { userId, products } = req.body;

    // Fetch prices from Product schema and calculate total
    let totalPrice = 0;
    const enrichedProducts = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product)
          throw new Error(`Product with ID ${item.productId} not found`);
        totalPrice += product.price * item.quantity; // Assuming Product schema has a `price` field
        return {
          productId: item.productId,
          quantity: item.quantity,
          productTotal: product.price * item.quantity,
        };
      })
    );

    // Create order
    const order = new Order({
      userId,
      products: enrichedProducts,
      totalPrice,
      status: "Pending", // Default status
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createOrderByCartId = async (req, res) => {
  try {
    const { cartId } = req.params;
    console.log({ cartId });
    // Fetch the cart by its ID and populate product details
    const cart = await Cart.findById(cartId).populate("products.productId");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Calculate total price from cart products
    let totalPrice = 0;
    const orderProducts = cart.products.map((item) => {
      const productPrice = item.productId.price; // Assume `price` exists in the Product schema
      totalPrice += productPrice * item.quantity;

      return {
        productId: item.productId._id,
        quantity: item.quantity,
        productTotal: productPrice * item.quantity, // Price at the time of order creation
      };
    });

    console.log({
      userId: cart.userId,
      products: orderProducts,
      totalPrice,
      status: "Pending", // Default status
    });

    // Create a new order
    const order = new Order({
      userId: cart.userId,
      products: orderProducts,
      totalPrice,
      status: "Pending", // Default status
    });

    const savedOrder = await order.save();

    // Optionally, you can clear the cart after order creation
    await Cart.findByIdAndDelete(cartId);

    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate(
      "products.productId"
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "products.productId"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "order not found" });
    }
    res.status(200).json({ message: "order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUserId,
  createOrderByCartId,
  updateOrderStatus,
  getOrderById,
  deleteOrder,
};
