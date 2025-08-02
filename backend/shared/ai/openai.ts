import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function createEmbedding(input: string, model = 'text-embedding-3-small') {
  const res = await client.embeddings.create({ model, input });
  return res.data[0].embedding;
}

export async function callChatCompletion(prompt: string, model = 'gpt-3.5-turbo') {
  const res = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
  });
  return res.choices[0].message?.content ?? '';
}
