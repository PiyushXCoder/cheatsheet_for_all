export default {
  lang: "cpp",
  id: "cpp-basics",
  title: "Syntax Basics",
  icon: "⚙️",
  group: "Language",
  order: 0,
  description: "The C++ skeleton, types, and I/O you need for DSA.",
  cards: [
    {
      title: "Program skeleton",
      items: [
        { desc: "Everything header + main", code: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // solve\n    return 0;\n}` },
        { desc: "Common aliases", code: `using ll = long long;\nusing pii = pair<int,int>;\nusing vi = vector<int>;` },
        { desc: "Constants", code: `const int INF = 1e9;\nconst ll LINF = 1e18;\nconst int MOD = 1e9 + 7;` },
      ],
    },
    {
      title: "Variables & types",
      items: [
        { desc: "Integer sizes", code: `int a = 5;        // 32-bit\nlong long b = 5;  // 64-bit, use for sums/products` },
        { desc: "auto (deduced)", code: `auto x = 3;       // int\nauto& r = v[0];   // reference, no copy` },
        { desc: "Structured bindings (C++17)", code: `auto [x, y] = make_pair(1, 2);\nfor (auto& [k, v] : mp) { }` },
        { desc: "constexpr / const", code: `constexpr int N = 1e5 + 5;\nconst int n = read();` },
      ],
    },
    {
      title: "Control flow",
      items: [
        { desc: "Range-based for", code: `for (int x : v) sum += x;\nfor (auto& x : v) x *= 2; // mutate` },
        { desc: "Classic for", code: `for (int i = 0; i < n; ++i) { }` },
        { desc: "Ternary / switch", code: `int m = a > b ? a : b;\nswitch (c) { case 'a': ...; break; default: ...; }` },
        { desc: "Loop control", code: `if (skip) continue;\nif (done) break;` },
      ],
    },
    {
      title: "Functions & lambdas",
      items: [
        { desc: "Function", code: `int add(int a, int b) { return a + b; }` },
        { desc: "Pass by reference (no copy)", code: `void solve(vector<int>& v) { v.push_back(1); }` },
        { desc: "Lambda", code: `auto sq = [](int x) { return x * x; };\nint r = sq(5);` },
        { desc: "Capturing lambda", code: `int t = 10;\nauto f = [&](int x) { return x + t; }; // by ref` },
        { desc: "Recursive lambda (C++14)", code: `function<int(int)> fib = [&](int n) {\n    return n < 2 ? n : fib(n-1) + fib(n-2);\n};` },
      ],
    },
    {
      title: "structs & sorting keys",
      items: [
        { desc: "Struct", code: `struct Point { int x, y; };\nPoint p{1, 2};` },
        { desc: "Comparator operator<", code: `struct P {\n    int x, y;\n    bool operator<(const P& o) const { return x < o.x; }\n};` },
        { desc: "tuple", code: `tuple<int,int,int> t{1,2,3};\nauto [a,b,c] = t;` },
      ],
    },
  ],
};
