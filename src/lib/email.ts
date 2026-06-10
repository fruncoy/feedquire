
import { supabase } from "./supabase";

export async function sendWelcomeEmail(to: string, name: string) {
  try {
    const { data, error } = await supabase.functions.invoke("send-welcome-email", {
      body: { to, name },
    });

    if (error) throw error;
    console.log("Welcome email sent successfully!", data);
    return data;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
}

export async function sendNewTasksEmailToAll() {
  try {
    const { data, error } = await supabase.functions.invoke("send-new-tasks-email", {
      body: { sendToAll: true },
    });

    if (error) throw error;
    console.log("New tasks emails sent successfully!", data);
    return data;
  } catch (error) {
    console.error("Error sending new tasks emails:", error);
    throw error;
  }
}
