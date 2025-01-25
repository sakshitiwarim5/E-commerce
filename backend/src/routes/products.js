const express = require('express');
const { supabase } = require('../config/supabase');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add product (admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    
    const { data, error } = await supabase
      .from('products')
      .insert([{ name, description, price, stock }]);
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;