const Category = require("../models/category"); // Assuming Category model is in models/Category.js

// Create a new category
const createCategory = async (req, res) => {
  try {
    const body = new Category(req.body);
    await body.save();

    res.status(201).json({ data: body, message: "Category add successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res
      .status(200)
      .json({ data: categories, message: "Category get successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a category by ID
const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ data: category, message: "Category get successfully" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a category by ID
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      req.body,
      { new: true } // Returns the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res
      .status(200)
      .json({ data: updatedCategory, message: "Category get successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export the functions
module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
