import { CodeBlock } from "./CodeBlock";

// Render inline `code` spans inside description text.
function Inline({ text }) {
  if (!text) return null;
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((p, i) =>
    p.startsWith("`") && p.endsWith("`") ? (
      <code key={i}>{p.slice(1, -1)}</code>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

export function Card({ card }) {
  return (
    <section className="card">
      <h2>{card.title}</h2>
      {card.note && <p className="card-note">{card.note}</p>}
      <div className="items">
        {card.items.map((it, i) => (
          <div className="item" key={i}>
            {it.desc && (
              <div className="desc">
                <Inline text={it.desc} />
              </div>
            )}
            {it.code && <CodeBlock code={it.code} />}
          </div>
        ))}
      </div>
    </section>
  );
}
