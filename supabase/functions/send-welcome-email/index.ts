
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

serve(async (req) => {
  console.log("Received request:", req.method);
  
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, name } = await req.json();
    console.log("Sending welcome email to:", to, name);
    
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set!");
      return new Response(
        JSON.stringify({ success: false, error: "RESEND_API_KEY not set" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Feedquire <onboarding@resend.dev>",
        to: [to],
        subject: "Welcome to Feedquire!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
              <h1>Welcome to Feedquire! 🎉</h1>
            </div>
            <div style="padding: 20px;">
              <p>Hi ${name},</p>
              <p>Welcome to Feedquire - your gateway to earning money by testing apps and sharing feedback!</p>
              <p>Here's what you can do next:</p>
              <ul>
                <li>Complete your human verification</li>
                <li>Take our assessment test</li>
                <li>Start earning from available tasks</li>
              </ul>
              <p>— The Feedquire Team</p>
            </div>
          </div>
        `,
      }),
    });

    console.log("Resend API status:", resendResponse.status);
    
    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Resend API error:", resendResponse.status, errorText);
      throw new Error(`Resend API error: ${resendResponse.status}`);
    }

    const data = await resendResponse.json();
    console.log("Welcome email sent successfully:", data);
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
