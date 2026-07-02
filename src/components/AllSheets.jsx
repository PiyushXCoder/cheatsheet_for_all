import { Masonry } from "./Masonry";
import { Icon } from "./Icon";

export function AllSheets({ cheatsheets }) {
  return (
    <>
      {cheatsheets.map((sheet) => (
        <section className="all-sheet" key={sheet.id} id={`all-${sheet.id}`}>
          <h2 className="all-head">
            <Icon name={sheet.icon} size={36} />
            <span>{sheet.title}</span>
          </h2>
          {sheet.description && <p className="all-desc">{sheet.description}</p>}
          <Masonry cards={sheet.cards} lang={sheet.lang} />
        </section>
      ))}
    </>
  );
}
