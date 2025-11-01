import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, FileTextIcon, ArrowRightIcon } from "lucide-react";
import { Topic } from "@/lib/types";

interface TopicFormProps {
  onSubmit: (topic: Topic) => void;
}

const TopicForm: React.FC<TopicFormProps> = ({ onSubmit }) => {
  const [mainTopic, setMainTopic] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [documentLength, setDocumentLength] = useState<number>(10);
  const [outputFormat, setOutputFormat] = useState<"DOCX" | "PDF">("DOCX");
  const [academicLevel, setAcademicLevel] = useState("Undergraduate");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainTopic.trim()) return;

    onSubmit({
      mainTopic,
      documentLength,
      outputFormat,
      topicDescription,
      academicLevel,
    });
  };

  return (
    <div className="animate-fade-in">
      <Card className="w-full mx-auto overflow-hidden">
        <CardHeader className="border-b pb-6 border-border">
          <CardTitle className="text-2xl font-bold">
            Research Parameters
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="py-6 space-y-8 md:space-y-10">
            <div>
              <div className="flex items-center mb-2">
                <FileTextIcon className="mr-2 size-4 text-muted-foreground" />
                <Label htmlFor="topic" className="font-medium">
                  Research Topic
                </Label>
              </div>
              <Input
                id="topic"
                placeholder="Enter your research topic"
                value={mainTopic}
                onChange={(e) => setMainTopic(e.target.value)}
                required
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Provide a clear and specific research topic.
              </p>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <FileText className="mr-2 size-4 text-muted-foreground" />
                <Label htmlFor="description" className="font-medium">
                  Topic Description
                </Label>
              </div>
              <Textarea
                id="description"
                placeholder="Provide additional details about your research topic"
                value={topicDescription}
                onChange={(e) => setTopicDescription(e.target.value)}
                rows={5}
                className="resize-y min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Include any specific aspects you want to focus on in your
                research.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div>
                <Label htmlFor="length" className="font-medium block mb-2">
                  Document Length
                </Label>
                <Select
                  value={documentLength.toString()}
                  onValueChange={(value) => setDocumentLength(parseInt(value))}
                >
                  <SelectTrigger id="length" className="w-full">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">Short (1-4 pages)</SelectItem>
                    <SelectItem value="10">Medium (5-10 pages)</SelectItem>
                    <SelectItem value="20">Long (15-20 pages)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Approximate length of your document.
                </p>
              </div>

              <div>
                <Label htmlFor="level" className="font-medium block mb-2">
                  Academic Level
                </Label>
                <Select value={academicLevel} onValueChange={setAcademicLevel}>
                  <SelectTrigger id="level" className="w-full">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="Graduate">Graduate</SelectItem>
                    <SelectItem value="Doctoral">Doctoral</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  The academic level of your research.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border flex flex-col sm:flex-row pt-6 gap-4 justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={!mainTopic.trim()}
              className="w-full sm:w-auto"
            >
              Generate Outline
              <ArrowRightIcon size={16} className="ml-2" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default TopicForm;
