export default {
  lang: "lua",
  id: "lua-array",
  title: "Tables as Arrays",
  icon: "📦",
  group: "Collections",
  order: 1,
  description: "Sequences (1-indexed tables) — Lua's list workhorse.",
  cards: [
    {
      title: "Create & init",
      items: [
        { desc: "Empty / literal", code: `local a = {}\nlocal a = {10, 20, 30}   -- a[1]==10` },
        { desc: "N copies of a value", code: `local a = {}\nfor i = 1, n do a[i] = 0 end` },
        { desc: "2D grid m×n", code: `local g = {}\nfor i = 1, m do\n    g[i] = {}\n    for j = 1, n do g[i][j] = 0 end\nend` },
        { desc: "Fill helper (table.move)", code: `local a = {}\ntable.move({0}, 1, 1, 1, a) -- rarely needed` },
      ],
    },
    {
      title: "Add & remove",
      items: [
        { desc: "Push / pop (back)", code: `table.insert(a, x)   -- push\nlocal last = table.remove(a)  -- pop` },
        { desc: "Or by length (faster)", code: `a[#a + 1] = x        -- push\nlocal last = a[#a]; a[#a] = nil` },
        { desc: "Insert / remove at index (O(n))", code: `table.insert(a, 2, 99)  -- shift right\ntable.remove(a, 2)      -- shift left` },
        { desc: "Append another array", code: `for _, v in ipairs(b) do a[#a+1] = v end` },
      ],
    },
    {
      title: "Access & inspect",
      items: [
        { desc: "Index (1-based!)", code: `local first = a[1]\nlocal last = a[#a]` },
        { desc: "Length", code: `local n = #a   -- valid only if no nil holes` },
        { desc: "Contains (linear)", code: `local function has(a, x)\n    for _, v in ipairs(a) do\n        if v == x then return true end\n    end\n    return false\nend` },
      ],
    },
    {
      title: "Iterate",
      items: [
        { desc: "ipairs (array order, stops at nil)", code: `for i, v in ipairs(a) do end` },
        { desc: "Index loop", code: `for i = 1, #a do local v = a[i] end` },
        { desc: "Reversed", code: `for i = #a, 1, -1 do local v = a[i] end` },
      ],
    },
    {
      title: "Common tricks",
      items: [
        { desc: "Reverse in place", code: `local i, j = 1, #a\nwhile i < j do\n    a[i], a[j] = a[j], a[i]\n    i, j = i + 1, j - 1\nend` },
        { desc: "Sum / max", code: `local s = 0\nfor _, v in ipairs(a) do s = s + v end\nlocal mx = math.max(table.unpack(a))` },
        { desc: "Join to string", code: `local s = table.concat(a, ",")` },
        { desc: "Copy (shallow)", code: `local b = {table.unpack(a)}` },
        { desc: "Swap", code: `a[i], a[j] = a[j], a[i]` },
      ],
    },
  ],
};
