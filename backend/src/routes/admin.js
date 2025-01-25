const express = require('express');
const { supabase } = require('../config/supabase');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Admin dashboard stats
router.get('/dashboard', auth, adminAuth, async (req, res) => {
  try {
    const [users, products, orders] = await Promise.all([
      supabase.from('profiles').select('count'),
      supabase.from('products').select('count'),
      supabase.from('orders').select('count')
    ]);
    
    res.json({
      userCount: users.count,
      productCount: products.count,
      orderCount: orders.count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manage seller applications
router.get('/sellers/pending', auth, adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .eq('status', 'pending');
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;