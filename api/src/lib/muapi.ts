import OpenAI from "openai";
import { env } from "../env.js";

export const muapi = new OpenAI({
  apiKey: env.MUAPI_API_KEY,
  baseURL: "https://api.muapi.ai/api/v1",
  defaultHeaders: {
    "x-api-key": env.MUAPI_API_KEY,
  },
});

export const ASSISTANT_MODEL = env.MUAPI_MODEL;
