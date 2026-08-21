import sgMail from "@sendgrid/mail";
import { env } from "../env.js";

sgMail.setApiKey(env.SENDGRID_API_KEY);

export async function sendMail(to: string, subject: string, html: string) {
  await sgMail.send({ to, from: env.EMAIL_FROM, subject, html });
}
