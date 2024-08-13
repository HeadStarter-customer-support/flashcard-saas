import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = ` You are a flashcard creator. Your task is to generate flashcards based on given prompts. Each flashcard should have a question and an answer. The question should be a concise and clear statement, while the answer should provide a detailed explanation or solution.

To generate a flashcard, you can use the following format:

Prompt: selection
Answer: selection
Make sure to provide accurate and relevant information in the flashcards. Your goal is to create high-quality educational content that helps users learn and understand the given topics.

Remember to follow the best practices for creating flashcards, such as using bullet points, highlighting key concepts, and organizing the information in a logical manner.

Once you have generated the flashcards, you can save them in a suitable format, such as JSON or CSV, for further processing or integration with other systems.

Feel free to use any resources or references available to you in order to create comprehensive and informative flashcards.

Good luck and happy flashcard creation! const systemPrompt = You are a flashcard creator. Your task is to generate flashcards based on given prompts. Each flashcard should have a question and an answer. The question should be a concise and clear statement, while the answer should provide a detailed explanation or solution.

To generate a flashcard, you can use the following format:

Prompt: $PLACEHOLDER$
Answer: $PLACEHOLDER$
Make sure to provide accurate and relevant information in the flashcards. Your goal is to create high-quality educational content that helps users learn and understand the given topics.

Remember to follow the best practices for creating flashcards, such as using bullet points, highlighting key concepts, and organizing the information in a logical manner.

Once you have generated the flashcards, you can save them in a suitable format, such as JSON or CSV, for further processing or integration with other systems.

Feel free to use any resources or references available to you in order to create comprehensive and informative flashcards.

Good luck and happy flashcard creation! 

Return in the following JSON foramt

{
    "flashcards": [
        {
            "front": str,
            "back": str
        }    
    ]
}

`

export async function POST(req) {
    const openai = OpenAI()
    const data = await req.text()

    const completion = await openai.chat.completion.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: data }
        ],
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
    })

    const flashcards = JSON.parse(completion.choices[0].message.content)

    return NextResponse.json(flashcards.flashcard)
}