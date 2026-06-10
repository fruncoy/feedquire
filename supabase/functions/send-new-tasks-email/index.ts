
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

serve(async (req) => {
  console.log("Received new tasks email request:", req.method);
  
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, name, tasks } = await req.json();
    console.log("Sending new tasks email to:", to, name, tasks);
    
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

    const tasksList = tasks.map((task: any) => `<li><strong>${task.name}</strong> - $${task.amount}</li>`).join('');

    const resendResponse = await fetch("https://api.resend.com/emails", {
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
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
              <h1>New Tasks Available! 🚀</h1>
            </div>
            <div style="padding: 20px;">
              <p>Hi ${name},</p>
              <p>Great news! There are new tasks available for you on Feedquire:</p>
              <ul>
                ${tasksList}
              </ul>
              <p>Don't wait - tasks are limited!</p>
              <p>— The Feedquire Team</p>
            </div>
          </div>
        `,
      }),
    });

    console.log("Resend API status for new tasks:", resendResponse.status);
    
    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Resend API error (new tasks):", resendResponse.status, errorText);
      throw new Error(`Resend API error: ${resendResponse.status}`);
    }

    const data = await resendResponse.json();
    console.log("New tasks email sent successfully:", data);
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }
    );
  } catch (error) {
    console.error("New tasks email function error:", error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
