import { loadStripe } from '@stripe/stripe-js';

export const initStripeJS = async () => {
  const pk = process.env.STRIPE_PUBLISHABLE_KEY;

  if (!pk) {
    throw 'Stripe PK undefined!';
  }

  const stripe = await loadStripe(pk);

  if (!stripe) {
    throw 'Unable to create Stripe instance';
  }

  return stripe;
};
