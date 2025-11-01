export interface Topic {
  mainTopic: string;
  documentLength: number;
  outputFormat: "DOCX" | "PDF";
  topicDescription?: string;
  citationFormat?: string;
  academicLevel?: string;
}

export interface SubTopic {
  id: string;
  title: string;
  isSelected: boolean;
  content: string;
}

export interface Section {
  id: string;
  title: string;
  isSelected: boolean;
  subtopics: SubTopic[];
}

export interface DocumentOutline {
  mainTopic: string;
  sections: Section[];
}
