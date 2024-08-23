import { NextResponse } from 'next/server';
import { getChatCompletionStream } from '@/mistralaiPipeline'; // Import the generateText function

export async function POST(req: Request) {
	try {
		const { messages } = await req.json();
		if (!messages || !Array.isArray(messages)) {
			return NextResponse.json({ error: "Invalid input data." }, { status: 400 });
		}
		const responseStream = await getChatCompletionStream(messages);
		const readableStream = new ReadableStream({
			async pull(controller) {
				for await (const chunk of responseStream) {
					controller.enqueue(new TextEncoder().encode(chunk.choices[0]?.delta?.content || ""));
				}
				controller.close();
			},
		})
		return new NextResponse(readableStream, {
			status: 200,
			headers: {
				'Content-Type': 'text/plain',
			}
		});
	} catch (error) {
		console.error("Error handling request:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}