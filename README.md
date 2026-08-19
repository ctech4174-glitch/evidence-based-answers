# Evidence-Based Answers

Build a clean, professional web UI for a Psychological Self-Help RAG Assistant.

The application is an evidence-based question answering system.

Users enter a question and receive a grounded answer generated from retrieved

documents.

IMPORTANT:

Do NOT implement the RAG, embeddings, MongoDB, or Gemini logic.

The backend will provide a REST API.

Create the following UI:

1. Header

- Title: "Psychological Self-Help Assistant"

- Subtitle: "Evidence-based answers from the provided documents"

2. Question input

- Large text input

- "Ask" button

- Allow free-form questions

- Show a loading state while waiting for the backend

3. Answer section

- Display the generated answer clearly

- Preserve paragraphs and bullet points

- Do not modify the answer returned by the backend

4. Sources section

Display structured citations returned by the backend.

Each source may contain:

- document

- section

- page_start

- page_end

- chunk_id

Example:

Psychological Self-Help Interventions

Section: Who is self-help for?

Pages: 20–22

5. Retrieved Evidence section

Add a collapsible "Show retrieved evidence" section.

If the backend provides retrieved chunks, display:

- source/chunk number

- heading

- page range

- retrieved text

6. Example questions

Show a few clickable example questions:

- What is self-help?

- Who is self-help intended for?

- When should guided self-help be used?

- What are the Step-by-Step skills for managing stress?

7. Error handling

Display a clear message if the API fails.

8. Empty state

Before the first question, show a short explanation of what the assistant does.

Design:

- Clean

- Professional

- Minimal

- Suitable for an academic/clinical project demonstration

- Responsive

- No unnecessary chatbot animations

- Focus on answer + evidence + citations

Backend integration:

POST /ask

Request:

{

  "question": "What is self-help?"

}

Expected response:

{

  "answer": "....",

  "sources": [

    {

      "document": "Psychological Self-Help Interventions",

      "section": "Who is self-help for?",

      "page_start": 20,

      "page_end": 22,

      "chunk_id": 19

    }

  ],

  "retrieved_chunks": [

    {

      "chunk_id": 19,

      "heading": "Who is self-help for?",

      "page_start": 20,

      "page_end": 22,

      "text": "..."

    }

  ]

}

For now, if the backend is not available, create a mock API/service layer

with sample data so the UI can be demonstrated.

Keep the API URL configurable through an environment variable.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/11e1d4b3-e850-479b-bb56-e42ae95c7d64).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
