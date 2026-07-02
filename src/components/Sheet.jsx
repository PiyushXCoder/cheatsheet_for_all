import { Card } from "./Card";

export function Sheet({ sheet }) {
  if (!sheet) return <div className="empty">No cheatsheet selected.</div>;
  return (
    <>
      <div className="sheet-head">
        <h1>
          <span>{sheet.icon}</span>
          <span>{sheet.title}</span>
        </h1>
        {sheet.description && <p className="desc">{sheet.description}</p>}
      </div>
      <div className="cards">
        {sheet.cards.map((c, i) => (
          <Card card={c} key={i} />
        ))}
      </div>
    </>
  );
}
