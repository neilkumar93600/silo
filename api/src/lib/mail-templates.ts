const BRAND = "#7c5cff";
const INK = "#1c1624";
const MUTED = "#6b6470";

function layout(preheader: string, bodyHtml: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f4f3f6;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <span style="display:none;font-size:1px;color:#f4f3f6;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3f6;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #ececef;">
            <tr>
              <td style="padding:28px 32px 0 32px;">
                <span style="font-size:20px;font-weight:700;color:${INK};letter-spacing:-0.02em;">Silo</span>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 32px 32px;">
                ${bodyHtml}
              </td>
            </tr>
          </table>
          <p style="color:${MUTED};font-size:12px;margin:20px 0 0 0;">If you didn't request this, you can safely ignore this email.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function verifyOtpEmail(otp: string) {
  const html = layout(
    `Your Silo verification code is ${otp}`,
    `<h1 style="font-size:20px;color:${INK};margin:0 0 8px 0;">Verify your email</h1>
     <p style="font-size:14px;color:${MUTED};line-height:1.5;margin:0 0 24px 0;">Enter this code to finish setting up your Silo account. It expires in 5 minutes.</p>
     <div style="background:#f4f3f6;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
       <span style="font-size:32px;font-weight:700;letter-spacing:0.3em;color:${BRAND};font-family:monospace;">${otp}</span>
     </div>`,
  );
  const text = `Verify your Silo email\n\nYour verification code: ${otp}\n\nExpires in 5 minutes. If you didn't request this, ignore this email.`;
  return { html, text };
}

export function passwordResetEmail(url: string) {
  const html = layout(
    "Reset your Silo password",
    `<h1 style="font-size:20px;color:${INK};margin:0 0 8px 0;">Reset your password</h1>
     <p style="font-size:14px;color:${MUTED};line-height:1.5;margin:0 0 24px 0;">Click the button below to choose a new password. This link expires in 1 hour.</p>
     <a href="${url}" style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;">Reset password</a>
     <p style="font-size:12px;color:${MUTED};margin:20px 0 0 0;word-break:break-all;">Or paste this link: ${url}</p>`,
  );
  const text = `Reset your Silo password\n\n${url}\n\nExpires in 1 hour. If you didn't request this, ignore this email.`;
  return { html, text };
}
