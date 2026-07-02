export default {
  id: "patterns",
  title: "DSA Patterns",
  icon: "puzzle",
  group: "Algorithms",
  order: 8,
  description: "Ready-to-adapt templates for the classic techniques.",
  cards: [
    {
      title: "Two pointers",
      items: [
        { desc: "Opposite ends (sorted)", code: `let (mut l, mut r) = (0, v.len() - 1);\nwhile l < r {\n    let sum = v[l] + v[r];\n    if sum == target { break; }\n    else if sum < target { l += 1; }\n    else { r -= 1; }\n}` },
      ],
    },
    {
      title: "Sliding window",
      items: [
        { desc: "Variable window", code: `let (mut l, mut sum, mut best) = (0, 0, 0);\nfor r in 0..v.len() {\n    sum += v[r];\n    while sum > k {\n        sum -= v[l];\n        l += 1;\n    }\n    best = best.max(r - l + 1);\n}` },
      ],
    },
    {
      title: "Prefix sum",
      items: [
        { desc: "Build + range query", code: `let mut pre = vec![0i64; n + 1];\nfor i in 0..n { pre[i + 1] = pre[i] + v[i] as i64; }\nlet range = pre[r + 1] - pre[l]; // sum v[l..=r]` },
      ],
    },
    {
      title: "Binary search on answer",
      items: [
        { desc: "Smallest feasible value", code: `let (mut lo, mut hi) = (0i64, 1e18 as i64);\nwhile lo < hi {\n    let mid = lo + (hi - lo) / 2;\n    if feasible(mid) { hi = mid; }\n    else { lo = mid + 1; }\n}\n// lo == answer` },
      ],
    },
    {
      title: "Union-Find (DSU)",
      items: [
        { desc: "Path compression + union", code: `struct Dsu { p: Vec<usize> }\nimpl Dsu {\n    fn new(n: usize) -> Self { Self { p: (0..n).collect() } }\n    fn find(&mut self, x: usize) -> usize {\n        if self.p[x] != x { self.p[x] = self.find(self.p[x]); }\n        self.p[x]\n    }\n    fn union(&mut self, a: usize, b: usize) {\n        let (ra, rb) = (self.find(a), self.find(b));\n        if ra != rb { self.p[ra] = rb; }\n    }\n}` },
      ],
    },
    {
      title: "Memoization (DP)",
      items: [
        { desc: "HashMap memo", code: `fn solve(n: u64, memo: &mut HashMap<u64, u64>) -> u64 {\n    if n < 2 { return n; }\n    if let Some(&v) = memo.get(&n) { return v; }\n    let r = solve(n - 1, memo) + solve(n - 2, memo);\n    memo.insert(n, r);\n    r\n}` },
      ],
    },
  ],
};
