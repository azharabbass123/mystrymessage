import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const { prompt } = req.body;
    const API_URL = 'https://api.cohere.ai/generate';
    
    try {
        const response = await axios.post(API_URL, {
            model: 'command-nightly', // Choose the model
            prompt,
            max_tokens: 50,
            temperature: 0.7,
            stop_sequences: ['\n']
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.COHERE_API_KEY}`, // Use API key directly
                'Content-Type': 'application/json'
            }
        });
        
        // Return a response object
        return new Response(JSON.stringify({ text: response.data.generations[0].text.trim() }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        
        // Return an error response
        return new Response(JSON.stringify({ error: "An unexpected error occurred." }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
