export default {
  lang: "python",
  id: "py-patterns",
  title: "DSA Patterns",
  icon: "🧩",
  group: "Algorithms",
  order: 8,
  description: "Reusable templates for the classic interview patterns.",
  cards: [
    {
      title: "Two pointers",
      items: [
        { desc: "Opposite ends", code: `l, r = 0, len(a) - 1\nwhile l < r:\n    s = a[l] + a[r]\n    if s == target: break\n    if s < target: l += 1\n    else: r -= 1` },
        { desc: "Fast / slow (cycle)", code: `slow = fast = head\nwhile fast and fast.next:\n    slow = slow.next\n    fast = fast.next.next\n    if slow is fast: break` },
      ],
    },
    {
      title: "Sliding window",
      items: [
        { desc: "Variable (longest <= K)", code: `l = 0; total = 0; best = 0\nfor r, x in enumerate(a):\n    total += x\n    while total > K:\n        total -= a[l]; l += 1\n    best = max(best, r - l + 1)` },
        { desc: "Fixed size k", code: `total = 0; best = 0\nfor i, x in enumerate(a):\n    total += x\n    if i >= k: total -= a[i - k]\n    if i >= k - 1: best = max(best, total)` },
      ],
    },
    {
      title: "Prefix sum",
      items: [
        { desc: "Build", code: `pre = [0] * (n + 1)\nfor i, x in enumerate(a):\n    pre[i + 1] = pre[i] + x` },
        { desc: "Range sum [l, r]", code: `s = pre[r + 1] - pre[l]` },
        { desc: "Subarray sum == k", code: `from collections import defaultdict\ncnt = defaultdict(int); cnt[0] = 1\ncur = ans = 0\nfor x in a:\n    cur += x\n    ans += cnt[cur - k]\n    cnt[cur] += 1` },
      ],
    },
    {
      title: "Binary search on answer",
      items: [
        { desc: "Min feasible value", code: `lo, hi = 0, 10**9\nwhile lo < hi:\n    mid = (lo + hi) // 2\n    if feasible(mid): hi = mid\n    else: lo = mid + 1\n# lo = smallest feasible` },
        { desc: "Max feasible value", code: `lo, hi = 0, 10**9\nwhile lo < hi:\n    mid = (lo + hi + 1) // 2\n    if feasible(mid): lo = mid\n    else: hi = mid - 1` },
      ],
    },
    {
      title: "Union-Find (DSU)",
      items: [
        { desc: "Class with path compression", code: `class DSU:\n    def __init__(self, n):\n        self.p = list(range(n))\n        self.r = [0] * n\n    def find(self, x):\n        while self.p[x] != x:\n            self.p[x] = self.p[self.p[x]]\n            x = self.p[x]\n        return x\n    def union(self, a, b):\n        a, b = self.find(a), self.find(b)\n        if a == b: return False\n        if self.r[a] < self.r[b]: a, b = b, a\n        self.p[b] = a\n        if self.r[a] == self.r[b]: self.r[a] += 1\n        return True` },
      ],
    },
    {
      title: "Memoization (top-down DP)",
      items: [
        { desc: "@cache (unbounded)", code: `from functools import cache\n@cache\ndef dp(i, j):\n    if i == n: return 0\n    return min(dp(i+1, j), dp(i, j+1))` },
        { desc: "@lru_cache(maxsize)", code: `from functools import lru_cache\n@lru_cache(maxsize=None)\ndef dp(i): ...` },
        { desc: "Manual dict memo", code: `memo = {}\ndef dp(state):\n    if state in memo: return memo[state]\n    memo[state] = compute(state)\n    return memo[state]` },
      ],
    },
  ],
};
