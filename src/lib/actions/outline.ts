"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import type { DocumentOutline, Section } from "@/lib/types";
import { nanoid } from "nanoid";

const aiSectionSchema = z.object({
  title: z.string(),
  subtopics: z.array(z.string()),
});

const aiOutlineSchema = z.object({
  sections: z.array(aiSectionSchema),
});

export async function generateAIOutline(
  topic: string,
  academicLevel: string,
  documentLength: number
): Promise<DocumentOutline> {
  try {
    const { object } = await generateObject({
      model: google("gemini-2.0-flash", {
        useSearchGrounding: true,
      }),
      system:
        "You are a helpful assistant that specializes in creating detailed, well-structured research document outlines for academic purposes.",
      prompt: [
        `Generate a comprehensive research document outline for the topic: "${topic}".`,
        `Requirements:`,
        `- Academic level: ${academicLevel}`,
        `- Target length: ~${documentLength} pages`,
        `- Structure: Use clear academic sections (e.g., Introduction, Literature Review, Methodology, Results, Discussion, Conclusion).`,
        `- Each section should have 2-4 unique, non-overlapping subtopics.`,
        `- Avoid repetition and ensure logical flow.`,
        `- Output only the outline structure, no prose or explanations.`,
        `Format your response as a JSON object matching the provided schema.`,
      ].join("\n"),
      schemaName: "DocumentOutline",
      schemaDescription:
        "A research document outline with sections and subtopics.",
      schema: aiOutlineSchema,
    });

    const sections = object.sections.map((section) => ({
      id: nanoid(5),
      title: section.title,
      isSelected: true,
      subtopics: section.subtopics.map((subtopicTitle) => ({
        id: nanoid(5),
        title: subtopicTitle,
        isSelected: true,
        content: "",
      })),
    }));

    return {
      mainTopic: topic,
      sections: sections,
    };
  } catch (error) {
    console.error("Error generating AI outline:", error);

    return generateStaticOutline(topic);
  }
}

function generateStaticOutline(topic: string): DocumentOutline {
  const sections: Section[] = [
    {
      id: "1",
      title: "Introduction",
      isSelected: true,
      subtopics: [
        {
          id: "1-1",
          title: "Background",
          isSelected: true,
          content: `This section provides a comprehensive background on ${topic}.`,
        },
        {
          id: "1-2",
          title: "Research Question",
          isSelected: true,
          content: `The primary research question this document addresses is related to ${topic}.`,
        },
      ],
    },
    // ...other sections like in the original generateOutline
  ];

  return {
    mainTopic: topic,
    sections,
  };
}
