import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle, 
} from "@/components/ui/card";
import { DocumentOutline, Topic } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  RefreshCw,
  Check,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateAIContent } from "@/lib/actions/content";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface ContentGeneratorProps {
  outline: DocumentOutline;
  topicInfo: Topic;
  onOutlineUpdate: (outline: DocumentOutline) => void;
  onProgressUpdate?: (progress: number) => void;
  onBack: () => void;
  onNext: () => void;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({
  outline,
  topicInfo,
  onOutlineUpdate,
  onProgressUpdate,
  onBack,
  onNext,
}) => {
  const [activeTab, setActiveTab] = useState<string>("");
  const [localOutline, setLocalOutline] = useState<DocumentOutline>(outline);
  const [generatingMap, setGeneratingMap] = useState<Record<string, boolean>>(
    {}
  );
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Count selected subtopics
  const selectedSubtopics = outline.sections
    .filter((section) => section.isSelected)
    .flatMap((section) =>
      section.subtopics.filter((subtopic) => subtopic.isSelected)
    );

  const totalSubtopics = selectedSubtopics.length;

  // Count subtopics with content
  const subtopicsWithContent = outline.sections
    .flatMap((section) => section.subtopics)
    .filter((subtopic) => subtopic.content.length > 0).length;

  useEffect(() => {
    // Set default active tab to first selected section
    if (!activeTab && outline.sections.some((s) => s.isSelected)) {
      const firstSelectedSection = outline.sections.find((s) => s.isSelected);
      if (firstSelectedSection) {
        setActiveTab(firstSelectedSection.id);
      }
    }

    setLocalOutline(outline);

    // Calculate progress
    if (totalSubtopics > 0) {
      const newProgress = Math.round(
        (subtopicsWithContent / totalSubtopics) * 100
      );
      setProgressPercentage(newProgress);
      if (onProgressUpdate) {
        onProgressUpdate(newProgress);
      }
    }
  }, [
    outline,
    activeTab,
    totalSubtopics,
    subtopicsWithContent,
    onProgressUpdate,
  ]);

  const generateSubtopicContent = async (
    sectionId: string,
    subtopicId: string
  ) => {
    const section = localOutline.sections.find((s) => s.id === sectionId);
    const subtopic = section?.subtopics.find((st) => st.id === subtopicId);

    if (!section || !subtopic) return;

    // Set loading state for this specific subtopic
    setGeneratingMap((prev) => ({
      ...prev,
      [`${sectionId}-${subtopicId}`]: true,
    }));

    try {
      // Generate content using AI
      const content = await generateAIContent(
        localOutline.mainTopic,
        section.title,
        subtopic.title,
        topicInfo.academicLevel || "undergraduate"
      );

      // Update outline with the new content
      const updatedOutline = {
        ...localOutline,
        sections: localOutline.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                subtopics: s.subtopics.map((st) =>
                  st.id === subtopicId ? { ...st, content } : st
                ),
              }
            : s
        ),
      };

      setLocalOutline(updatedOutline);
      onOutlineUpdate(updatedOutline);

      toast.success(`Generated content for "${subtopic.title}"`);
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      // Clear loading state
      setGeneratingMap((prev) => ({
        ...prev,
        [`${sectionId}-${subtopicId}`]: false,
      }));
    }
  };

  const generateAllContent = async () => {
    // Get all selected sections and subtopics
    const sectionsToProcess = localOutline.sections.filter(
      (section) => section.isSelected
    );

    let completedCount = 0;
    let updatedOutline = { ...localOutline };

    for (const section of sectionsToProcess) {
      // Filter to only selected subtopics
      const subtopicsToProcess = section.subtopics.filter(
        (subtopic) => subtopic.isSelected && !subtopic.content
      );

      // Update active tab to current section being processed
      if (subtopicsToProcess.length > 0) {
        setActiveTab(section.id);
      }

      for (const subtopic of subtopicsToProcess) {
        // Mark this subtopic as generating
        setGeneratingMap((prev) => ({
          ...prev,
          [`${section.id}-${subtopic.id}`]: true,
        }));

        try {
          // Generate content for this subtopic
          const content = await generateAIContent(
            localOutline.mainTopic,
            section.title,
            subtopic.title,
            topicInfo.academicLevel || "undergraduate"
          );

          // Update the outline with new content
          updatedOutline = {
            ...updatedOutline,
            sections: updatedOutline.sections.map((s) =>
              s.id === section.id
                ? {
                    ...s,
                    subtopics: s.subtopics.map((st) =>
                      st.id === subtopic.id ? { ...st, content } : st
                    ), 
                  }
                : s
            ),
          };

          // Update state with the latest content
          setLocalOutline(updatedOutline);
          onOutlineUpdate(updatedOutline);

          // Update progress
          completedCount++;
          const progress = Math.round(
            ((subtopicsWithContent + completedCount) / totalSubtopics) * 100
          );
          setProgressPercentage(progress);
          if (onProgressUpdate) {
            onProgressUpdate(progress);
          }
        } catch (error) {
          console.error(
            `Error generating content for ${subtopic.title}:`,
            error
          );
          toast.error(`Failed to generate content for "${subtopic.title}"`);
        } finally {
          // Clear loading state for this subtopic
          setGeneratingMap((prev) => ({
            ...prev,
            [`${section.id}-${subtopic.id}`]: false,
          }));
        }
      }
    }

    toast.success("Content generation complete!");
  };

  const isGenerating = Object.values(generatingMap).some(Boolean);
  const allContentGenerated =
    subtopicsWithContent === totalSubtopics && totalSubtopics > 0;

  return (
    <div className="animate-fade-in">
      <Card className="w-full max-w-4xl mx-auto overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row gap-2 justify-between items-start">
            <div>
              <CardTitle className="text-xl leading-tight md:text-2xl">Generate Content</CardTitle>
              <CardDescription>
                {allContentGenerated
                  ? "All content has been generated"
                  : "Generate content for each section and subtopic"}
              </CardDescription>
            </div>
            <Button
              onClick={generateAllContent}
              disabled={isGenerating || allContentGenerated}
              className={cn(
                "transition-all duration-400",
                allContentGenerated ? "bg-green-600 hover:bg-green-700" : ""
              )}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Generating...
                </>
              ) : allContentGenerated ? (
                <>
                  <Check size={16} className="mr-2" />
                  Complete
                </>
              ) : (
                <>
                  <FileText size={16} className="mr-2" />
                  Generate All Content
                </>
              )}
            </Button>
          </div>
          <Progress value={progressPercentage} className="h-2 mt-2" />
        </CardHeader>

        <CardContent className="p-0">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start px-0 h-auto bg-secondary/40 overflow-x-auto flex-nowrap">
              {localOutline.sections
                .filter((section) => section.isSelected)
                .map((section, index) => (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="py-3 px-5 data-[state=active]:bg-background"
                  >
                    {index + 1}. {section.title}
                  </TabsTrigger>
                ))}
            </TabsList>

            {localOutline.sections
              .filter((section) => section.isSelected)
              .map((section) => (
                <TabsContent
                  key={section.id}
                  value={section.id}
                  className="pt-6 px-6 pb-2 focus-visible:outline-none focus-visible:ring-0"
                >
                  <ScrollArea className="h-[500px] pr-4 -mr-4">
                    <div className="space-y-8">
                      {section.subtopics
                        .filter((subtopic) => subtopic.isSelected)
                        .map((subtopic, subtopicIndex) => (
                          <div key={subtopic.id} className="space-y-3">
                            <div className="flex flex-col sm:flex-row justify-between gap-2 md:items-center">
                              <h3 className="text-lg font-medium">
                                {subtopicIndex + 1}. {subtopic.title}
                              </h3>
                              {!generatingMap[
                                `${section.id}-${subtopic.id}`
                              ] && (
                                <Button
                                  variant={
                                    subtopic.content ? "outline" : "default"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    generateSubtopicContent(
                                      section.id,
                                      subtopic.id
                                    )
                                  }
                                  className="h-8"
                                  disabled={isGenerating}
                                >
                                  {subtopic.content ? (
                                    <>
                                      <RefreshCw size={14} className="mr-1" />
                                      Regenerate
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles size={14} className="mr-1" />
                                      Generate
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                            <Separator />
                            <div className="pl-3 paper-content min-h-[150px]">
                              {generatingMap[`${section.id}-${subtopic.id}`] ? (
                                <div className="space-y-3">
                                  <Skeleton className="w-full h-4" />
                                  <Skeleton className="w-[90%] h-4" />
                                  <Skeleton className="w-[95%] h-4" />
                                  <Skeleton className="w-[85%] h-4" />
                                  <Skeleton className="w-full h-4" />
                                </div>
                              ) : subtopic.content ? (
                                subtopic.content
                                  .split("\n\n")
                                  .map((paragraph, i) => (
                                    <p key={i} className="mb-3">
                                      {paragraph}
                                    </p>
                                  ))
                              ) : (
                                <div className="text-muted-foreground italic flex flex-col items-center justify-center h-[150px]">
                                  <FileText className="mb-2 opacity-50" />
                                  Click &quot;Generate&quot; to create content
                                  for this subtopic
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
          </Tabs>
        </CardContent>

        <CardFooter className="border-t pt-6 mt-4 flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="px-6 flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back
          </Button>

          <Button
            onClick={onNext}
            disabled={!allContentGenerated}
            className="px-6 flex items-center gap-2"
          >
            Preview <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ContentGenerator;
