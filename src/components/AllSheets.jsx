import { cheatsheets } from "../data";
import { Card } from "./Card";

export function AllSheets() {
  return (
    <>
      {cheatsheets.map((sheet) => (
        <section className="all-sheet" key={sheet.id} id={`all-${sheet.id}`}>
          <h2 className="all-head">
            <span className="icon">{sheet.icon}</span>
            <span>{sheet.title}</span>
          </h2>
          {sheet.description && <p className="all-desc">{sheet.description}</p>}
          <div className="cards">
            {sheet.cards.map((c, i) => (
              <Card card={c} key={i} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
