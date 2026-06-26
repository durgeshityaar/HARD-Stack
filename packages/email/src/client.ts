import { env } from "@hard-stack/env/server";
import { Resend } from "resend";

/** Shared Resend client. */
export const resend = new Resend(env.RESEND_API_KEY);
