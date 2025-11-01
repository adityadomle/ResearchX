import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { exportDocument } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, FileBox } from "lucide-react";
import { DocumentOutline, Topic } from "@/lib/types";

interface DocumentPreviewProps {
  outline: DocumentOutline;
  topicInfo: Topic;
  onBack: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  outline,
  topicInfo,
  onBack,
}) => {
  const handleExport = (format: "DOCX" | "PDF") => {
    exportDocument(outline, format, topicInfo);
  };

  // Filter to only include selected sections and subtopics
  const selectedSections = outline.sections
    .filter((section) => section.isSelected)
    .map((section) => ({
      ...section,
      subtopics: section.subtopics.filter((subtopic) => subtopic.isSelected),
    }));

  return (
    <div className="animate-fade-in">
      <Card className="w-full max-w-4xl mx-auto overflow-hidden">
        <CardHeader className="border-b flex flex-row justify-between items-center">
          <CardTitle className="text-2xl">Document Preview</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="sm:p-8 paper-content bg-stone-50 dark:bg-stone-900 shadow-sm">
              {/* Cover Page */}
              <div className="text-center mb-16 mt-8 border border-border p-10 rounded-md shadow-sm">
                <h1 className="text-4xl font-bold mb-8">{outline.mainTopic}</h1>
                {topicInfo?.academicLevel && (
                  <p className="text-xl mb-8">
                    {topicInfo.academicLevel} Level Research Paper
                  </p>
                )}
                <p className="text-muted-foreground mt-12">
                  Prepared by: Student Name
                </p>
                <p className="text-muted-foreground mt-2">
                  Institution: University Name
                </p>
                <p className="text-muted-foreground mt-8">
                  Date: {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Table of Contents */}
              <div className="mb-12 border border-border p-6 rounded-md shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">
                  Table of Contents
                </h2>
                <Separator className="mb-6" />

                <div className="space-y-3">
                  {selectedSections.map((section, sectionIndex) => (
                    <div key={section.id} className="mb-4">
                      <p className="flex justify-between font-medium">
                        <span>
                          {sectionIndex + 1}. {section.title}
                        </span>
                        <span className="text-muted-foreground">
                          Page {sectionIndex + 3}
                        </span>
                      </p>

                      {section.subtopics.map((subtopic, subtopicIndex) => (
                        <p
                          key={subtopic.id}
                          className="flex justify-between ml-6 mt-2"
                        >
                          <span>
                            {sectionIndex + 1}.{subtopicIndex + 1}.{" "}
                            {subtopic.title}
                          </span>
                          <span className="text-muted-foreground">
                            Page {sectionIndex + 3}
                          </span>
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Document Content */}
              <div className="space-y-12">
                {selectedSections.map((section, sectionIndex) => (
                  <div
                    key={section.id}
                    className="document-section border border-border p-6 rounded-md shadow-sm mb-8"
                  >
                    <h2 className="text-2xl font-bold mb-6">
                      {sectionIndex + 1}. {section.title}
                    </h2>

                    {section.subtopics.map((subtopic, subtopicIndex) => (
                      <div key={subtopic.id} className="mt-6">
                        <h3 className="text-xl font-semibold mb-4">
                          {sectionIndex + 1}.{subtopicIndex + 1}.{" "}
                          {subtopic.title}
                        </h3>

                        <div className="mt-3">
                          {subtopic.content
                            .split("\n\n")
                            .map((paragraph, i) => (
                              <p
                                key={i}
                                className="text-base leading-relaxed mb-4"
                              >
                                {paragraph}
                              </p>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t pt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="px-6 flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Content
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={() => handleExport("DOCX")}
              className="px-6 flex items-center gap-2"
            >
              <FileText size={16} />
              Download DOCX
            </Button>

            <Button
              onClick={() => handleExport("PDF")}
              className="px-6 flex items-center gap-2"
            >
              <FileBox size={16} />
              Download PDF
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DocumentPreview;
