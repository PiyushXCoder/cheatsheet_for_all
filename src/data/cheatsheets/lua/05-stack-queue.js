export default {
  lang: "lua",
  id: "lua-stack-queue",
  title: "Stack, Queue & Deque",
  icon: "stack",
  group: "Collections",
  order: 5,
  description: "Built from plain tables — Lua has no dedicated types.",
  cards: [
    {
      title: "Stack (LIFO)",
      items: [
        { desc: "Just a table", code: `local st = {}` },
        { desc: "Push / pop / top", code: `st[#st+1] = x        -- push\nlocal top = st[#st]  -- peek\nst[#st] = nil        -- pop` },
        { desc: "Or with table library", code: `table.insert(st, x)\nlocal x = table.remove(st)  -- pops last` },
        { desc: "Drain", code: `while #st > 0 do\n    local x = st[#st]; st[#st] = nil\nend` },
      ],
    },
    {
      title: "Queue (FIFO) — head/tail indices",
      items: [
        { desc: "O(1) amortized queue", code: `local q = {head = 1, tail = 0}\nlocal function push(q, x)\n    q.tail = q.tail + 1\n    q[q.tail] = x\nend\nlocal function pop(q)\n    local x = q[q.head]\n    q[q.head] = nil\n    q.head = q.head + 1\n    return x\nend` },
        { desc: "Empty check", code: `local function empty(q) return q.head > q.tail end` },
        { desc: "Avoid table.remove(t,1) — it's O(n)", code: `-- shifting the whole array each pop is slow` },
      ],
    },
    {
      title: "Deque (double-ended)",
      items: [
        { desc: "Two moving pointers", code: `local dq = {head = 1, tail = 0}\nlocal function pushBack(dq, x)  dq.tail = dq.tail + 1; dq[dq.tail] = x end\nlocal function pushFront(dq, x) dq.head = dq.head - 1; dq[dq.head] = x end` },
        { desc: "Pop both ends", code: `local function popBack(dq)\n    local x = dq[dq.tail]; dq[dq.tail] = nil; dq.tail = dq.tail - 1; return x\nend\nlocal function popFront(dq)\n    local x = dq[dq.head]; dq[dq.head] = nil; dq.head = dq.head + 1; return x\nend` },
      ],
    },
    {
      title: "Monotonic deque (window max)",
      items: [
        { desc: "Store indices, drop smaller", code: `local dq = {head = 1, tail = 0}\nfor i = 1, n do\n    while dq.tail >= dq.head and a[dq[dq.tail]] <= a[i] do\n        dq.tail = dq.tail - 1\n    end\n    dq.tail = dq.tail + 1; dq[dq.tail] = i\n    if dq[dq.head] <= i - k then dq.head = dq.head + 1 end\n    if i >= k then ans[#ans+1] = a[dq[dq.head]] end\nend` },
      ],
    },
  ],
};
