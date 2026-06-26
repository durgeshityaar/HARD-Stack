import { env } from "@hard-stack/env/server";
import { render } from "@react-email/render";
import { resend } from "./client";
import { ResetPasswordEmail } from "./templates/reset-password-email";
import { VerificationEmail } from "./templates/verification-email";

interface SendArgs {
  to: string;
  url: string;
}

/** Send the email-verification message produced by Better Auth. */
export async function sendVerificationEmail({ to, url }: SendArgs) {
  const html = await render(VerificationEmail({ url }));
  return resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: "Verify your email",
    html,
  });
}

/** Send the password-reset message produced by Better Auth. */
export async function sendResetPassword({ to, url }: SendArgs) {
  const html = await render(ResetPasswordEmail({ url }));
  return resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: "Reset your password",
    html,
  });
}
