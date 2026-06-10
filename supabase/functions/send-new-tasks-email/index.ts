
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { Resend } from "npm:resend@3.2.0";

serve(async (req) => {
  const { to, name, tasks } = await req.json();
  const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

  try {
    const { data, error } = await resend.emails.send({
      from: "Feedquire <onboarding@resend.dev>",
      to: [to],
      subject: "New Tasks Available on Feedquire!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Tasks Available!</title>
          </head>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9fafb;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h1 style="color: #111827; margin-top: 0;">Hey ${name}, New Tasks Are Here!</h1>
              <p style="color: #4b5563; line-height: 1.6;">Great news! We have new AI testing tasks available for you to work on.</p>
              <div style="margin: 24px 0;">
                <h2 style="color: #111827; font-size: 1.25rem; margin-bottom: 16px;">Available Tasks:</h2>
                <ul style="color: #4b5563; line-height: 1.8; padding-left: 20px;">
                  ${tasks.map((task: any) => `<li style="margin-bottom: 8px;"><strong>${task.name}</strong> - Earn $${task.amount.toFixed(2)}</li>`).join('')}
                </ul>
              </div>
              <div style="margin-top: 32px;">
                <a href="https://feedquire.com/dashboard" style="background-color: #111827; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">View Tasks Now</a>
              </div>
              <p style="color: #6b7280; margin-top: 32px; font-size: 0.875rem;">Don't miss out - these tasks are first come, first served!</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

