import OpenAI from 'openai';

let _openai: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

export async function generateCompletion(
  prompt: string,
  temperature: number = 0.7
): Promise<string> {
  const completion = await getClient().chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature,
    response_format: { type: 'json_object' },
  });

  return completion.choices[0]?.message?.content || '{}';
}
