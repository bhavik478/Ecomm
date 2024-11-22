const express = require("express");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const catRouter = express.Router();

catRouter.post("/categories", createCategory);
catRouter.get("/categories", getCategories);
catRouter.get("/categories/:id", getCategoryById);
catRouter.put("/categories/:id", updateCategory);
catRouter.delete("/categories/:id", deleteCategory);

module.exports = catRouter;
