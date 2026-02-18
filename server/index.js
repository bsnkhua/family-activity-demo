const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Read and parse prompt.md at startup
const promptMd = fs.readFileSync(path.join(__dirname, '..', 'prompt.md'), 'utf-8');

// Extract system prompt (text after "## System Prompt" heading, up to next heading)
const systemMatch = promptMd.match(/## System Prompt\n\n([\s\S]+?)(?=\n## )/);
const SYSTEM_PROMPT = systemMatch ? systemMatch[1].trim() : '';

// Extract user prompt template (content inside the fenced code block)
const userTemplateMatch = promptMd.match(/## User Prompt Template\n\n```\n([\s\S]+?)\n```/);
const USER_PROMPT_TEMPLATE = userTemplateMatch ? userTemplateMatch[1].trim() : '';

// Build interpolated prompt; omit preferences lines when field is empty
function buildUserPrompt({ city, kids_ages, availability, miles, preferences }) {
  let prompt = USER_PROMPT_TEMPLATE
    .replace(/\{\{city\}\}/g, city)
    .replace(/\{\{kids_ages\}\}/g, kids_ages)
    .replace(/\{\{availability\}\}/g, availability)
    .replace(/\{\{miles\}\}/g, miles);

  if (!preferences || preferences.trim() === '') {
    prompt = prompt
      .replace(/^- Preferences:.*\n?/m, '')
      .replace(/^- If preferences are provided.*\n?/m, '');
  } else {
    prompt = prompt.replace(/\{\{preferences\}\}/g, preferences);
  }

  return prompt;
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.post('/api/activities', async (req, res) => {
  const { city, kidsAges, availability, miles, preferences } = req.body;

  try {
    const userPrompt = buildUserPrompt({
      city,
      kids_ages: kidsAges,
      availability,
      miles,
      preferences,
    });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      tools: [
        {
          type: 'web_search_20250305',
          name: 'web_search',
          max_uses: 3,
          user_location: {
            type: 'approximate',
            city: city,
          },
        },
      ],
      messages: [{ role: 'user', content: userPrompt }],
    });

    // Find the final text block in the response
    const textBlock = response.content.find(block => block.type === 'text');
    if (!textBlock) {
      throw new Error('No text response from Claude');
    }

    // Extract the JSON array — Claude sometimes adds prose before or after it
    const rawText = textBlock.text;
    const arrayMatch = rawText.match(/\[[\s\S]*\]/);
    if (!arrayMatch) {
      console.error('Claude response did not contain a JSON array:\n', rawText);
      throw new Error('Claude did not return a JSON array. Try submitting again.');
    }

    const activities = JSON.parse(arrayMatch[0]);
    res.json(activities);
  } catch (error) {
    console.error('Error calling Claude API:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch activities' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
