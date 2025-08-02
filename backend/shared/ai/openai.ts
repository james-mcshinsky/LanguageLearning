import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
  defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY! },
  defaultQuery: { 'api-version': '2025-01-01-preview' },
});

export async function createEmbedding(input: string, model = 'text-embedding-3-small') {
  const res = await client.embeddings.create({ model, input });
  return res.data[0].embedding;
}

export async function callChatCompletion(
  prompt: string,
  model = process.env.AZURE_OPENAI_DEPLOYMENT!,
) {
  const res = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
  });
  return res.choices[0].message?.content ?? '';
}
