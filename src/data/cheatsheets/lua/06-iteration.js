export default {
  lang: "lua",
  id: "lua-iteration",
  title: "Iteration & Higher-Order",
  icon: "🔁",
  group: "Language",
  order: 6,
  description: "pairs/ipairs and hand-rolled map/filter/reduce.",
  cards: [
    {
      title: "The two iterators",
      items: [
        { desc: "ipairs — array part, 1..n, stops at nil", code: `for i, v in ipairs(a) do end` },
        { desc: "pairs — all keys, any order", code: `for k, v in pairs(t) do end` },
        { desc: "Values only", code: `for _, v in ipairs(a) do end` },
        { desc: "Custom iterator (stateless)", code: `for i = 1, #a do end   -- often simplest & fastest` },
      ],
    },
    {
      title: "Map / filter / reduce (roll your own)",
      items: [
        { desc: "Map", code: `local function map(a, f)\n    local r = {}\n    for i, v in ipairs(a) do r[i] = f(v) end\n    return r\nend` },
        { desc: "Filter", code: `local function filter(a, pred)\n    local r = {}\n    for _, v in ipairs(a) do\n        if pred(v) then r[#r+1] = v end\n    end\n    return r\nend` },
        { desc: "Reduce", code: `local function reduce(a, f, acc)\n    for _, v in ipairs(a) do acc = f(acc, v) end\n    return acc\nend\nlocal sum = reduce(a, function(s, x) return s + x end, 0)` },
      ],
    },
    {
      title: "Search & test",
      items: [
        { desc: "Any / all", code: `local function any(a, p)\n    for _, v in ipairs(a) do if p(v) then return true end end\n    return false\nend` },
        { desc: "Find first match", code: `for i, v in ipairs(a) do\n    if pred(v) then return i, v end\nend` },
        { desc: "Count matches", code: `local c = 0\nfor _, v in ipairs(a) do if pred(v) then c = c + 1 end end` },
      ],
    },
    {
      title: "table library",
      items: [
        { desc: "insert / remove", code: `table.insert(a, x)\ntable.remove(a, i)` },
        { desc: "concat (join)", code: `table.concat(a, sep)` },
        { desc: "sort", code: `table.sort(a)` },
        { desc: "unpack / pack", code: `table.unpack(a)          -- a[1], a[2], ...\nlocal t = table.pack(...) -- t.n = count` },
        { desc: "move (copy range)", code: `table.move(src, 1, #src, 1, dst)` },
      ],
    },
  ],
};
