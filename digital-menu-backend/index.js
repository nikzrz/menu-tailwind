// index.js
const express = require('express');
const multer = require('multer');
const { OpenAI } = require('openai');
const fs = require('fs');
require('dotenv').config(); // если используешь .env

const upload = multer({ dest: 'uploads/' });
const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/generate-dish-info', upload.single('photo'), async (req, res) => {
  try {
    const imageData = fs.readFileSync(req.file.path, { encoding: 'base64' });
    const prompt = "Определи, что за блюдо на фото, опиши его, укажи примерные КБЖУ и предложи название (на русском и английском).";

    const result = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: [
          { type: "image_url", image_url: { "url": `data:image/jpeg;base64,${imageData}` } }
        ]}
      ],
      max_tokens: 800,
    });
    // Удаляем файл после обработки (чистим мусор)
    fs.unlinkSync(req.file.path);
    // Парсим и возвращаем результат
    res.json({ result: result.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));
