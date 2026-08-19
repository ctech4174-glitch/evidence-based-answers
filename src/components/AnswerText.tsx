interface AnswerTextProps {
  answer: string;
}

/**
 * Renders the backend answer verbatim, only preserving paragraph and
 * bullet structure. No text is rewritten or trimmed of meaning.
 */
export function AnswerText({ answer }: AnswerTextProps) {
  const blocks = answer.split(/\n{2,}/);

  return (
    <div className="space-y-4 text-base leading-7 text-foreground">
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n");
        const isList = lines.every((line) => /^\s*([-*•]|\d+[.)])\s+/.test(line));

        if (isList) {
          return (
            <ul key={blockIndex} className="list-disc space-y-2 pl-5">
              {lines.map((line, i) => (
                <li key={i}>{line.replace(/^\s*([-*•]|\d+[.)])\s+/, "")}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={blockIndex} className="whitespace-pre-line">
            {block}
          </p>
        );
      })}
    </div>
  );
}
