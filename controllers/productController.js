const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const body = new Product(req.body);
    await body.save();

    res.status(201).json(body);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllProducts = async(req, res) => {
  try {
     const Data = await Product.find()
     res.status(201).json(Data)
  } catch (error) {
    res.status(500).json({ message: error.message });

  }
}

const getSingleProduct = async(req, res) =>{
  try {
   const Data= await Product.findById(req.params.id)
   res.status(201).json(Data)
  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
}

const updateProduct = async (req, res) => {
  try {
      const updatedData = { ...req.body };
      const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
      if (!product) {
          return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(product);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) { 
          return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};



module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getSingleProduct
};
