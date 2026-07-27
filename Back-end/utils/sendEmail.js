import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

/**
 * Send a welcome email to a new member with a one-time activation link.
 * No password is ever sent by email.
 * @param {{ to: string, fullName: string, activationUrl: string }} opts
 */
export const sendWelcomeEmail = async ({ to, fullName, activationUrl }) => {
  // Transporter is created here (not at module load) so dotenv vars are ready
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const firstName = fullName.split(" ")[0];

  await transporter.sendMail({
    from: `"FitCore Gym" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Welcome to FitCore — Your Account is Ready",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Welcome to FitCore</title>
      </head>
      <body style="margin:0;padding:0;background:#f5f5f3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f3;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e8e6;">

                <!-- Header -->
                <tr>
                  <td style="background:#161618;padding:28px 36px;text-align:left;">
                    <span style="display:inline-flex;align-items:center;gap:10px;">
                      <span style="display:inline-block;width:32px;height:32px;background:oklch(0.62 0.17 145);border-radius:8px;text-align:center;line-height:32px;font-size:16px;">💪</span>
                      <span style="color:#ffffff;font-size:17px;font-weight:700;letter-spacing:-0.02em;">FitCore</span>
                    </span>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:36px 36px 28px;">
                    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1a1a1a;letter-spacing:-0.03em;">
                      Welcome, ${firstName}! 👋
                    </h1>
                    <p style="margin:0 0 24px;font-size:14px;color:#8a8a8a;line-height:1.6;">
                      Your membership has been set up. To finish, activate your account and choose your own password using the secure link below. For your security, the link expires in 24 hours.
                    </p>

                    <!-- CTA button -->
                    <a
                      href="${activationUrl}"
                      style="display:inline-block;padding:12px 28px;background:oklch(0.62 0.17 145);color:#ffffff;text-decoration:none;border-radius:9px;font-size:14px;font-weight:600;"
                    >
                      Activate my account →
                    </a>

                    <p style="margin:24px 0 0;font-size:12px;color:#8a8a8a;line-height:1.6;word-break:break-all;">
                      If the button doesn't work, copy this link into your browser:<br />
                      <span style="color:#1a1a1a;">${activationUrl}</span>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 36px;border-top:1px solid #e8e8e6;">
                    <p style="margin:0;font-size:12px;color:#8a8a8a;">
                      If you didn't expect this email, please ignore it or contact your gym admin.
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
  });
};