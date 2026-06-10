
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@3.2.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, name } = await req.json();
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const { data, error } = await resend.emails.send({
      from: "Feedquire <notifications@notifications.feedquire.com>",
      to: [to],
      subject: "Welcome to Feedquire!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
            .content { padding: 20px; }
            .button { display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #888; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Feedquire! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Welcome to Feedquire - your gateway to earning money by testing apps and sharing feedback!</p>
              <p>Here's what you can do next:</p>
              <ul>
                <li>Complete your human verification</li>
                <li>Take our assessment test</li>
                <li>Start earning from available tasks</li>
              </ul>
              <a href="https://feedquire.com/dashboard" class="button">Go to Dashboard</a>
              <p>We're excited to have you on board!</p>
              <p>— The Feedquire Team</p>
            </div>
            <div class="footer">
              <p>Feedquire © 2024 | All rights reserved</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
