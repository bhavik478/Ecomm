const express = require("express");
const {
  createCart,
  updateCart,
  getCartbyUserID,
  deleteCart,
} = require("../controllers/cartController");

const router = express.Router();

router.post("/cart", createCart);
router.get("/cart/:userId", getCartbyUserID);
router.put("/cart/:userId", updateCart);
router.delete("/cart/:userId", deleteCart);

module.exports = router;
