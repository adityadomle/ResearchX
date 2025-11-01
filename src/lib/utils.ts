import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import { DocumentOutline } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const exportDocument = (
  outline: DocumentOutline,
  format: "DOCX" | "PDF",
  topicInfo?: any
) => {
  try {
    if (format === "PDF") {
      // Generate PDF
      const doc = new jsPDF();
      let yPosition = 20;
      let pageNumber = 1;

      // Title Page
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");

      // Center the title
      const titleWidth =
        (doc.getStringUnitWidth(outline.mainTopic) * 24) /
        doc.internal.scaleFactor;
      const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
      doc.text(outline.mainTopic, titleX > 0 ? titleX : 20, 60);

      // Add subtitle if available
      if (topicInfo?.academicLevel) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        const subtitleText = `${topicInfo.academicLevel} Level Research Paper`;
        const subtitleWidth =
          (doc.getStringUnitWidth(subtitleText) * 14) /
          doc.internal.scaleFactor;
        const subtitleX = (doc.internal.pageSize.width - subtitleWidth) / 2;
        doc.text(subtitleText, subtitleX > 0 ? subtitleX : 20, 75);
      }

      // Add author info
      doc.setFontSize(12);
      const authorText = "Prepared by: Student Name";
      const authorWidth =
        (doc.getStringUnitWidth(authorText) * 12) / doc.internal.scaleFactor;
      const authorX = (doc.internal.pageSize.width - authorWidth) / 2;
      doc.text(authorText, authorX > 0 ? authorX : 20, 100);

      // Add date
      const dateText = `Date: ${new Date().toLocaleDateString()}`;
      const dateWidth =
        (doc.getStringUnitWidth(dateText) * 12) / doc.internal.scaleFactor;
      const dateX = (doc.internal.pageSize.width - dateWidth) / 2;
      doc.text(dateText, dateX > 0 ? dateX : 20, 110);

      // Add institution
      const institutionText = "Institution: University Name";
      const institutionWidth =
        (doc.getStringUnitWidth(institutionText) * 12) /
        doc.internal.scaleFactor;
      const institutionX = (doc.internal.pageSize.width - institutionWidth) / 2;
      doc.text(institutionText, institutionX > 0 ? institutionX : 20, 120);

      // Add page number
      doc.setFontSize(10);
      doc.text(
        `Page ${pageNumber}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
      pageNumber++;

      // Table of Contents Page
      doc.addPage();
      yPosition = 20;

      // Add page number
      doc.setFontSize(10);
      doc.text(
        `Page ${pageNumber}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
      pageNumber++;

      // TOC Header
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Table of Contents", 20, yPosition);
      yPosition += 15;

      // TOC Entries
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");

      // Filter selected sections
      const selectedSections = outline.sections
        .filter((section) => section.isSelected)
        .map((section) => ({
          ...section,
          subtopics: section.subtopics.filter(
            (subtopic) => subtopic.isSelected
          ),
        }));

      // Add TOC entries
      selectedSections.forEach((section, sectionIndex) => {
        // Section entry
        doc.setFont("helvetica", "bold");
        doc.text(`${sectionIndex + 1}. ${section.title}`, 20, yPosition);

        // Add page number reference
        doc.text(`${pageNumber + sectionIndex}`, 180, yPosition);
        doc.setFont("helvetica", "normal");
        yPosition += 10;

        // Subtopic entries
        section.subtopics.forEach((subtopic, subtopicIndex) => {
          doc.text(
            `    ${sectionIndex + 1}.${subtopicIndex + 1}. ${subtopic.title}`,
            20,
            yPosition
          );
          doc.text(`${pageNumber + sectionIndex}`, 180, yPosition);
          yPosition += 8;

          // Check if we need a new page
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;

            // Add page number
            doc.setFontSize(10);
            doc.text(
              `Page ${pageNumber}`,
              doc.internal.pageSize.width - 30,
              doc.internal.pageSize.height - 10
            );
            pageNumber++;

            doc.setFontSize(12);
          }
        });

        yPosition += 5;
      });

      // Content Pages
      selectedSections.forEach((section, sectionIndex) => {
        // Start each section on a new page
        doc.addPage();
        yPosition = 20;

        // Add page number
        doc.setFontSize(10);
        doc.text(
          `Page ${pageNumber}`,
          doc.internal.pageSize.width - 30,
          doc.internal.pageSize.height - 10
        );
        pageNumber++;

        // Section title
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(`${sectionIndex + 1}. ${section.title}`, 20, yPosition);
        doc.setFont("helvetica", "normal");
        yPosition += 15;

        // Subtopics
        section.subtopics.forEach((subtopic, subtopicIndex) => {
          // Subtopic title
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text(
            `${sectionIndex + 1}.${subtopicIndex + 1}. ${subtopic.title}`,
            20,
            yPosition
          );
          doc.setFont("helvetica", "normal");
          yPosition += 10;

          // Subtopic content
          doc.setFontSize(12);
          const lines = doc.splitTextToSize(subtopic.content, 170);
          lines.forEach((line: string) => {
            // Check if we need a new page
            if (yPosition > 280) {
              doc.addPage();
              yPosition = 20;

              // Add page number
              doc.setFontSize(10);
              doc.text(
                `Page ${pageNumber}`,
                doc.internal.pageSize.width - 30,
                doc.internal.pageSize.height - 10
              );
              pageNumber++;

              doc.setFontSize(12);
            }

            doc.text(line, 20, yPosition);
            yPosition += 7;
          });

          yPosition += 10;
        });
      });

      // Save PDF
      doc.save(`${outline.mainTopic.replace(/\s+/g, "_")}.pdf`);
      toast.success("Your document has been downloaded as a PDF.");
    } else if (format === "DOCX") {
      // Filter selected sections and subtopics
      const selectedSections = outline.sections
        .filter((section) => section.isSelected)
        .map((section) => ({
          ...section,
          subtopics: section.subtopics.filter(
            (subtopic) => subtopic.isSelected
          ),
        }));

      // Create a proper DOCX document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Title page
              new Paragraph({
                heading: HeadingLevel.TITLE,
                alignment: "center",
                spacing: { before: 3000, after: 400 },
                children: [
                  new TextRun({
                    text: outline.mainTopic,
                    size: 56, // 28pt
                    bold: true,
                  }),
                ],
              }),

              // Academic level if available
              ...(topicInfo?.academicLevel
                ? [
                    new Paragraph({
                      alignment: "center",
                      spacing: { after: 400 },
                      children: [
                        new TextRun({
                          text: `${topicInfo.academicLevel} Level Research Paper`,
                          size: 32, // 16pt
                        }),
                      ],
                    }),
                  ]
                : []),

              // Author information (placeholder)
              new Paragraph({
                alignment: "center",
                spacing: { after: 200 },
                children: [
                  new TextRun({
                    text: "Prepared by: Student Name",
                    size: 24, // 12pt
                  }),
                ],
              }),

              // Institution (placeholder)
              new Paragraph({
                alignment: "center",
                spacing: { after: 200 },
                children: [
                  new TextRun({
                    text: "Institution: University Name",
                    size: 24, // 12pt
                  }),
                ],
              }),

              // Date
              new Paragraph({
                alignment: "center",
                spacing: { before: 400 },
                children: [
                  new TextRun({
                    text: new Date().toLocaleDateString(),
                    size: 24, // 12pt
                  }),
                ],
              }),

              // Page break after title page
              new Paragraph({
                pageBreakBefore: true,
              }),

              // Table of Contents page
              new Paragraph({
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 500, after: 300 },
                children: [
                  new TextRun({
                    text: "Table of Contents",
                    size: 36, // 18pt
                    bold: true,
                  }),
                ],
              }),

              // Generate TOC entries
              ...selectedSections.flatMap((section, sectionIndex) => {
                const tocEntries = [];

                // Section entry
                tocEntries.push(
                  new Paragraph({
                    spacing: { before: 200, after: 80 },
                    tabStops: [
                      {
                        type: "right",
                        position: 5600,
                      },
                    ],
                    children: [
                      new TextRun({
                        text: `${sectionIndex + 1}. ${section.title}`,
                        bold: true,
                        size: 24, // 12pt
                      }),
                      new TextRun({
                        text: `\t${sectionIndex + 1}`,
                        bold: false,
                      }),
                    ],
                  })
                );

                // Subtopic entries
                section.subtopics.forEach((subtopic, subtopicIndex) => {
                  tocEntries.push(
                    new Paragraph({
                      indent: { left: 400 },
                      spacing: { after: 80 },
                      tabStops: [
                        {
                          type: "right",
                          position: 5600,
                        },
                      ],
                      children: [
                        new TextRun({
                          text: `${sectionIndex + 1}.${subtopicIndex + 1}. ${
                            subtopic.title
                          }`,
                          size: 24, // 12pt
                        }),
                        new TextRun({
                          text: `\t${sectionIndex + 1}`,
                          bold: false,
                        }),
                      ],
                    })
                  );
                });

                return tocEntries;
              }),

              // Page break after TOC
              new Paragraph({
                pageBreakBefore: true,
              }),

              // Document content
              ...selectedSections.flatMap((section, sectionIndex) => {
                const sectionContent = [
                  new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 400, after: 200 },
                    pageBreakBefore: sectionIndex > 0,
                    children: [
                      new TextRun({
                        text: `${sectionIndex + 1}. ${section.title}`,
                        size: 32, // 16pt
                        bold: true,
                      }),
                    ],
                  }),
                ];

                section.subtopics.forEach((subtopic, subtopicIndex) => {
                  sectionContent.push(
                    new Paragraph({
                      heading: HeadingLevel.HEADING_2,
                      spacing: { before: 300, after: 120 },
                      children: [
                        new TextRun({
                          text: `${sectionIndex + 1}.${subtopicIndex + 1}. ${
                            subtopic.title
                          }`,
                          size: 28, // 14pt
                          bold: true,
                        }),
                      ],
                    }),
                    // Split the content into paragraphs for better formatting
                    ...subtopic.content.split("\n\n").map(
                      (paragraph) =>
                        new Paragraph({
                          spacing: { after: 120 },
                          children: [
                            new TextRun({
                              text: paragraph,
                              size: 24, // 12pt
                            }),
                          ],
                        })
                    )
                  );
                });

                return sectionContent;
              }),
            ],
          },
        ],
      });

      // Generate and save the DOCX file
      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `${outline.mainTopic.replace(/\s+/g, "_")}.docx`);
        toast.success("Your document has been downloaded as a DOCX file.");
      });
    }
  } catch (error) {
    console.error("Error exporting document:", error);
    toast.error(
      "There was an error exporting your document. Please try again."
    );
  }
};
