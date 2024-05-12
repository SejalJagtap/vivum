import { CohereStream, StreamingTextResponse } from 'ai';

export async function POST(req: Request) {
  // Extract the full body from the request
  const requestBody = await req.json();

  // Define API endpoint
  const endpoint = 'https://api.cohere.ai/v1/generate';

  // Prepare the request body including all required parameters
  const apiRequestBody = JSON.stringify({
    model: 'command-nightly', // Adjusted to your specified model
    prompt: requestBody.prompt,
    max_tokens: 300,
    temperature: 0.3,
    prompt_truncation: "AUTO",
    stream: true,
    chat_history: requestBody.chat_history,
    connectors: [{ "id": "web-search" }]
  });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
    },
    body: apiRequestBody,
  });

  // Check for errors
  if (!response.ok) {
    return new Response(await response.text(), {
      status: response.status,
    });
  }
  // console.log(response.ok)

  // Extract the text response from the Cohere stream
  const stream = CohereStream(response);
  console.log(stream)
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
