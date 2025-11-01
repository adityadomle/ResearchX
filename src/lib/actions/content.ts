"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function generateAIContent(
  mainTopic: string,
  sectionTitle: string,
  subtopicTitle: string,
  academicLevel: string
): Promise<string> {
  try {
    const { text } = await generateText({
      model: google("gemini-2.0-flash-lite", {
        // useSearchGrounding: true,
      }),
      system:
        "You are an expert academic writer. Your responses must be clear, concise, and factually accurate, using a formal academic tone suitable for the specified academic level.",
      prompt: [
        `Write a detailed, well-structured paragraph (100-120 words) for the subtopic "${subtopicTitle}" in the section "${sectionTitle}" of a research document on "${mainTopic}".`,
        `Requirements:`,
        `- Academic level: ${academicLevel}`,
        `- Use clear academic language and logical flow.`,
        `- Include relevant facts, explanations, and examples where appropriate.`,
        `- Do NOT use markdown formatting or bullet points.`,
        `- Do NOT include citations or references.`,
        `- Output only the paragraph, with no headings or extra text.`,
      ].join("\n"),
    });

    return text.trim();
  } catch (error) {
    console.error("Error generating AI content:", error);
    return `An error occurred while generating content for "${subtopicTitle}". Please try again later.`;
  }
}
