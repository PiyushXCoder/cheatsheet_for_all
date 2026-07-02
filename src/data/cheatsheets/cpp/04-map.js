export default {
  lang: "cpp",
  id: "cpp-map",
  title: "map & unordered_map",
  icon: "🗺️",
  group: "Collections",
  order: 3,
  description: "Key-value stores: ordered (tree) vs hashed.",
  cards: [
    {
      title: "Which one?",
      items: [
        { desc: "unordered_map — O(1) avg, no order", code: `unordered_map<int,int> m; // hashing, fastest lookups` },
        { desc: "map — O(log n), sorted by key", code: `map<int,int> m; // ordered, supports range/floor/ceil` },
        { desc: "Declare with types", code: `unordered_map<string,int> freq;\nmap<int,vector<int>> adj;` },
      ],
    },
    {
      title: "Insert & update",
      items: [
        { desc: "Insert / overwrite", code: `m[key] = val;` },
        { desc: "Access auto-creates (value 0)", code: `m[key]++;   // counter idiom` },
        { desc: "Insert only if absent", code: `m.insert({key, val});\nm.emplace(key, val);` },
        { desc: "Erase", code: `m.erase(key);` },
        { desc: "Clear", code: `m.clear();` },
      ],
    },
    {
      title: "Lookup",
      items: [
        { desc: "Contains (C++20)", code: `if (m.contains(key)) { }` },
        { desc: "Contains (portable)", code: `if (m.count(key)) { }\nif (m.find(key) != m.end()) { }` },
        { desc: "Get with default", code: `int v = m.count(k) ? m[k] : -1;` },
        { desc: "Size / empty", code: `m.size(); m.empty();` },
      ],
    },
    {
      title: "Iterate",
      items: [
        { desc: "Structured bindings (C++17)", code: `for (auto& [k, v] : m) { }` },
        { desc: "Classic", code: `for (auto& p : m) { p.first; p.second; }` },
        { desc: "map iterates in sorted key order", code: `map<int,int> m;\nfor (auto& [k, v] : m) { } // ascending k` },
      ],
    },
    {
      title: "Ordered-map extras (map only)",
      items: [
        { desc: "Smallest / largest", code: `auto lo = m.begin();      // smallest key\nauto hi = prev(m.end());  // largest key` },
        { desc: "Ceil (first key ≥ x)", code: `auto it = m.lower_bound(x);` },
        { desc: "Floor (last key ≤ x)", code: `auto it = m.upper_bound(x);\nif (it != m.begin()) --it;` },
        { desc: "multimap (duplicate keys)", code: `multimap<int,int> mm;\nmm.insert({1, 10}); mm.insert({1, 20});` },
      ],
    },
  ],
};
