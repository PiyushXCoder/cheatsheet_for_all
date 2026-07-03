import { Icon } from "./Icon";

export function Home({
  languages,
  onSelectLang,
  onSelectAll,
  onSelectPractice,
}) {
  return (
    <div className="home">
      <div className="home-glow" aria-hidden="true" />
      <section className="home-hero">
        <span className="home-eyebrow">// DSA quick reference</span>
        <h1>
          Cheatsheet for <span className="home-grad">all</span>
        </h1>
        <p className="home-sub">
          A free, fast, searchable reference for Data Structures &amp;
          Algorithms. Copy-ready code snippets by topic across Rust, C++,
          Python, Java &amp; Lua — with regex search, Vim keybindings, and a
          built-in LeetCode practice tracker to record which problems you have
          solved.
        </p>
        <div className="home-hero-actions">
          <button className="home-cta" onClick={onSelectAll}>
            <Icon name="package" size={18} />
            Browse All Cheatsheets
          </button>
          <button className="home-cta home-cta-ghost" onClick={onSelectPractice}>
            <Icon name="target" size={18} />
            Start Practicing
          </button>
        </div>
      </section>

      <section className="home-features">
        <div className="home-feat">
          <div className="home-feat-icon">
            <Icon name="package" size={24} />
          </div>
          <h3>Multiple Languages</h3>
          <p>
            Toggle between Rust, C++, Python, Java, and Lua instantly. Every
            data structure and algorithm shown in idiomatic, copy-ready code.
          </p>
        </div>
        <div className="home-feat">
          <div className="home-feat-icon">
            <Icon name="search" size={24} />
          </div>
          <h3>Smart Search</h3>
          <p>
            Regex-powered search across every snippet, using the CSS Highlight
            API and Vim-style keyboard navigation for fast lookups.
          </p>
        </div>
        <div className="home-feat">
          <div className="home-feat-icon">
            <Icon name="target" size={24} />
          </div>
          <h3>Practice Tracker</h3>
          <p>
            Check off problems from the top 150 LeetCode questions as you solve
            them and track your progress over time.
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

      <section className="home-google">
        <div className="home-google-head">
          <Icon name="target" size={22} />
          <h2>Sign in with Google (optional)</h2>
        </div>
        <p className="home-google-lead">
          The app works fully without an account — your practice progress is
          saved locally in your browser. Signing in with Google is entirely
          optional and lets you sync that progress across your devices.
        </p>

        <div className="home-google-grid">
          <div className="home-google-card">
            <h3>What we access</h3>
            <ul>
              <li>
                <strong>Your name, email &amp; profile picture</strong> — shown
                in the app so you know which account is signed in.
              </li>
              <li>
                <strong>A private Google Drive AppData folder</strong> — a
                hidden folder, accessible only to this app, where your practice
                progress is stored.
              </li>
            </ul>
          </div>
          <div className="home-google-card">
            <h3>How we use it</h3>
            <ul>
              <li>
                Data is used <strong>only</strong> to display your account and
                restore your practice progress when you return.
              </li>
              <li>
                We never read your other Drive files, and we do not sell, share,
                or use your data for advertising, analytics, or tracking.
              </li>
            </ul>
          </div>
        </div>

        <p className="home-google-note">
          You can revoke access anytime from your{" "}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noreferrer"
          >
            Google Account permissions
          </a>{" "}
          page, or reset your data from the{" "}
          <button className="home-inline-link" onClick={onSelectPractice}>
            Practice
          </button>{" "}
          page.
        </p>
      </section>

      <footer className="home-footer">
        <a className="home-inline-link" href="/privacy">
          Privacy Policy
        </a>
        <span className="home-footer-sep">·</span>
        <a className="home-inline-link" href="/terms">
          Terms of Service
        </a>
      </footer>
    </div>
  );
}
