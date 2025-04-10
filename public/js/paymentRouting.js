const express = require('express');
const router = express.Router();
const { Payment } = require('./server/schema/schema.js'); 

router.post('/', async (req, res) => {
  try {
    const { deadId, amt, payment_method } = req.body;
    const userId = req.session.user_id; 

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Create a new payment record in the Payment collection
    const newPayment = new Payment({
      user_id: userId,
      dead_id: deadId,       // This links to the auction (or "dead" auction)
      payment_status: 'Pending',  // You may update the status after successful processing
      amount: amt,
      payment_method: payment_method
    });

    await newPayment.save();

    res.status(201).json({ message: 'Payment processed successfully!', payment: newPayment });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ message: 'Payment processing failed.' });
  }
});

module.exports = router;
