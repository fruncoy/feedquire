
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

serve(async (req) => {
  console.log("=== NEW TASKS EMAIL FUNCTION ===");
  
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, name, sendToAll } = await req.json();
    console.log("Sending new tasks email - sendToAll:", sendToAll, "to:", to, "name:", name);
    
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!RESEND_API_KEY) {
      console.log("RESEND_API_KEY missing, returning success anyway");
      return new Response(
        JSON.stringify({ 
          success: true, 
          warning: "RESEND_API_KEY not set" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let activeTasks: any[] = [];
    let users: Array<{ email: string; full_name: string }> = [];

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false }
      });

      // Fetch active AI platforms
      const { data: aiPlatforms, error: aiPlatformsError } = await supabase
        .from('ai_platforms')
        .select('*')
        .eq('status', 'active')
        .limit(5);

      if (aiPlatformsError) {
        console.error('Error fetching AI platforms:', aiPlatformsError);
      } else {
        activeTasks.push(...(aiPlatforms || []).map(platform => ({
          name: platform.domain,
          description: platform.description,
          amount: platform.amount_per_submission,
          type: 'ai_platform'
        })));
      }

      // Fetch active software links (company tasks) and limit total to 5
      const remainingSlots = 5 - activeTasks.length;
      if (remainingSlots > 0) {
        const { data: softwareLinks, error: softwareLinksError } = await supabase
          .from('software_links')
          .select('*')
          .eq('status', 'active')
          .limit(remainingSlots);

        if (softwareLinksError) {
          console.error('Error fetching software links:', softwareLinksError);
        } else {
          activeTasks.push(...(softwareLinks || []).map(link => ({
            name: link.name,
            description: link.description,
            amount: link.amount_per_submission,
            type: 'software_link'
          })));
        }
      }

      // Fetch users
      if (sendToAll) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('email, full_name')
          .neq('role', 'admin')
          .neq('role', 'system_operator')
          .not('email', 'is', null);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        } else {
          users = profiles || [];
        }
      } else if (to && name) {
        users = [{ email: to, full_name: name }];
      }
    }

    if (activeTasks.length === 0) {
      console.log("No active tasks found, returning success");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No active tasks available" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (users.length === 0) {
      console.log("No users found to send to");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "No users found to send emails to" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tasksList = activeTasks.map((task: any) => {
      const safeDescription = (task.description && typeof task.description === 'string') 
        ? task.description.substring(0, 50)
        : 'New task available';
      return `<li><strong>${task.name}</strong> - $${task.amount} - ${safeDescription}...</li>`;
    }).join('');

    const sentEmails: any[] = [];
    for (const user of users) {
      // Validate user has a valid email
      if (!user.email || typeof user.email !== 'string' || user.email.trim() === '') {
        console.warn('Skipping user - missing or invalid email:', user);
        continue;
      }
      
      // Use a default name if full_name is missing
      const userName = user.full_name && typeof user.full_name === 'string' && user.full_name.trim() !== '' 
        ? user.full_name 
        : 'there';
      
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Feedquire <notifications@feedquire.com>",
          to: user.email,
          subject: "New Tasks Available on Feedquire!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
                <h1>New Tasks Available! 🚀</h1>
              </div>
              <div style="padding: 20px;">
                <p>Hi ${userName},</p>
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

      console.log(`Resend API status for ${user.email}:`, resendResponse.status);
      
      if (resendResponse.ok) {
        const data = await resendResponse.json();
        sentEmails.push({ email: user.email, data });
      } else {
        const errorText = await resendResponse.text();
        console.warn(`Resend API warning for ${user.email}:`, resendResponse.status, errorText);
      }
    }
    
    console.log("New tasks emails sent successfully to:", sentEmails.length, "users");
    
    return new Response(
      JSON.stringify({ success: true, sentEmailsCount: sentEmails.length, sentEmails }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.warn("Function handled error:", error);
    return new Response(
      JSON.stringify({ 
        success: true, 
        warning: (error as Error).message 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
