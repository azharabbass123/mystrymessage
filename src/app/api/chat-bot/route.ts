import axios from "axios";

export async function POST(req: Request) {
    const { prompt } = await req.json();
    const API_URL = 'https://api.cohere.ai/generate';
    
    try {
        const response = await axios.post(API_URL, {
            model: 'command-nightly', 
            prompt,
            max_tokens: 50,
            temperature: 0.7,
            stop_sequences: ['\n']
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.COHERE_API_KEY}`, 
                'Content-Type': 'application/json'
            }
        });
        
        // Return a response obj
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
