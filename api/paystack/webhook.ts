import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const body = JSON.stringify(req.body);
    const signature = req.headers['x-paystack-signature'] as string;
    
    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');
    
    if (hash !== signature) {
      console.error('Invalid webhook signature');
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const event = req.body;
    console.log('Paystack webhook event:', event.event);
    
    // Handle charge.success event
    if (event.event === 'charge.success') {
      const { data } = event;
      const { reference, amount, currency } = data;
      const userId = data.metadata?.user_id;
      
      if (!userId) {
        console.error('No user_id in payment metadata');
        return res.status(400).json({ message: 'Invalid metadata' });
      }
      
      // Store payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .upsert({
          user_id: userId,
          reference,
          amount,
          currency,
          status: 'success',
          paystack_data: data,
          verified_at: new Date().toISOString()
        });
      
      if (paymentError) {
        console.error('Error updating payment:', paymentError);
        return res.status(500).json({ message: 'Database error' });
      }
      
      // Update user to tier2
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          account_status: '1Q3bF8vL1nT9pB6wR'
        })
        .eq('user_id', userId);
      
      if (profileError) {
        console.error('Error updating profile:', profileError);
        return res.status(500).json({ message: 'Profile update error' });
      }
      
      // Update logs
      await supabase
        .from('logs')
        .update({
          status: 'ready_for_test',
          payment_verified_at: new Date().toISOString(),
          payment_reference: reference
        })
        .eq('user_id', userId);
      
      console.log(`Payment verified for user ${userId}: ${reference}`);
    }
    
    return res.status(200).json({ message: 'OK' });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ message: 'Internal error' });
  }
}