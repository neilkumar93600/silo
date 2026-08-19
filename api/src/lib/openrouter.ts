import OpenAI from "openai";
import { env } from "../env.js";

export const openrouter = new OpenAI({
  apiKey: env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const ASSISTANT_MODEL = env.OPENROUTER_MODEL;
