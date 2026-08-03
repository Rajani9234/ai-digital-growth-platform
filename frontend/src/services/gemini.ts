// Production-ready Gemini service wrapper.
// Reads API key from import.meta.env.VITE_GEMINI_API_KEY.

export async function askGemini(prompt: string): Promise<string> {
  const KEY = import.meta.env.VITE_GEMINI_API_KEY ?? '';
  if (!KEY) throw new Error('Missing Gemini API key (VITE_GEMINI_API_KEY)');

//   const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`;
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
  };

  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gemini API error ${res.status} ${res.statusText} ${errText}`);
  }

  const data = await res.json().catch(() => ({}));
  const candidate = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return (candidate ?? '').toString();
}

export async function askGeminiJson<T>(prompt: string): Promise<T> {
  const text = await askGemini(prompt);
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error('Gemini returned invalid JSON');
  }
}

export type GeminiError = Error;
