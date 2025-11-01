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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Edit,
  Trash2,
  MoveUp,
  MoveDown,
  Save,
  X,
} from "lucide-react";
import { DocumentOutline, Section, SubTopic } from "@/lib/types";
import { nanoid } from "nanoid";

interface OutlineGeneratorProps {
  outline: DocumentOutline;
  onOutlineUpdate: (outline: DocumentOutline) => void;
  onBack: () => void;
  onNext: () => void;
  isLoading?: boolean;
}

const OutlineGenerator: React.FC<OutlineGeneratorProps> = ({
  outline,
  onOutlineUpdate,
  onBack,
  onNext,
  isLoading = false,
}) => {
  const [localOutline, setLocalOutline] = useState<DocumentOutline>(outline);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingSubtopic, setEditingSubtopic] = useState<{
    sectionId: string;
    subtopicId: string;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  useEffect(() => {
    setLocalOutline(outline);
    // Initialize all sections as expanded
    const initialExpandedState: Record<string, boolean> = {};
    outline.sections.forEach((section) => {
      initialExpandedState[section.id] = true;
    });
    setExpandedSections(initialExpandedState);
  }, [outline]);

  const toggleSectionSelection = (sectionId: string) => {
    const updatedSections = localOutline.sections.map((section) => {
      if (section.id === sectionId) {
        const isSelected = !section.isSelected;
        return {
          ...section,
          isSelected,
          subtopics: section.subtopics.map((subtopic) => ({
            ...subtopic,
            isSelected: isSelected ? subtopic.isSelected : false,
          })),
        };
      }
      return section;
    });

    const updatedOutline = { ...localOutline, sections: updatedSections };
    setLocalOutline(updatedOutline);
    onOutlineUpdate(updatedOutline);
  };

  const toggleSubtopicSelection = (sectionId: string, subtopicId: string) => {
    const updatedSections = localOutline.sections.map((section) => {
      if (section.id === sectionId) {
        const updatedSubtopics = section.subtopics.map((subtopic) => {
          if (subtopic.id === subtopicId) {
            return { ...subtopic, isSelected: !subtopic.isSelected };
          }
          return subtopic;
        });

        // Check if any subtopic is selected
        const anySubtopicSelected = updatedSubtopics.some(
          (st) => st.isSelected
        );

        return {
          ...section,
          isSelected: anySubtopicSelected,
          subtopics: updatedSubtopics,
        };
      }
      return section;
    });

    const updatedOutline = { ...localOutline, sections: updatedSections };
    setLocalOutline(updatedOutline);
    onOutlineUpdate(updatedOutline);
  };

  const toggleSectionExpansion = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const addNewSection = () => {
    const newSection: Section = {
      id: nanoid(5),
      title: "New Section",
      isSelected: true,
      subtopics: [
        {
          id: nanoid(5),
          title: "New Subtopic",
          isSelected: true,
          content: "",
        },
      ],
    };

    const updatedOutline = {
      ...localOutline,
      sections: [...localOutline.sections, newSection],
    };

    setLocalOutline(updatedOutline);
    onOutlineUpdate(updatedOutline);
    setExpandedSections((prev) => ({
      ...prev,
      [newSection.id]: true,
    }));
  };

  const addNewSubtopic = (sectionId: string) => {
    const updatedSections = localOutline.sections.map((section) => {
      if (section.id === sectionId) {
        const newSubtopic: SubTopic = {
          id: nanoid(5),
          title: "New Subtopic",
          isSelected: true,
          content: "",
        };

        return {
          ...section,
          subtopics: [...section.subtopics, newSubtopic],
        };
      }
      return section;
    });

    const updatedOutline = {
      ...localOutline,
      sections: updatedSections,
    };

    setLocalOutline(updatedOutline);
    onOutlineUpdate(updatedOutline);
  };

  const startEditingSection = (sectionId: string, title: string) => {
    setEditingSection(sectionId);
    setEditValue(title);
  };

  const startEditingSubtopic = (
    sectionId: string,
    subtopicId: string,
    title: string
  ) => {
    setEditingSubtopic({ sectionId, subtopicId });
    setEditValue(title);
  };

  const saveEditingSection = () => {
    if (!editingSection) return;

    const updatedSections = localOutline.sections.map((section) => {
      if (section.id === editingSection) {
        return {
          ...section,
          title: editValue,
        };
      }
      return section;
    });

    const updatedOutline = {
      ...localOutline,
      sections: updatedSections,
    };

    setLocalOutline(updatedOutline);
    onOutlineUpdate(updatedOutline);
    setEditingSection(null);
  };

  const saveEditingSubtopic = () => {
    if (!editingSubtopic) return;

    const updatedSections = localOutline.sections.map((section) => {
      if (section.id === editingSubtopic.sectionId) {
        const updatedSubtopics = section.subtopics.map((subtopic) => {
          if (subtopic.id === editingSubtopic.subtopicId) {
            return {
              ...subtopic,
              title: editValue,
            };
          }
          return subtopic;
        });

        return {
          ...section,
          subtopics: updatedSubtopics,
        };
      }
      return section;
    });

    const updatedOutline = {
      ...localOutline,
      sections: updatedSections,
    };

    setLocalOutline(updatedOutline);
    onOutlineUpdate(updatedOutline);
    setEditingSubtopic(null);
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setEditingSubtopic(null);
  };

  const deleteSection = (sectionId: string) => {
    const updatedSections = localOutline.sections.filter(
      (section) => section.id !== sectionId
    );

    const updatedOutline = {
      ...localOutline,
      sections: updatedSections,
    };

    setLocalOutline(updatedOutline);
    onOutlineUpdate(updatedOutline);
  };

  const deleteSubtopic = (sectionId: string, subtopicId: string) => {
    const updatedSections = localOutline.sections.map((section) => {
      if (section.id === sectionId) {
        // Don't delete the last subtopic
        if (section.subtopics.length <= 1) {
          return section;
        }

        const updatedSubtopics = section.subtopics.filter(
          (subtopic) => subtopic.id !== subtopicId
        );

        // Check if any subtopic is selected
        const anySubtopicSelected = updatedSubtopics.some(
          (st) => st.isSelected
        );

        return {
          ...section,
          isSelected: anySubtopicSelected,
          subtopics: updatedSubtopics,
        };
      }
      return section;
    });

    const updatedOutline = {
      ...localOutline,
      sections: updatedSections,
    };

    setLocalOutline(updatedOutline);
    onOutlineUpdate(updatedOutline);
  };

  const moveSectionUp = (sectionId: string) => {
    const sectionIndex = localOutline.sections.findIndex(
      (s) => s.id === sectionId
    );
    if (sectionIndex <= 0) return;

    const updatedSections = [...localOutline.sections];
    const temp = updatedSections[sectionIndex];
    updatedSections[sectionIndex] = updatedSections[sectionIndex - 1];
    updatedSections[sectionIndex - 1] = temp;

    const updatedOutline = {
      ...localOutline,
      sections: updatedSections,
    };

    setLocalOutline(updatedOutline);
    onOutlineUpdate(updatedOutline);
  };

  const moveSectionDown = (sectionId: string) => {
    const sectionIndex = localOutline.sections.findIndex(
      (s) => s.id === sectionId
    );
    if (sectionIndex === -1 || sectionIndex >= localOutline.sections.length - 1)
      return;

    const updatedSections = [...localOutline.sections];
    const temp = updatedSections[sectionIndex];
    updatedSections[sectionIndex] = updatedSections[sectionIndex + 1];
    updatedSections[sectionIndex + 1] = temp;

    const updatedOutline = {
      ...localOutline,
      sections: updatedSections,
    };

    setLocalOutline(updatedOutline);
    onOutlineUpdate(updatedOutline);
  };

  const moveSubtopicUp = (sectionId: string, subtopicId: string) => {
    const updatedSections = localOutline.sections.map((section) => {
      if (section.id === sectionId) {
        const subtopicIndex = section.subtopics.findIndex(
          (s) => s.id === subtopicId
        );
        if (subtopicIndex <= 0) return section;

        const updatedSubtopics = [...section.subtopics];
        const temp = updatedSubtopics[subtopicIndex];
        updatedSubtopics[subtopicIndex] = updatedSubtopics[subtopicIndex - 1];
        updatedSubtopics[subtopicIndex - 1] = temp;

        return {
          ...section,
          subtopics: updatedSubtopics,
        };
      }
      return section;
    });

    const updatedOutline = {
      ...localOutline,
      sections: updatedSections,
    };

    setLocalOutline(updatedOutline);
    onOutlineUpdate(updatedOutline);
  };

  const moveSubtopicDown = (sectionId: string, subtopicId: string) => {
    const updatedSections = localOutline.sections.map((section) => {
      if (section.id === sectionId) {
        const subtopicIndex = section.subtopics.findIndex(
          (s) => s.id === subtopicId
        );
        if (
          subtopicIndex === -1 ||
          subtopicIndex >= section.subtopics.length - 1
        )
          return section;

        const updatedSubtopics = [...section.subtopics];
        const temp = updatedSubtopics[subtopicIndex];
        updatedSubtopics[subtopicIndex] = updatedSubtopics[subtopicIndex + 1];
        updatedSubtopics[subtopicIndex + 1] = temp;

        return {
          ...section,
          subtopics: updatedSubtopics,
        };
      }
      return section;
    });

    const updatedOutline = {
      ...localOutline,
      sections: updatedSections,
    };

    setLocalOutline(updatedOutline);
    onOutlineUpdate(updatedOutline);
  };

  const anySectionSelected = localOutline.sections.some(
    (section) => section.isSelected
  );

  return (
    <div className="animate-fade-in">
      <Card className="w-full max-w-2xl mx-auto overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl">Research Outline</CardTitle>
          <CardDescription>
            Review and customize your AI-generated document outline
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">
                Generating your outline with AI...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl mb-2">{localOutline.mainTopic}</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={addNewSection}
                      >
                        <Plus size={16} /> Add Section
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add a new section to your outline</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Separator className="mb-4" />

              <ScrollArea className="h-[400px] pr-4 -mr-4">
                <div className="space-y-4">
                  {localOutline.sections.map((section, sectionIndex) => (
                    <div
                      key={section.id}
                      className="border border-border rounded-md overflow-hidden bg-secondary/30"
                    >
                      {editingSection === section.id ? (
                        <div className="flex items-center p-3 bg-secondary/50 border-b border-border">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="flex-1 mr-2"
                            autoFocus
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={saveEditingSection}
                            className="h-8 w-8"
                          >
                            <Save size={16} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={cancelEditing}
                            className="h-8 w-8"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center p-3 bg-secondary/50 border-b border-border">
                          <Checkbox
                            id={`section-${section.id}`}
                            checked={section.isSelected}
                            onCheckedChange={() =>
                              toggleSectionSelection(section.id)
                            }
                            className="mr-3"
                          />
                          <label
                            htmlFor={`section-${section.id}`}
                            className="flex-1 font-medium cursor-pointer"
                          >
                            {sectionIndex + 1}. {section.title}
                          </label>

                          <div className="flex gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() =>
                                      toggleSectionExpansion(section.id)
                                    }
                                    className="h-8 w-8"
                                  >
                                    {expandedSections[section.id] ? (
                                      <ChevronUp size={16} />
                                    ) : (
                                      <ChevronDown size={16} />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {expandedSections[section.id]
                                      ? "Collapse"
                                      : "Expand"}{" "}
                                    section
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() =>
                                      startEditingSection(
                                        section.id,
                                        section.title
                                      )
                                    }
                                    className="h-8 w-8"
                                  >
                                    <Edit size={16} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit section title</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => moveSectionUp(section.id)}
                                    disabled={sectionIndex === 0}
                                    className="h-8 w-8"
                                  >
                                    <MoveUp size={16} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Move section up</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => moveSectionDown(section.id)}
                                    disabled={
                                      sectionIndex ===
                                      localOutline.sections.length - 1
                                    }
                                    className="h-8 w-8"
                                  >
                                    <MoveDown size={16} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Move section down</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => deleteSection(section.id)}
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete section</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      )}

                      {expandedSections[section.id] && (
                        <div
                          className={`p-3 space-y-2 ${
                            !section.isSelected ? "opacity-50" : ""
                          }`}
                        >
                          {section.subtopics.map((subtopic, subtopicIndex) => (
                            <div
                              key={subtopic.id}
                              className="flex items-center ml-6"
                            >
                              {editingSubtopic &&
                              editingSubtopic.sectionId === section.id &&
                              editingSubtopic.subtopicId === subtopic.id ? (
                                <div className="flex items-center w-full">
                                  <Input
                                    value={editValue}
                                    onChange={(e) =>
                                      setEditValue(e.target.value)
                                    }
                                    className="flex-1 mr-2"
                                    autoFocus
                                  />
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={saveEditingSubtopic}
                                    className="h-8 w-8"
                                  >
                                    <Save size={16} />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={cancelEditing}
                                    className="h-8 w-8"
                                  >
                                    <X size={16} />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <Checkbox
                                    id={`subtopic-${subtopic.id}`}
                                    checked={subtopic.isSelected}
                                    onCheckedChange={() =>
                                      toggleSubtopicSelection(
                                        section.id,
                                        subtopic.id
                                      )
                                    }
                                    disabled={!section.isSelected}
                                    className="mr-3"
                                  />
                                  <label
                                    htmlFor={`subtopic-${subtopic.id}`}
                                    className="cursor-pointer flex-1"
                                  >
                                    {sectionIndex + 1}.{subtopicIndex + 1}{" "}
                                    {subtopic.title}
                                  </label>

                                  <div className="flex gap-1">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() =>
                                              startEditingSubtopic(
                                                section.id,
                                                subtopic.id,
                                                subtopic.title
                                              )
                                            }
                                            className="h-7 w-7"
                                            disabled={!section.isSelected}
                                          >
                                            <Edit size={14} />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Edit subtopic</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() =>
                                              moveSubtopicUp(
                                                section.id,
                                                subtopic.id
                                              )
                                            }
                                            disabled={
                                              subtopicIndex === 0 ||
                                              !section.isSelected
                                            }
                                            className="h-7 w-7"
                                          >
                                            <MoveUp size={14} />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Move subtopic up</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() =>
                                              moveSubtopicDown(
                                                section.id,
                                                subtopic.id
                                              )
                                            }
                                            disabled={
                                              subtopicIndex ===
                                                section.subtopics.length - 1 ||
                                              !section.isSelected
                                            }
                                            className="h-7 w-7"
                                          >
                                            <MoveDown size={14} />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Move subtopic down</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() =>
                                              deleteSubtopic(
                                                section.id,
                                                subtopic.id
                                              )
                                            }
                                            disabled={
                                              !section.isSelected ||
                                              section.subtopics.length <= 1
                                            }
                                            className="h-7 w-7 text-destructive hover:text-destructive"
                                          >
                                            <Trash2 size={14} />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Delete subtopic</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}

                          <div className="ml-6 mt-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => addNewSubtopic(section.id)}
                              disabled={!section.isSelected}
                            >
                              <Plus size={14} /> Add Subtopic
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-6 mt-4 flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="px-6 flex items-center gap-2"
            disabled={isLoading}
          >
            <ArrowLeft size={16} /> Back
          </Button>

          <Button
            onClick={onNext}
            disabled={!anySectionSelected || isLoading}
            className="px-6 flex items-center gap-2"
          >
            Next <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OutlineGenerator;
