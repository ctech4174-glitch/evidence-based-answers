import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, BookOpen, ChevronDown, Loader2, Search } from "lucide-react";

import { AnswerText } from "@/components/AnswerText";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { askQuestion, EXAMPLE_QUESTIONS, formatPages } from "@/lib/rag-api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Psychological Self-Help Assistant" },
      {
        name: "description",
        content:
          "Ask a question and receive a grounded, evidence-based answer with citations and retrieved source evidence.",
      },
      { property: "og:title", content: "Psychological Self-Help Assistant" },
      {
        property: "og:description",
        content:
          "Evidence-based answers generated only from the provided self-help documents, with citations.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: askQuestion,
  });

  const ask = (value: string) => {
    const q = value.trim();
    if (!q || mutation.isPending) return;
    setQuestion(value);
    setSubmitted(q);
    mutation.mutate(q);
  };

  const result = mutation.data;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="flex items-start gap-3">
            <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <BookOpen className="size-5" aria-hidden />
            </span>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Psychological Self-Help Assistant
              </h1>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Evidence-based answers from the provided documents
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <section
          aria-label="Ask a question"
          className="rounded-lg border border-border bg-card p-5"
          style={{ boxShadow: "var(--shadow-panel)" }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(question);
            }}
          >
            <label
              htmlFor="question"
              className="text-sm font-medium text-foreground"
            >
              Your question
            </label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  ask(question);
                }
              }}
              placeholder="e.g. When should guided self-help be used?"
              rows={3}
              className="mt-2 resize-none bg-background text-base"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Answers are generated only from the indexed source documents.
              </p>
              <Button type="submit" disabled={mutation.isPending || !question.trim()}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Retrieving…
                  </>
                ) : (
                  <>
                    <Search className="size-4" aria-hidden />
                    Ask
                  </>
                )}
              </Button>
            </div>
          </form>

          <Separator className="my-5" />

          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Example questions
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLE_QUESTIONS.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => ask(example)}
                disabled={mutation.isPending}
                className="rounded-md border border-border bg-secondary px-3 py-1.5 text-sm text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
              >
                {example}
              </button>
            ))}
          </div>
        </section>

        {mutation.isError && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4"
          >
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
            <div>
              <p className="text-sm font-medium text-foreground">
                Could not retrieve an answer
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {mutation.error instanceof Error
                  ? mutation.error.message
                  : "The assistant service is unavailable."}{" "}
                Please check the connection and try again.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => submitted && mutation.mutate(submitted)}
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {mutation.isPending && (
          <section
            className="mt-6 rounded-lg border border-border bg-card p-5"
            aria-busy="true"
          >
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Searching the documents and composing a grounded answer…
            </p>
            <div className="mt-4 space-y-3">
              <div className="h-3 w-full rounded bg-muted" />
              <div className="h-3 w-11/12 rounded bg-muted" />
              <div className="h-3 w-9/12 rounded bg-muted" />
            </div>
          </section>
        )}

        {!mutation.isPending && !mutation.isError && !result && (
          <section className="mt-6 rounded-lg border border-dashed border-border bg-card/60 p-6">
            <h2 className="text-lg font-semibold text-foreground">
              What this assistant does
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Ask a question about psychological self-help. The assistant retrieves the
              most relevant passages from a fixed set of source documents and produces an
              answer grounded in that material only — no outside knowledge, no clinical
              advice.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Every answer is accompanied by structured citations.</li>
              <li>• The exact retrieved passages can be inspected for verification.</li>
              <li>• Intended for academic demonstration, not for personal diagnosis.</li>
            </ul>
          </section>
        )}

        {result && !mutation.isPending && (
          <div className="mt-6 space-y-6">
            <section
              aria-label="Answer"
              className="rounded-lg border border-border bg-card p-6"
              style={{ boxShadow: "var(--shadow-panel)" }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-semibold text-foreground">Answer</h2>
                {submitted && (
                  <p className="max-w-full text-sm text-muted-foreground">
                    “{submitted}”
                  </p>
                )}
              </div>
              <Separator className="my-4" />
              <AnswerText answer={result.answer} />
            </section>

            {result.sources && result.sources.length > 0 && (
              <section
                aria-label="Sources"
                className="rounded-lg border border-border bg-card p-6"
              >
                <h2 className="text-lg font-semibold text-foreground">Sources</h2>
                <ol className="mt-4 space-y-3">
                  {result.sources.map((source, i) => (
                    <li
                      key={`${source.chunk_id ?? "s"}-${i}`}
                      className="rounded-md border border-border bg-secondary/40 p-4"
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          [{i + 1}]
                        </span>
                        <p className="font-serif text-base font-semibold text-foreground">
                          {source.document ?? "Untitled document"}
                        </p>
                      </div>
                      <div className="mt-1 space-y-0.5 pl-6 text-sm text-muted-foreground">
                        {source.section && <p>Section: {source.section}</p>}
                        {formatPages(source.page_start, source.page_end) && (
                          <p>{formatPages(source.page_start, source.page_end)}</p>
                        )}
                        {source.chunk_id != null && <p>Chunk ID: {source.chunk_id}</p>}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {result.retrieved_chunks && result.retrieved_chunks.length > 0 && (
              <Collapsible className="rounded-lg border border-border bg-card">
                <CollapsibleTrigger className="group flex w-full items-center justify-between gap-3 p-5 text-left">
                  <span className="text-sm font-medium text-foreground">
                    Show retrieved evidence ({result.retrieved_chunks.length})
                  </span>
                  <ChevronDown
                    className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180"
                    aria-hidden
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-4 border-t border-border p-5">
                    {result.retrieved_chunks.map((chunk, i) => (
                      <article
                        key={`${chunk.chunk_id ?? "c"}-${i}`}
                        className="rounded-md border border-border bg-muted/40 p-4"
                      >
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="rounded bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                            Source {i + 1}
                            {chunk.chunk_id != null ? ` · chunk ${chunk.chunk_id}` : ""}
                          </span>
                          {chunk.heading && (
                            <h3 className="font-serif text-base font-semibold text-foreground">
                              {chunk.heading}
                            </h3>
                          )}
                          {formatPages(chunk.page_start, chunk.page_end) && (
                            <span className="text-xs text-muted-foreground">
                              {formatPages(chunk.page_start, chunk.page_end)}
                            </span>
                          )}
                        </div>
                        {chunk.text && (
                          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                            {chunk.text}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-3xl px-6 pb-10">
        <p className="text-xs text-muted-foreground">
          This tool provides information from source documents only and is not a
          substitute for professional care.
        </p>
      </footer>
    </div>
  );
}
