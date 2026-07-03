import { memo, useMemo, useState } from "react";
import hljs from "highlight.js/lib/core";
import rust from "highlight.js/lib/languages/rust";
import cpp from "highlight.js/lib/languages/cpp";
import lua from "highlight.js/lib/languages/lua";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";

hljs.registerLanguage("rust", rust);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("lua", lua);
hljs.registerLanguage("python", python);
hljs.registerLanguage("java", java);

const KNOWN = { rust: true, cpp: true, lua: true, python: true, java: true };

// Memoized: props (code, lang) are stable data refs, so this never re-renders.
// Critical — a re-render re-applies dangerouslySetInnerHTML, rebuilding the code
// text nodes and collapsing any CSS search-highlight Ranges pointing into them.
export const CodeBlock = memo(function CodeBlock({ code, lang = "rust" }) {
  const hl = KNOWN[lang] ? lang : "rust";
  const html = useMemo(
    () => hljs.highlight(code, { language: hl }).value,
    [code, hl],
  );
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };

  return (
    <div className="code-wrap">
      <button
        className={"copy-btn" + (copied ? " copied" : "")}
        onClick={copy}
        title="Copy"
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
      <pre className="code">
        <code
          className={"hljs language-" + hl}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </div>
  );
});
