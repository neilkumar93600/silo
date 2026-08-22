import { env } from "../env.js";

const MUAPI_BASE = "https://api.muapi.ai/api/v1";

// MuAPI has no OpenAI-style /chat/completions endpoint - each model gets its
// own path (verified against https://api.muapi.ai/openapi.json). The
// /stream variant does emit OpenAI-shaped chat.completion.chunk SSE events,
// so we only need to hand-roll the HTTP call, not the chunk parsing.
//
// kimi-k3 is a reasoning model: most of its SSE stream is delta.reasoning_content
// (hidden chain-of-thought), with real delta.content arriving only at the end -
// often 20-40s of silence. We yield a tick for every chunk (content or not) so
// the caller can forward a heartbeat to the client and keep the connection
// alive through any idle-timeout sitting between browser and API (a Next.js
// dev rewrite proxy silently killed a fully-buffered response at ~30s).
export async function* streamChat(params: {
  prompt: string;
  systemPrompt: string;
  maxTokens?: number;
}): AsyncGenerator<{ content?: string }> {
  const res = await fetch(`${MUAPI_BASE}/${env.MUAPI_MODEL}/stream`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": env.MUAPI_API_KEY },
    body: JSON.stringify({
      prompt: params.prompt,
      system_prompt: params.systemPrompt,
      max_tokens: params.maxTokens ?? 4096,
    }),
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`MuAPI request failed (${res.status}): ${detail}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const rawEvent = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const dataLine = rawEvent.split("\n").find((l) => l.startsWith("data:"));
      if (!dataLine) continue;
      const data = dataLine.slice(5).trim();
      if (data === "[DONE]") continue;

      let parsed: { choices?: { delta?: { content?: string | null } }[] } | undefined;
      try {
        parsed = JSON.parse(data);
      } catch {
        continue;
      }
      // reasoning_content (chain-of-thought) is intentionally ignored - only
      // .content is the actual reply.
      const delta = parsed?.choices?.[0]?.delta?.content;
      yield typeof delta === "string" && delta.length > 0 ? { content: delta } : {};
    }
  }
}
