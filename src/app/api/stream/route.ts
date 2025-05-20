import { StreamingTextResponse } from 'ai';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic'; // Ensure the route is re-evaluated on each request

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'mock-data.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const chunkSize = 50; // Define the size of each chunk
    const delay = 150; // Define delay in milliseconds

    const stream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < fileContent.length; i += chunkSize) {
          const chunk = fileContent.substring(i, i + chunkSize);
          controller.enqueue(chunk);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        controller.close();
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error reading or streaming mock data:', error);
    // Ensure a Response object is returned in case of error
    return new Response('Error reading or streaming mock data', { status: 500 });
  }
}
