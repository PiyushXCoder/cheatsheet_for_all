import { Icon } from "./Icon";

export function Home({ languages, onSelectLang, onSelectAll }) {
  return (
    <div className="home">
      <section className="home-hero">
        <h1>Cheatsheet for all</h1>
        <p className="home-sub">
          Fast, searchable Data Structures &amp; Algorithms cheatsheets for Rust,
          C++, Python, Java &amp; Lua — with regex search, Vim keybindings, and
          a built-in LeetCode practice tracker.
        </p>
      </section>

      <section className="home-features">
        <div className="home-feat">
          <div className="home-feat-icon">
            <Icon name="package" size={24} />
          </div>
          <h3>Multiple Languages</h3>
          <p>
            Toggle between Rust, C++, Python, Java, and Lua instantly.
          </p>
        </div>
        <div className="home-feat">
          <div className="home-feat-icon">
            <Icon name="search" size={24} />
          </div>
          <h3>Smart Search</h3>
          <p>
            Regex-powered search with CSS Highlight API and Vim-style keyboard
            navigation.
          </p>
        </div>
        <div className="home-feat">
          <div className="home-feat-icon">
            <Icon name="target" size={24} />
          </div>
          <h3>Practice Tracker</h3>
          <p>
            Track your progress through the top 150 LeetCode questions. Sync to
            Google Drive with optional sign-in.
          </p>
        </div>
      </section>

      <section className="home-langs">
        {languages.map((lang) => (
          <button
            key={lang.id}
            className="home-lang-btn"
            onClick={() => onSelectLang(lang.id)}
          >
            <Icon name={lang.icon} size={18} />
            {lang.label}
          </button>
        ))}
      </section>

      <button className="home-cta" onClick={onSelectAll}>
        Browse All Cheatsheets
      </button>
    </div>
  );
}
