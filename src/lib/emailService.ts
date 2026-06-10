import { supabase } from './supabase'

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    if (!RESEND_API_KEY) {
      console.warn('Resend API key not found, skipping welcome email')
      return { success: true, skipped: true }
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Feedquire <notifications@feedquire.com>',
        to: [to],
        subject: 'Welcome to Feedquire!',
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
        `
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Resend API error:', response.status, errorText)
      throw new Error(`Failed to send welcome email: ${response.status}`)
    }

    const result = await response.json()
    console.log('Welcome email sent:', result)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error }
  }
}

export async function sendNewTasksEmail(to: string, name: string, tasks: Array<{ name: string; amount: number }>) {
  try {
    if (!RESEND_API_KEY) {
      console.warn('Resend API key not found, skipping new tasks email')
      return { success: true, skipped: true }
    }

    const tasksList = tasks.map(task => `<li><strong>${task.name}</strong> - $${task.amount}</li>`).join('')

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Feedquire <notifications@feedquire.com>',
        to: [to],
        subject: 'New Tasks Available on Feedquire!',
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
              .task-item { background: #f3f4f6; padding: 12px; margin: 8px 0; border-radius: 5px; }
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
        `
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Resend API error:', response.status, errorText)
      throw new Error(`Failed to send new tasks email: ${response.status}`)
    }

    const result = await response.json()
    console.log('New tasks email sent:', result)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error sending new tasks email:', error)
    return { success: false, error }
  }
}
