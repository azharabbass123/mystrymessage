import { StreamingTextResponse, CohereStream } from 'ai'

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST() {
  // Extract the `prompt` from the body of the request
  //const { prompt } = await req.json()
const prompt = `Create a list of three open-ended and ongaging
 quations formatted as a string. Each question should be seprated
 by '||'. These quations are for an anonumous social messaging plateform, like Qooh.me,
 and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead 
 on universal themes that encourage friendly interface. For example, your output should be
 structured like this: 'What's a hobby you've recently started?||If you could have dinner with any
 historical figure, who would it be?|| What's a simple thing that makes you happy?'.
 Ensure the contribution to a positive and welcoming 
 conversational environment.`
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

  // Extract the text response from the Cohere stream
  const stream = CohereStream(response)

  // Respond with the stream
  return new StreamingTextResponse(stream)
// return new Response(stream, {
//     status: 200,
//     contentType: 'text/plain; charset=utf-8',
//     })
  }
  catch(error){
    console.error("An unexpected error occured", error)
    throw error
  }
}
