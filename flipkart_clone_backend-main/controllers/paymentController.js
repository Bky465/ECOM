// This is your test secret API key.
const stripe = require('stripe')('sk_test_51LXdHjSCUET3KE2FYvtC1Q6QzqKvqqzze4ZacTciPRIIleL9S34NwnhNTZNvnxkOOt8v39c3I2uTqzu26auo09br00ksxndjkX');

const payment=async (req, res) => {
  try {
    const amount=req.body.amount;
    const payment_method_id=req.body.payment_method_id;
    console.log(amount)
    let intent;
    if (payment_method_id) {
      // Create the PaymentIntent
      intent = await stripe.paymentIntents.create({
        payment_method:payment_method_id,
        amount: amount*100,
        currency: 'inr',
        confirmation_method: 'manual',
        confirm: true
      });
    }
      console.log(intent);
      return res.status(201).json({result:intent})
  } catch (error) {
    console.log(error);
 return res.status(500).json({message:'payment api error'});
  }
};
module.exports={payment}
