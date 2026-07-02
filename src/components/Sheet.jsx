import { Masonry } from "./Masonry";
import { Icon } from "./Icon";

export function Sheet({ sheet }) {
  if (!sheet) return <div className="empty">No cheatsheet selected.</div>;
  return (
    <>
      <div className="sheet-head">
        <h1>
          <Icon name={sheet.icon} size={44} />
          <span>{sheet.title}</span>
        </h1>
        {sheet.description && <p className="desc">{sheet.description}</p>}
      </div>
      <Masonry cards={sheet.cards} lang={sheet.lang} />
    </>
  );
}
