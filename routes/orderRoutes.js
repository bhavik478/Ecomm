const express = require("express");
const router = express.Router();
const {
  getAllOrdersByUserId,
  createOrder,
  createOrderByCartId,
  getOrderById,
  deleteOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

router.post("/orders", createOrder);
router.post("/orders/cart/:cartId", createOrderByCartId);
router.get("/orders/:userId", getAllOrdersByUserId);
router.put("/orders/:id", updateOrderStatus);
router.get("/orders/single/:id", getOrderById);
router.delete("/orders/:id", deleteOrder);

module.exports = router;
