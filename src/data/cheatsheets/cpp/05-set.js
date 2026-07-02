export default {
  lang: "cpp",
  id: "cpp-set",
  title: "set & unordered_set",
  icon: "target",
  group: "Collections",
  order: 4,
  description: "Unique collections: ordered (tree) vs hashed.",
  cards: [
    {
      title: "Which one?",
      items: [
        { desc: "unordered_set — O(1) avg", code: `unordered_set<int> s; // fast membership` },
        { desc: "set — O(log n), sorted", code: `set<int> s; // ordered, min/max, range queries` },
        { desc: "multiset — duplicates allowed", code: `multiset<int> ms; // keeps count, sorted` },
      ],
    },
    {
      title: "Modify",
      items: [
        { desc: "Insert", code: `s.insert(x);` },
        { desc: "Erase by value", code: `s.erase(x);` },
        { desc: "Erase one (multiset)", code: `ms.erase(ms.find(x)); // erase(x) removes ALL` },
        { desc: "Clear", code: `s.clear();` },
      ],
    },
    {
      title: "Query",
      items: [
        { desc: "Membership", code: `if (s.count(x)) { }\nif (s.contains(x)) { } // C++20` },
        { desc: "Size / empty", code: `s.size(); s.empty();` },
        { desc: "Count (multiset)", code: `int c = ms.count(x);` },
      ],
    },
    {
      title: "Ordered extras (set / multiset)",
      items: [
        { desc: "Min / max", code: `int lo = *s.begin();\nint hi = *s.rbegin();` },
        { desc: "Ceil (first ≥ x)", code: `auto it = s.lower_bound(x);` },
        { desc: "Floor (last ≤ x)", code: `auto it = s.upper_bound(x);\nif (it != s.begin()) { --it; /* *it */ }` },
        { desc: "Iterate sorted", code: `for (int x : s) { } // ascending` },
      ],
    },
    {
      title: "Common uses",
      items: [
        { desc: "Dedup a vector", code: `set<int> s(v.begin(), v.end());\nvector<int> u(s.begin(), s.end());` },
        { desc: "Seen-before check", code: `if (!seen.insert(x).second) { /* duplicate */ }` },
        { desc: "Sliding-window max (multiset)", code: `ms.insert(a[r]);\nms.erase(ms.find(a[l]));\nint mx = *ms.rbegin();` },
      ],
    },
  ],
};
