const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const axios = require('axios');

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.post('/', async (req, res) => {
    const { mealName, dietRestrictions, peopleToFeed } = req.body;
    console.log('Received form data:', { mealName, dietRestrictions, peopleToFeed });

    // Prepare the prompt for the OpenAI API
    const prompt = `Create a recipe for a ${mealName} meal, suitable for ${peopleToFeed} people, with the following dietary restrictions: ${dietRestrictions}. Add recommendations for substitutions for some ingredients, if possible.`;

    try {
        // Pass the information to the OpenAI API
        console.log(prompt); // Log the prompt
        const data = {
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content: prompt,
            }],
        };
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Use the API key from the .env file
        };
        const url = 'https://api.openai.com/v1/chat/completions';
        console.log('Sending API request:', { url, data, headers }); // Log the data, headers, and url.
    
        const gpt4Response = await axios.post(url, data, { headers });
    
        // Extract the generated text and send it as a response
        const recipe = gpt4Response.data.choices[0].message.content.trim();
        const total_tokens = gpt4Response.data.usage.total_tokens; // Extract total tokens used
        console.log('Recipe generated:', recipe);
        res.json({ recipe, total_tokens }); // Send both recipe and total tokens
    
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
