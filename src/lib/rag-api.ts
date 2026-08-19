export interface Source {
  document?: string;
  section?: string;
  page_start?: number;
  page_end?: number;
  chunk_id?: number;
}

export interface RetrievedChunk {
  chunk_id?: number;
  heading?: string;
  page_start?: number;
  page_end?: number;
  text?: string;
}

export interface AskResponse {
  answer: string;
  sources?: Source[];
  retrieved_chunks?: RetrievedChunk[];
}

const API_BASE_URL = import.meta.env.VITE_RAG_API_URL ?? "";

export const EXAMPLE_QUESTIONS = [
  "What is self-help?",
  "Who is self-help intended for?",
  "When should guided self-help be used?",
  "What are the Step-by-Step skills for managing stress?",
];

const MOCK: AskResponse = {
  answer:
    "Self-help refers to structured psychological interventions that people work through largely on their own, using written, digital, or audio materials based on evidence-based therapies such as cognitive behavioural therapy (CBT).\n\nKey characteristics described in the documents:\n\n- The person leads the pace of the work, applying skills to their own situation.\n- Materials present a clear model of the difficulty, followed by practical exercises.\n- Support may be added by a practitioner, in which case it is called guided self-help.\n\nSelf-help is usually offered as a first step for mild to moderate difficulties, and is reviewed regularly so that more intensive care can be offered if symptoms do not improve.",
  sources: [
    {
      document: "Psychological Self-Help Interventions",
      section: "What is self-help?",
      page_start: 12,
      page_end: 15,
      chunk_id: 7,
    },
    {
      document: "Psychological Self-Help Interventions",
      section: "Who is self-help for?",
      page_start: 20,
      page_end: 22,
      chunk_id: 19,
    },
  ],
  retrieved_chunks: [
    {
      chunk_id: 7,
      heading: "What is self-help?",
      page_start: 12,
      page_end: 15,
      text: "Self-help interventions provide the person with structured materials that describe a psychological model of their difficulty and set out practical exercises drawn from cognitive behavioural therapy. The person works through the material at their own pace, recording observations and completing between-session practice.",
    },
    {
      chunk_id: 19,
      heading: "Who is self-help for?",
      page_start: 20,
      page_end: 22,
      text: "Self-help is generally indicated for people experiencing mild to moderate anxiety or low mood who are able to read and engage with written material. Where risk is elevated, or difficulties are severe and complex, higher intensity therapy should be considered instead.",
    },
  ],
};

export async function askQuestion(question: string): Promise<AskResponse> {
  if (!API_BASE_URL) {
    await new Promise((r) => setTimeout(r, 700));
    return MOCK;
  }

  const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    throw new Error(`The assistant service returned an error (${res.status}).`);
  }

  const data = (await res.json()) as AskResponse;
  if (!data || typeof data.answer !== "string") {
    throw new Error("The assistant returned an unexpected response format.");
  }
  return data;
}

export function formatPages(start?: number, end?: number): string | null {
  if (start == null && end == null) return null;
  if (start != null && end != null && start !== end) return `Pages: ${start}–${end}`;
  return `Page: ${start ?? end}`;
}
