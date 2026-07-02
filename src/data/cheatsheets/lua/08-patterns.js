export default {
  lang: "lua",
  id: "lua-patterns",
  title: "DSA Patterns",
  icon: "🧩",
  group: "Algorithms",
  order: 8,
  description: "Classic templates in Lua, including a binary heap.",
  cards: [
    {
      title: "Two pointers",
      items: [
        { desc: "Opposite ends", code: `local l, r = 1, #a\nwhile l < r do\n    local s = a[l] + a[r]\n    if s == target then break\n    elseif s < target then l = l + 1\n    else r = r - 1 end\nend` },
      ],
    },
    {
      title: "Sliding window",
      items: [
        { desc: "Variable window", code: `local l, sum, best = 1, 0, 0\nfor r = 1, n do\n    sum = sum + a[r]\n    while sum > K do sum = sum - a[l]; l = l + 1 end\n    best = math.max(best, r - l + 1)\nend` },
      ],
    },
    {
      title: "Prefix sum",
      items: [
        { desc: "Build (1-indexed)", code: `local pre = {[0] = 0}\nfor i = 1, n do pre[i] = pre[i-1] + a[i] end` },
        { desc: "Range sum [l, r]", code: `local s = pre[r] - pre[l-1]` },
      ],
    },
    {
      title: "Binary heap (min-heap)",
      items: [
        { desc: "Lua has no heap — build one", code: `local Heap = {}\nHeap.__index = Heap\nfunction Heap.new() return setmetatable({}, Heap) end\nfunction Heap:push(x)\n    local h = self; h[#h+1] = x\n    local i = #h\n    while i > 1 and h[i] < h[i//2] do\n        h[i], h[i//2] = h[i//2], h[i]; i = i // 2\n    end\nend\nfunction Heap:pop()\n    local h = self; local top = h[1]; local n = #h\n    h[1] = h[n]; h[n] = nil; n = n - 1\n    local i = 1\n    while true do\n        local l, r, s = 2*i, 2*i+1, i\n        if l <= n and h[l] < h[s] then s = l end\n        if r <= n and h[r] < h[s] then s = r end\n        if s == i then break end\n        h[i], h[s] = h[s], h[i]; i = s\n    end\n    return top\nend` },
      ],
    },
    {
      title: "Union-Find (DSU)",
      items: [
        { desc: "With path compression", code: `local function makeDSU(n)\n    local p = {}\n    for i = 1, n do p[i] = i end\n    local function find(x)\n        while p[x] ~= x do p[x] = p[p[x]]; x = p[x] end\n        return x\n    end\n    local function union(a, b) p[find(a)] = find(b) end\n    return find, union\nend` },
      ],
    },
    {
      title: "Memoization (top-down DP)",
      items: [
        { desc: "Table keyed by state", code: `local memo = {}\nlocal function dp(i)\n    if i <= 0 then return 0 end\n    if memo[i] then return memo[i] end\n    memo[i] = math.max(dp(i-1), dp(i-2) + a[i])\n    return memo[i]\nend` },
      ],
    },
  ],
};
