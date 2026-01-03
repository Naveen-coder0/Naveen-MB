import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  to: string;
  type: "match_interest" | "profile_approved" | "profile_rejected";
  recipientName: string;
  senderName?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-notification-email function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, type, recipientName, senderName, message }: NotificationEmailRequest = await req.json();

    console.log(`Sending ${type} email to ${to}`);

    let subject = "";
    let html = "";

    switch (type) {
      case "match_interest":
        subject = "💕 Someone is interested in your profile!";
        html = `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #FFE4E6, #FFF5F5); padding: 30px; border-radius: 16px;">
              <h1 style="color: #BE123C; margin-bottom: 20px;">You Have a New Match Interest!</h1>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Dear ${recipientName},
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Great news! <strong>${senderName}</strong> has expressed interest in connecting with you on Aish Marriage Bureau.
              </p>
              ${message ? `
                <div style="background: white; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #BE123C;">
                  <p style="color: #6B7280; font-size: 14px; margin-bottom: 8px;">Their message:</p>
                  <p style="color: #374151; font-size: 16px; font-style: italic;">"${message}"</p>
                </div>
              ` : ""}
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Log in to your dashboard to view their profile and respond to their interest.
              </p>
            </div>
            <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin-top: 20px;">
              Aish Marriage Bureau - Finding Your Perfect Match
            </p>
          </div>
        `;
        break;

      case "profile_approved":
        subject = "✨ Your Profile Has Been Approved!";
        html = `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #DCFCE7, #F0FDF4); padding: 30px; border-radius: 16px;">
              <h1 style="color: #166534; margin-bottom: 20px;">Congratulations, ${recipientName}!</h1>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Your profile has been reviewed and approved by our team. Your profile is now visible to other members.
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                You can now:
              </p>
              <ul style="color: #374151; font-size: 16px; line-height: 1.8;">
                <li>Browse and connect with other profiles</li>
                <li>Receive match interests from others</li>
                <li>Update your preferences anytime</li>
              </ul>
            </div>
            <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin-top: 20px;">
              Aish Marriage Bureau - Finding Your Perfect Match
            </p>
          </div>
        `;
        break;

      case "profile_rejected":
        subject = "Profile Update Required";
        html = `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #FEF3C7, #FFFBEB); padding: 30px; border-radius: 16px;">
              <h1 style="color: #92400E; margin-bottom: 20px;">Profile Update Needed</h1>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Dear ${recipientName},
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Your profile needs some updates before it can be approved. Please log in to your dashboard and ensure all information is complete and accurate.
              </p>
            </div>
            <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin-top: 20px;">
              Aish Marriage Bureau - Finding Your Perfect Match
            </p>
          </div>
        `;
        break;

      default:
        throw new Error("Invalid notification type");
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Aish Marriage Bureau <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", errorData);
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const emailResponse = await res.json();
    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
