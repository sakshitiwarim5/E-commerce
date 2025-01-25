const express = require('express');
const { supabase } = require('../config/supabase');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Register as seller
router.post('/register', auth, async (req, res) => {
  try {
    const { businessName, businessAddress, taxId } = req.body;
    
    const { data, error } = await supabase
      .from('sellers')
      .insert([{
        user_id: req.user.id,
        business_name: businessName,
        business_address: businessAddress,
        tax_id: taxId,
        status: 'pending'
      }]);
    
    if (error) throw error;
    
    res.status(201).json({ message: 'Seller registration submitted for review' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;