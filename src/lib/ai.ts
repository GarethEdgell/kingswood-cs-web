// Provider-agnostic AI adapter.
//
// The teacher-mediated AI pipeline calls runPrompt() server-side, only ever
// from a teacher-gated endpoint. Students never call this directly.
//
// Provider is chosen via the AI_PROVIDER env var:
//   • 'stub'      (default) — returns a clearly-labelled placeholder, no key,
//                  no cost. Lets the whole pipeline be tested end-to-end.
//   • 'anthropic' — calls the Claude API via plain fetch (no SDK dependency).
//
// To go live: set AI_PROVIDER=anthropic and ANTHROPIC_API_KEY in Vercel.

export interface AIRequest {
  system?: string;
  prompt: string;
}

const PROVIDER = (import.meta.env.AI_PROVIDER ?? 'stub').toLowerCase();
// A cost-effective default for bulk class runs; override with AI_MODEL.
const MODEL = import.meta.env.AI_MODEL ?? 'claude-haiku-4-5-20251001';

export async function runPrompt(req: AIRequest): Promise<string> {
  switch (PROVIDER) {
    case 'anthropic':
      return runAnthropic(req);
    case 'stub':
    default:
      return runStub(req);
  }
}

function runStub(req: AIRequest): string {
  const preview = req.prompt.trim().slice(0, 500);
  return [
    '[AI STUB RESPONSE]',
    '',
    'This is a placeholder. No real AI was called.',
    '',
    'You asked:',
    `"${preview}${req.prompt.length > 500 ? '…' : ''}"`,
    '',
    'To enable real responses, set AI_PROVIDER=anthropic and ANTHROPIC_API_KEY',
    'in your environment (e.g. the Vercel dashboard).',
  ].join('\n');
}

async function runAnthropic(req: AIRequest): Promise<string> {
  const apiKey = import.meta.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set (AI_PROVIDER=anthropic)');
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      ...(req.system ? { system: req.system } : {}),
      messages: [{ role: 'user', content: req.prompt }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${detail}`);
  }

  const data = await res.json();
  // Claude returns content as an array of blocks; concatenate the text blocks.
  const text = (data.content ?? [])
    .filter((b: any) => b.type === 'text')
    .map((b: any) => b.text)
    .join('\n')
    .trim();

  return text || '(The AI returned an empty response.)';
}
