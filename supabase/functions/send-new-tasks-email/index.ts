
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { to, name, tasks } = await req.json();
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }

    const tasksList = tasks.map(task => `<li><strong>${task.name}</strong> - $${task.amount}</li>`).join('');

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Feedquire <onboarding@resend.dev>",
        to: [to],
        subject: "New Tasks Available on Feedquire!",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
              .content { padding: 20px; }
              .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; color: #888; font-size: 12px; margin-top: 30px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Tasks Available! 🚀</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>Great news! There are new tasks available for you on Feedquire:</p>
                <ul>
                  ${tasksList}
                </ul>
                <a href="https://feedquire.com/dashboard" class="button">Claim Tasks Now</a>
                <p>Don't wait - tasks are limited!</p>
                <p>— The Feedquire Team</p>
              </div>
              <div class="footer">
                <p>Feedquire © 2024 | All rights reserved</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend API error:", response.status, errorText);
      throw new Error(`Resend API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("New tasks email sent:", data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
