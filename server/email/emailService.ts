/**
 * Email Service for OmniCortex AI Labs
 * Handles transactional emails for subscription events
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface SendEmailOptions {
  to: EmailRecipient;
  template: EmailTemplate;
  from?: string;
}

// Email templates for different events
export const emailTemplates = {
  welcome: (data: { name: string; plan: string; credits: string }): EmailTemplate => ({
    subject: `🎉 Welcome to OmniCortex AI Labs, ${data.name}!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to OmniCortex</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td>
        <!-- Header -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
          <tr>
            <td align="center">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #00d4ff, #a855f7); border-radius: 16px; display: inline-block; margin-bottom: 16px;">
                <span style="font-size: 32px; line-height: 60px;">🧠</span>
              </div>
              <h1 style="color: #ffffff; font-size: 28px; margin: 0;">Welcome to OmniCortex!</h1>
            </td>
          </tr>
        </table>

        <!-- Main Content -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, rgba(0,212,255,0.1), rgba(168,85,247,0.1)); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
          <tr>
            <td>
              <p style="color: #ffffff; font-size: 18px; margin: 0 0 16px 0;">Hi ${data.name},</p>
              <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Thank you for subscribing to the <strong style="color: #00d4ff;">${data.plan} Plan</strong>! 
                You now have access to our cutting-edge AI models and ${data.credits} API credits per month.
              </p>
              
              <!-- Plan Details -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <p style="color: #00d4ff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Your Plan</p>
                    <p style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 0;">${data.plan}</p>
                  </td>
                  <td align="right">
                    <p style="color: #00d4ff; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Monthly Credits</p>
                    <p style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 0;">${data.credits}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://omnicortex.ai/dashboard" style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #00b4d8); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Go to Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Quick Start Guide -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
          <tr>
            <td>
              <h2 style="color: #ffffff; font-size: 20px; margin: 0 0 16px 0;">🚀 Quick Start Guide</h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #00d4ff; font-weight: bold;">1.</span>
                    <span style="color: #a0a0a0; margin-left: 8px;">Get your API key from the Dashboard</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #00d4ff; font-weight: bold;">2.</span>
                    <span style="color: #a0a0a0; margin-left: 8px;">Try our interactive Playground</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #00d4ff; font-weight: bold;">3.</span>
                    <span style="color: #a0a0a0; margin-left: 8px;">Read the documentation for integration guides</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #00d4ff; font-weight: bold;">4.</span>
                    <span style="color: #a0a0a0; margin-left: 8px;">Join our Discord community for support</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="color: #666666; font-size: 14px; margin: 0 0 8px 0;">
                Need help? Reply to this email or visit our <a href="https://omnicortex.ai/support" style="color: #00d4ff;">support center</a>.
              </p>
              <p style="color: #444444; font-size: 12px; margin: 0;">
                © 2025 OmniCortex AI Labs. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Welcome to OmniCortex AI Labs, ${data.name}!

Thank you for subscribing to the ${data.plan} Plan! You now have access to our cutting-edge AI models and ${data.credits} API credits per month.

Quick Start Guide:
1. Get your API key from the Dashboard
2. Try our interactive Playground
3. Read the documentation for integration guides
4. Join our Discord community for support

Go to Dashboard: https://omnicortex.ai/dashboard

Need help? Visit our support center at https://omnicortex.ai/support

© 2025 OmniCortex AI Labs. All rights reserved.
    `
  }),

  paymentConfirmation: (data: { name: string; amount: string; plan: string; invoiceUrl: string }): EmailTemplate => ({
    subject: `✅ Payment Confirmed - OmniCortex ${data.plan}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
          <tr>
            <td align="center">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #22c55e, #16a34a); border-radius: 50%; display: inline-block; margin-bottom: 16px;">
                <span style="font-size: 32px; line-height: 60px;">✓</span>
              </div>
              <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Payment Confirmed</h1>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
          <tr>
            <td>
              <p style="color: #ffffff; font-size: 16px; margin: 0 0 16px 0;">Hi ${data.name},</p>
              <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Your payment of <strong style="color: #22c55e;">${data.amount}</strong> for the ${data.plan} Plan has been processed successfully.
              </p>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${data.invoiceUrl}" style="display: inline-block; background: rgba(255,255,255,0.1); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; border: 1px solid rgba(255,255,255,0.2);">
                      View Invoice →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding-top: 24px;">
              <p style="color: #444444; font-size: 12px; margin: 0;">
                © 2025 OmniCortex AI Labs. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Payment Confirmed - OmniCortex ${data.plan}

Hi ${data.name},

Your payment of ${data.amount} for the ${data.plan} Plan has been processed successfully.

View Invoice: ${data.invoiceUrl}

© 2025 OmniCortex AI Labs. All rights reserved.
    `
  }),

  renewalReminder: (data: { name: string; plan: string; renewalDate: string; amount: string }): EmailTemplate => ({
    subject: `⏰ Subscription Renewal Reminder - OmniCortex`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
          <tr>
            <td align="center">
              <h1 style="color: #ffffff; font-size: 24px; margin: 0;">Subscription Renewal Reminder</h1>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.3); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
          <tr>
            <td>
              <p style="color: #ffffff; font-size: 16px; margin: 0 0 16px 0;">Hi ${data.name},</p>
              <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Your <strong style="color: #fbbf24;">${data.plan} Plan</strong> subscription will renew on <strong style="color: #ffffff;">${data.renewalDate}</strong>.
              </p>
              <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Amount: <strong style="color: #ffffff;">${data.amount}</strong>
              </p>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://omnicortex.ai/dashboard/billing" style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #00b4d8); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px;">
                      Manage Subscription →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding-top: 24px;">
              <p style="color: #444444; font-size: 12px; margin: 0;">
                © 2025 OmniCortex AI Labs. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Subscription Renewal Reminder - OmniCortex

Hi ${data.name},

Your ${data.plan} Plan subscription will renew on ${data.renewalDate}.

Amount: ${data.amount}

Manage Subscription: https://omnicortex.ai/dashboard/billing

© 2025 OmniCortex AI Labs. All rights reserved.
    `
  }),

  cancellationConfirmation: (data: { name: string; plan: string; endDate: string }): EmailTemplate => ({
    subject: `😢 Subscription Cancelled - OmniCortex`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
          <tr>
            <td align="center">
              <h1 style="color: #ffffff; font-size: 24px; margin: 0;">We're Sorry to See You Go</h1>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
          <tr>
            <td>
              <p style="color: #ffffff; font-size: 16px; margin: 0 0 16px 0;">Hi ${data.name},</p>
              <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Your <strong style="color: #ef4444;">${data.plan} Plan</strong> subscription has been cancelled. 
                You'll continue to have access until <strong style="color: #ffffff;">${data.endDate}</strong>.
              </p>
              <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                Changed your mind? You can reactivate your subscription anytime from your dashboard.
              </p>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://omnicortex.ai/pricing" style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #00b4d8); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px;">
                      Reactivate Subscription →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding-top: 24px;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 8px 0;">
                We'd love to hear your feedback. <a href="https://omnicortex.ai/feedback" style="color: #00d4ff;">Tell us why you cancelled</a>.
              </p>
              <p style="color: #444444; font-size: 12px; margin: 0;">
                © 2025 OmniCortex AI Labs. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Subscription Cancelled - OmniCortex

Hi ${data.name},

Your ${data.plan} Plan subscription has been cancelled. You'll continue to have access until ${data.endDate}.

Changed your mind? You can reactivate your subscription anytime from your dashboard.

Reactivate Subscription: https://omnicortex.ai/pricing

We'd love to hear your feedback: https://omnicortex.ai/feedback

© 2025 OmniCortex AI Labs. All rights reserved.
    `
  }),

  creditsLow: (data: { name: string; remaining: string; plan: string }): EmailTemplate => ({
    subject: `⚠️ Low Credits Alert - OmniCortex`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
          <tr>
            <td align="center">
              <h1 style="color: #ffffff; font-size: 24px; margin: 0;">⚠️ Low Credits Alert</h1>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.3); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
          <tr>
            <td>
              <p style="color: #ffffff; font-size: 16px; margin: 0 0 16px 0;">Hi ${data.name},</p>
              <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                You have <strong style="color: #fbbf24;">${data.remaining} credits</strong> remaining on your ${data.plan} Plan.
                To avoid service interruption, consider upgrading your plan or purchasing additional credits.
              </p>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://omnicortex.ai/pricing" style="display: inline-block; background: linear-gradient(135deg, #00d4ff, #00b4d8); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; margin-right: 8px;">
                      Upgrade Plan
                    </a>
                    <a href="https://omnicortex.ai/dashboard/billing" style="display: inline-block; background: rgba(255,255,255,0.1); color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; border: 1px solid rgba(255,255,255,0.2);">
                      Buy Credits
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="padding-top: 24px;">
              <p style="color: #444444; font-size: 12px; margin: 0;">
                © 2025 OmniCortex AI Labs. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Low Credits Alert - OmniCortex

Hi ${data.name},

You have ${data.remaining} credits remaining on your ${data.plan} Plan.
To avoid service interruption, consider upgrading your plan or purchasing additional credits.

Upgrade Plan: https://omnicortex.ai/pricing
Buy Credits: https://omnicortex.ai/dashboard/billing

© 2025 OmniCortex AI Labs. All rights reserved.
    `
  })
};

// Email sending function (using console.log for demo, replace with actual email service)
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const { to, template, from = "OmniCortex AI Labs <noreply@omnicortex.ai>" } = options;
  
  try {
    // In production, integrate with an email service like:
    // - SendGrid
    // - AWS SES
    // - Resend
    // - Postmark
    
    console.log("=== EMAIL SENT ===");
    console.log(`From: ${from}`);
    console.log(`To: ${to.email} (${to.name || "No name"})`);
    console.log(`Subject: ${template.subject}`);
    console.log("==================");
    
    // For now, we'll log the email. In production, uncomment and configure:
    /*
    // Example with SendGrid:
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    await sgMail.send({
      to: to.email,
      from: from,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
    */
    
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}

// Helper function to get plan credits
export function getPlanCredits(plan: string): string {
  const credits: Record<string, string> = {
    "Starter": "100,000",
    "Pro": "500,000",
    "Business": "2,000,000",
    "Enterprise": "Unlimited"
  };
  return credits[plan] || "100,000";
}
