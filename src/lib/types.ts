export interface InteractiveTool {
  name: string;
  url: string;
  description?: string;
}

export interface TermContent {
  simpleDefinition: string; // Markdown string
  analogy?: string; // Markdown string
  example?: string; // Markdown string
  elaboration?: string; // Markdown string
  whyItMatters?: string; // Markdown string
}

export interface Term {
  id: string; // e.g., "artificial-intelligence"
  name: string; // e.g., "Artificial Intelligence (AI)"
  category: string; // e.g., "Foundational Concepts"
  content: TermContent;
  interactiveTools?: InteractiveTool[];
}
