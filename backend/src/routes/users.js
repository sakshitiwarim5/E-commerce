const express = require('express');
const { supabase } = require('../config/supabase');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ name, phone, address })
      .eq('id', req.user.id);
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user addresses
router.get('/addresses', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', req.user.id);
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;