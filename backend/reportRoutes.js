const express = require('express');
const router = express.Router();
const { fetchTransactionsForDenial, fetchTransactionsForCharge, fetchTransactionsForPayment } = require('./reportHandlers');

// Denial Report API
router.get('/denial-report', async (req, res) => {
  try {
    const data = await fetchTransactionsForDenial();
    res.json(data);
  } catch (error) {
    res.status(500).send('Error generating denial report');
  }
});

// Charge Report API
router.get('/charge-report', async (req, res) => {
  try {
    const data = await fetchTransactionsForCharge();
    res.json(data);
  } catch (error) {
    res.status(500).send('Error generating charge report');
  }
});

// Payment Analysis API
router.get('/payment-analysis', async (req, res) => {
  try {
    const data = await fetchTransactionsForPayment();
    res.json(data);
  } catch (error) {
    res.status(500).send('Error generating payment analysis report');
  }
});

module.exports = router;
