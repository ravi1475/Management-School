const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create an Express router instance
const router = express.Router();

// Middleware to parse JSON bodies
router.use(bodyParser.json());

// API Endpoint: Create Payment Intent for Stripe
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Endpoint: Razorpay Webhook Handler
router.post('/razorpay-webhook', (req, res) => {
  // Validate webhook signature here using Razorpay guidelines
  const payload = req.body;
  console.log('Razorpay webhook payload:', payload);
  // Process the payload and update transaction status in your system
  res.status(200).send('Webhook Received');
});

module.exports = router;