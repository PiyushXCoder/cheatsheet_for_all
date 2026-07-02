export default {
  lang: "cpp",
  id: "cpp-io",
  title: "Competitive I/O",
  icon: "⌨️",
  group: "I/O & Misc",
  order: 12,
  description: "Fast input/output patterns for judges.",
  cards: [
    {
      title: "Fast I/O setup",
      items: [
        { desc: "Untie & sync off (top of main)", code: `ios::sync_with_stdio(false);\ncin.tie(nullptr);` },
        { desc: "Newline (avoid endl in loops)", code: `cout << x << "\\n"; // endl flushes = slow` },
        { desc: "Fixed float precision", code: `cout << fixed << setprecision(6) << x;` },
      ],
    },
    {
      title: "Reading input",
      items: [
        { desc: "Single / multiple values", code: `int n; cin >> n;\nint a, b; cin >> a >> b;` },
        { desc: "Array of n", code: `vector<int> v(n);\nfor (auto& x : v) cin >> x;` },
        { desc: "Until EOF", code: `int x;\nwhile (cin >> x) { /* ... */ }` },
        { desc: "Whole line", code: `string line;\ngetline(cin, line);` },
        { desc: "Line after cin >>", code: `cin >> n;\ncin.ignore(); // eat leftover newline\ngetline(cin, line);` },
      ],
    },
    {
      title: "Writing output",
      items: [
        { desc: "Space-separated", code: `for (int i = 0; i < n; ++i)\n    cout << v[i] << " \\n"[i == n-1];` },
        { desc: "Yes/No", code: `cout << (ok ? "YES" : "NO") << "\\n";` },
        { desc: "Join with delimiter", code: `for (int i = 0; i < n; ++i) {\n    if (i) cout << ' ';\n    cout << v[i];\n}\ncout << "\\n";` },
      ],
    },
    {
      title: "Multiple test cases",
      items: [
        { desc: "Standard T loop", code: `int t; cin >> t;\nwhile (t--) {\n    solve();\n}` },
      ],
    },
    {
      title: "Handy macros & tips",
      items: [
        { desc: "Common shorthands", code: `#define all(x) (x).begin(), (x).end()\n#define sz(x) (int)(x).size()\nsort(all(v));` },
        { desc: "Debug (compile-time toggle)", code: `#ifdef LOCAL\n  #define dbg(x) cerr << #x << " = " << x << "\\n"\n#else\n  #define dbg(x)\n#endif` },
      ],
    },
  ],
};
