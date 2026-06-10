
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { Resend } from "npm:resend@3.2.0";

serve(async (req) => {
  const { to, name } = await req.json();
  const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

  try {
    const { data, error } = await resend.emails.send({
      from: "Feedquire <noreply@feedquire.com",
      to: [to],
      subject: "Welcome to Feedquire!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Feedquire</title>
          </head>
          <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9fafb;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h1 style="color: #111827; margin-top: 0;">Welcome to Feedquire, ${name}!</h1>
              <p style="color: #4b5563; line-height: 1.6;">Thank you for joining Feedquire! We're excited to have you as part of our community of AI testers.</p>
              <p style="color: #4b5563; line-height: 1.6;">To get started:</p>
              <ol style="color: #4b5563; line-height: 1.8;">
                <li>Complete your human verification</li>
                <li>Take the assessment test</li>
                <li>Start earning money testing AI platforms</li>
              </ol>
              <div style="margin-top: 32px;">
                <a href="https://feedquire.com/dashboard" style="background-color: #111827; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Go to Dashboard</a>
              </div>
              <p style="color: #6b7280; margin-top: 32px; font-size: 0.875rem;">If you have any questions, feel free to reach out!</p>
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

