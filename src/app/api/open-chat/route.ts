import { CohereStream, StreamingTextResponse} from "ai";

export const runtime = 'edge'

export async function POST(req: Request){
    const {prompt} = await req.json();
    const body = JSON.stringify({
        prompt,
        model: 'command-nightly',
        max_tokens: 300,
        stop_sequences: [],
        temperature: 0.9,
        return_likelihoods: 'NONE',
        stream: true
      })
    try{
        const response = await fetch('https://api.cohere.ai/v1/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.COHERE_API_KEY}`
            },
            body
          })

        const stream = CohereStream(response)

        return new StreamingTextResponse(stream)
    } catch (error){
        console.error("An unexpected error occured", error)
        throw error
    }
}