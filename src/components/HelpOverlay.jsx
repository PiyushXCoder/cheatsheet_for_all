const BINDINGS = [
  ["/", "Focus search"],
  ["s", "Toggle search box (small screens)"],
  ["Enter / n", "Next match"],
  ["Shift+Enter / N", "Previous match"],
  ["j / k", "Scroll down / up"],
  ["d / u", "Half page down / up"],
  ["g g / G", "Top / bottom"],
  ["[ / ]", "Previous / next cheatsheet"],
  ["Ctrl+Shift+j / k", "Jump to next / previous topic"],
  ["1 – 9", "Jump to Nth cheatsheet"],
  ["Space then o", "Focus sidebar (then j/k, Enter to open)"],
  ["Space then e", "Toggle sidebar"],
  ["t", "Toggle light / dark theme"],
  ["w", "Toggle word wrap in code blocks"],
  ["p", "Toggle Practice page"],
  ["?", "Toggle this help"],
  ["Esc", "Blur search / close help"],
];

export function HelpOverlay({ onClose }) {
  return (
    <div className="help-overlay" onClick={onClose}>
      <div className="help-box" onClick={(e) => e.stopPropagation()}>
        <h3>⌨ Keybindings</h3>
        {BINDINGS.map(([k, d]) => (
          <div className="row" key={k}>
            <span>{d}</span>
            <kbd>{k}</kbd>
          </div>
        ))}
        <p className="hint">
          Regex search: toggle <kbd>.*</kbd> in the search bar. Click a match
          count to jump. Press <kbd>Esc</kbd> to close.
        </p>
      </div>
    </div>
  );
}
