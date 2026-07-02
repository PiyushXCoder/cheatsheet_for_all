export default {
  lang: "cpp",
  id: "cpp-patterns",
  title: "DSA Patterns",
  icon: "🧩",
  group: "Algorithms",
  order: 8,
  description: "Reusable templates for the classic interview patterns.",
  cards: [
    {
      title: "Two pointers",
      items: [
        { desc: "Opposite ends", code: `int l = 0, r = n - 1;\nwhile (l < r) {\n    if (a[l] + a[r] == target) break;\n    (a[l] + a[r] < target) ? ++l : --r;\n}` },
        { desc: "Fast/slow (cycle)", code: `int slow = 0, fast = 0;\nwhile (fast < n && nxt[fast] != -1) {\n    slow = nxt[slow];\n    fast = nxt[nxt[fast]];\n    if (slow == fast) break;\n}` },
      ],
    },
    {
      title: "Sliding window",
      items: [
        { desc: "Variable window", code: `int l = 0; ll sum = 0, best = 0;\nfor (int r = 0; r < n; ++r) {\n    sum += a[r];\n    while (sum > K) sum -= a[l++];\n    best = max(best, (ll)(r - l + 1));\n}` },
        { desc: "Fixed window of size k", code: `ll sum = 0;\nfor (int i = 0; i < n; ++i) {\n    sum += a[i];\n    if (i >= k) sum -= a[i - k];\n    if (i >= k - 1) best = max(best, sum);\n}` },
      ],
    },
    {
      title: "Prefix sum",
      items: [
        { desc: "Build", code: `vector<ll> pre(n + 1, 0);\nfor (int i = 0; i < n; ++i) pre[i+1] = pre[i] + a[i];` },
        { desc: "Range sum [l, r]", code: `ll s = pre[r + 1] - pre[l];` },
        { desc: "2D prefix", code: `pre[i+1][j+1] = a[i][j] + pre[i][j+1]\n              + pre[i+1][j] - pre[i][j];` },
      ],
    },
    {
      title: "Binary search on answer",
      items: [
        { desc: "Min feasible value", code: `int lo = 0, hi = 1e9;\nwhile (lo < hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (feasible(mid)) hi = mid;\n    else lo = mid + 1;\n}\n// lo = smallest feasible` },
      ],
    },
    {
      title: "Union-Find (DSU)",
      items: [
        { desc: "Struct with path compression", code: `struct DSU {\n    vector<int> p, r;\n    DSU(int n): p(n), r(n, 0) { iota(p.begin(), p.end(), 0); }\n    int find(int x){ return p[x]==x ? x : p[x]=find(p[x]); }\n    bool unite(int a, int b){\n        a=find(a); b=find(b);\n        if (a==b) return false;\n        if (r[a]<r[b]) swap(a,b);\n        p[b]=a; if (r[a]==r[b]) r[a]++;\n        return true;\n    }\n};` },
      ],
    },
    {
      title: "Memoization (top-down DP)",
      items: [
        { desc: "2D memo table", code: `vector<vector<int>> memo(n, vector<int>(m, -1));\nfunction<int(int,int)> dp = [&](int i, int j) -> int {\n    if (base) return 0;\n    int& res = memo[i][j];\n    if (res != -1) return res;\n    return res = /* transition */;\n};` },
      ],
    },
  ],
};
