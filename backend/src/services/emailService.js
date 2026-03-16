const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2");

const client = new SESv2Client({ region: process.env.AWS_REGION || "us-east-1" });
const FROM = process.env.SES_FROM_EMAIL || "osasdanny357@gmail.com";
const BASE_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const sendEmail = async ({ to, subject, html }) => {
  try {
    await client.send(new SendEmailCommand({
      FromEmailAddress: FROM,
      Destination: { ToAddresses: [to] },
      Content: {
        Simple: {
          Subject: { Data: subject },
          Body: { Html: { Data: html } },
        },
      },
    }));
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (err) {
    console.error("SES sendEmail error:", err);
  }
};

const wrap = (content) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:32px;border-radius:12px;">
    <h1 style="color:#3b82f6;font-size:22px;margin-bottom:8px;">DG-LETS Cloud Academy</h1>
    <hr style="border-color:#1e293b;margin-bottom:24px;"/>
    ${content}
    <p style="color:#64748b;font-size:12px;margin-top:32px;">DG-LETS Cloud Academy · Affordable Cloud & Tech Training</p>
  </div>
`;

const sendEnrollmentConfirmation = (s) => sendEmail({
  to: s.email,
  subject: "✅ Enrollment Received — DG-LETS Cloud Academy",
  html: wrap(`
    <h2 style="color:#ffffff;">Hi ${s.fullName}, we received your enrollment! 🎉</h2>
    <p style="color:#94a3b8;line-height:1.6;">Thank you for enrolling. Your application is currently <strong style="color:#f59e0b;">under review</strong>. You'll hear from us once it's approved.</p>
    <div style="background:#1e293b;border-radius:8px;padding:16px;margin:24px 0;">
      <p style="margin:4px 0;color:#ffffff;"><strong>Name:</strong> ${s.fullName}</p>
      <p style="margin:4px 0;color:#ffffff;"><strong>Email:</strong> ${s.email}</p>
      <p style="margin:4px 0;color:#ffffff;"><strong>Level:</strong> ${s.experienceLevel}</p>
      <p style="margin:4px 0;color:#ffffff;"><strong>Preferred Date:</strong> ${s.preferredDate}</p>
    </div>
  `),
});

const sendEnrollmentApproved = (s) => sendEmail({
  to: s.email,
  subject: "🎉 Enrollment Approved — DG-LETS Cloud Academy",
  html: wrap(`
    <h2 style="color:#22c55e;">Congratulations ${s.fullName}! Your enrollment is approved ✅</h2>
    <p style="color:#94a3b8;line-height:1.6;">Your enrollment has been <strong style="color:#22c55e;">approved</strong>. Complete your payment to get access to the student portal.</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${BASE_URL}/payment" style="background:#3b82f6;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">Complete Payment →</a>
    </div>
    <div style="background:#1e293b;border-radius:8px;padding:16px;">
      <p style="margin:0 0 8px;color:#64748b;font-size:13px;">Bank Details</p>
      <p style="margin:4px 0;color:#ffffff;"><strong>Bank:</strong> Access Bank</p>
      <p style="margin:4px 0;color:#ffffff;"><strong>Account Name:</strong> Emwenbun Daniel Osadolor</p>
      <p style="margin:4px 0;color:#ffffff;"><strong>Account Number:</strong> 1232994549</p>
    </div>
  `),
});

const sendEnrollmentRejected = (s) => sendEmail({
  to: s.email,
  subject: "Enrollment Update — DG-LETS Cloud Academy",
  html: wrap(`
    <h2 style="color:#ffffff;">Hi ${s.fullName},</h2>
    <p style="color:#94a3b8;line-height:1.6;">Unfortunately, we were unable to approve your enrollment at this time. Please contact us for more information or to reapply.</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${BASE_URL}/contact" style="background:#3b82f6;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">Contact Us</a>
    </div>
  `),
});

const sendPaymentVerified = (s) => sendEmail({
  to: s.email,
  subject: "💳 Payment Verified — DG-LETS Cloud Academy",
  html: wrap(`
    <h2 style="color:#22c55e;">Payment Verified! Welcome aboard ${s.fullName} 🚀</h2>
    <p style="color:#94a3b8;line-height:1.6;">Your payment has been verified. You will receive your student portal login credentials shortly from your instructor.</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${BASE_URL}/student" style="background:#22c55e;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">Go to Student Portal →</a>
    </div>
  `),
});

const sendPortalAccessGranted = (s, password) => sendEmail({
  to: s.email,
  subject: "🔐 Portal Access Granted — DG-LETS Cloud Academy",
  html: wrap(`
    <h2 style="color:#22c55e;">You now have portal access, ${s.fullName}! 🎓</h2>
    <p style="color:#94a3b8;line-height:1.6;">Your student portal account has been created. Use the credentials below to sign in.</p>
    <div style="background:#1e293b;border-radius:8px;padding:16px;margin:24px 0;">
      <p style="margin:4px 0;color:#ffffff;"><strong>Portal URL:</strong> <a href="${BASE_URL}/student" style="color:#3b82f6;">${BASE_URL}/student</a></p>
      <p style="margin:4px 0;color:#ffffff;"><strong>Email:</strong> ${s.email}</p>
      <p style="margin:4px 0;color:#ffffff;"><strong>Password:</strong> <span style="color:#f59e0b;font-family:monospace;">${password}</span></p>
      <p style="margin:4px 0;color:#ffffff;"><strong>Program:</strong> ${s.program}</p>
    </div>
    <p style="color:#ef4444;font-size:13px;">⚠️ Please keep your password safe. Do not share it with anyone.</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${BASE_URL}/student" style="background:#3b82f6;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">Sign In to Portal →</a>
    </div>
  `),
});

module.exports = { sendEnrollmentConfirmation, sendEnrollmentApproved, sendEnrollmentRejected, sendPaymentVerified, sendPortalAccessGranted };
