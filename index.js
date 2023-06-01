const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.post('/', async (req, res) => {
    const { mealName, dietRestrictions, peopleToFeed } = req.body;
    console.log('Received form data:', { mealName, dietRestrictions, peopleToFeed });

    // Prepare the prompt for the OpenAI API
    const prompt = `Create a recipe for a ${mealName} meal, suitable for ${peopleToFeed} people, with the following dietary restrictions: ${dietRestrictions}.`;

    try {
        // Pass the information to the OpenAI API
        const gpt3Response = await axios.post('https://api.openai.com/v1/completions', {
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 500,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Use the API key from the .env file
            }
        });

        // Extract the generated text and send it as a response
        const recipe = gpt3Response.data.choices[0].text.trim();
        console.log('Recipe generated:', recipe);
        res.json({ recipe });

    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Error generating recipe" });
    }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static('public'));

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
