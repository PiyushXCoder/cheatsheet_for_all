import { useMemo, useState } from "react";
import hljs from "highlight.js/lib/core";
import rust from "highlight.js/lib/languages/rust";

hljs.registerLanguage("rust", rust);

export function CodeBlock({ code }) {
  const html = useMemo(
    () => hljs.highlight(code, { language: "rust" }).value,
    [code],
  );
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };

  return (
    <pre className="code">
      <button
        className={"copy-btn" + (copied ? " copied" : "")}
        onClick={copy}
        title="Copy"
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
      <code
        className="hljs language-rust"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </pre>
  );
}
