import { OpenAI } from 'openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { inputPrompt, metaPrompt, apiKey } = req.body;


     if (!apiKey) {
        return res.status(400).json({ error: 'API key is required' });
      }

    try {
         const openai = new OpenAI({
             apiKey: apiKey,
         });

      const response = await openai.chat.completions.create({
        model: 'gpt-4', // Or your model of choice
        messages: [
          { role: 'system', content: metaPrompt },
          { role: 'user', content: inputPrompt },
        ],
      });
      const optimizedPrompt = response.choices[0].message.content;
      res.status(200).json({ optimizedPrompt });
    } catch (error) {
      console.error('Error with OpenAI API:', error);
        if (error.response && error.response.status === 401) {
          res.status(401).json({ error: 'Invalid OpenAI API key.' });
        } else {
          res.status(500).json({ error: 'Failed to optimize the prompt.' });
        }
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}