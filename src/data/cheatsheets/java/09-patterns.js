export default {
  lang: "java",
  id: "java-patterns",
  title: "DSA Patterns",
  icon: "🧩",
  group: "Algorithms",
  order: 8,
  description: "Reusable templates for the classic interview patterns.",
  cards: [
    {
      title: "Two pointers",
      items: [
        { desc: "Opposite ends", code: `int l = 0, r = n - 1;\nwhile (l < r) {\n    int sum = a[l] + a[r];\n    if (sum == target) break;\n    if (sum < target) l++; else r--;\n}` },
        { desc: "Fast / slow (cycle)", code: `int slow = 0, fast = 0;\nwhile (fast < n && next[fast] != -1) {\n    slow = next[slow];\n    fast = next[next[fast]];\n    if (slow == fast) break;\n}` },
      ],
    },
    {
      title: "Sliding window",
      items: [
        { desc: "Variable window", code: `int l = 0; long sum = 0, best = 0;\nfor (int r = 0; r < n; r++) {\n    sum += a[r];\n    while (sum > K) sum -= a[l++];\n    best = Math.max(best, r - l + 1);\n}` },
        { desc: "Fixed window of size k", code: `long sum = 0, best = Long.MIN_VALUE;\nfor (int i = 0; i < n; i++) {\n    sum += a[i];\n    if (i >= k) sum -= a[i - k];\n    if (i >= k - 1) best = Math.max(best, sum);\n}` },
      ],
    },
    {
      title: "Prefix sum",
      items: [
        { desc: "Build", code: `long[] pre = new long[n + 1];\nfor (int i = 0; i < n; i++) pre[i + 1] = pre[i] + a[i];` },
        { desc: "Range sum [l, r]", code: `long s = pre[r + 1] - pre[l];` },
        { desc: "2D prefix", code: `pre[i+1][j+1] = a[i][j] + pre[i][j+1]\n             + pre[i+1][j] - pre[i][j];` },
      ],
    },
    {
      title: "Binary search on answer",
      items: [
        { desc: "Min feasible value", code: `int lo = 0, hi = (int) 1e9;\nwhile (lo < hi) {\n    int mid = lo + (hi - lo) / 2;\n    if (feasible(mid)) hi = mid;\n    else lo = mid + 1;\n}\n// lo = smallest feasible` },
      ],
    },
    {
      title: "Union-Find (DSU)",
      items: [
        { desc: "Class with path compression", code: `class DSU {\n    int[] p, r;\n    DSU(int n) {\n        p = new int[n]; r = new int[n];\n        for (int i = 0; i < n; i++) p[i] = i;\n    }\n    int find(int x) {\n        return p[x] == x ? x : (p[x] = find(p[x]));\n    }\n    boolean union(int a, int b) {\n        a = find(a); b = find(b);\n        if (a == b) return false;\n        if (r[a] < r[b]) { int t = a; a = b; b = t; }\n        p[b] = a; if (r[a] == r[b]) r[a]++;\n        return true;\n    }\n}` },
      ],
    },
    {
      title: "Memoization (top-down DP)",
      items: [
        { desc: "2D memo table", code: `int[][] memo = new int[n][m];\nfor (int[] row : memo) Arrays.fill(row, -1);` },
        { desc: "Recursive dp", code: `int dp(int i, int j) {\n    if (base) return 0;\n    if (memo[i][j] != -1) return memo[i][j];\n    int res = /* transition */;\n    return memo[i][j] = res;\n}` },
      ],
    },
  ],
};
