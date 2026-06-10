
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

serve(async (req) => {
  console.log("=== TEST EMAIL FUNCTION START ===");
  
  if (req.method === "OPTIONS") {
    console.log("OPTIONS request");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    console.log("RESEND_API_KEY exists?", !!RESEND_API_KEY);
    console.log("RESEND_API_KEY length:", RESEND_API_KEY?.length || 0);
    
    if (!RESEND_API_KEY) {
      console.error("ERROR: RESEND_API_KEY is missing!");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "RESEND_API_KEY not set in environment variables" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const body = await req.json();
    const to = body.to || "feedquire@gmail.com";
    const name = body.name || "Test User";
    
    console.log("Attempting to send email to:", to);

    const resendBody = JSON.stringify({
      from: "Feedquire <onboarding@resend.dev>",
      to: [to],
      subject: "TEST EMAIL - IT WORKS!",
      html: `<h1>🎉 SUCCESS! 🎉</h1><p>Hi ${name},</p><p>If you're reading this, the email system is working perfectly!</p>`,
    });

    console.log("Calling Resend API...");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: resendBody,
    });

    console.log("Resend API status:", res.status);
    const resText = await res.text();
    console.log("Resend API response:", resText);

    if (!res.ok) {
      throw new Error(`Resend API failed: ${res.status} - ${resText}`);
    }

    const result = JSON.parse(resText);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("=== ERROR IN TEST FUNCTION ===");
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
