import { NextResponse } from 'next/server';
import { getChatCompletionStream } from '@/mistralaiPipeline'; // Import the generateText function

export async function POST(req: Request) {
	const data = await req.json(); // Parse the JSON body of the incoming request

	const stream = await getChatCompletionStream(data.messages);

	return new NextResponse(stream);
}