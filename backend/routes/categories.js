const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const Category = require('../models/Category');

const categorySchema = new mongoose.Schema({
  name: String,
});

// const Category = mongoose.model('Category', categorySchema);

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  const newCategory = new Category({ name });
  try {
    await newCategory.save();
    res.json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
