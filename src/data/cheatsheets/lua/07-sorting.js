export default {
  lang: "lua",
  id: "lua-sorting",
  title: "Sorting & Searching",
  icon: "chart",
  group: "Algorithms",
  order: 7,
  description: "table.sort with comparators + binary search.",
  cards: [
    {
      title: "Sort",
      items: [
        { desc: "Ascending (in place)", code: `table.sort(a)` },
        { desc: "Descending", code: `table.sort(a, function(x, y) return x > y end)` },
        { desc: "Comparator: return true if x before y", code: `table.sort(a, function(x, y) return x < y end)` },
        { desc: "Note: table.sort is NOT stable", code: `-- add index as tiebreaker if stability needed` },
      ],
    },
    {
      title: "Sort structured data",
      items: [
        { desc: "Array of tables by field", code: `table.sort(people, function(x, y)\n    return x.age < y.age\nend)` },
        { desc: "Multi-key (age asc, name asc)", code: `table.sort(a, function(x, y)\n    if x.age ~= y.age then return x.age < y.age end\n    return x.name < y.name\nend)` },
        { desc: "Sort pairs {a, b} by first", code: `table.sort(pairs_, function(x, y) return x[1] < y[1] end)` },
        { desc: "Stable via index tiebreak", code: `for i, v in ipairs(a) do v._i = i end\ntable.sort(a, function(x, y)\n    if x.k ~= y.k then return x.k < y.k end\n    return x._i < y._i\nend)` },
      ],
    },
    {
      title: "Binary search (sorted array)",
      items: [
        { desc: "Exists?", code: `local function bsearch(a, x)\n    local lo, hi = 1, #a\n    while lo <= hi do\n        local mid = (lo + hi) // 2\n        if a[mid] == x then return mid\n        elseif a[mid] < x then lo = mid + 1\n        else hi = mid - 1 end\n    end\n    return nil\nend` },
        { desc: "Lower bound (first index ≥ x)", code: `local function lowerBound(a, x)\n    local lo, hi = 1, #a + 1\n    while lo < hi do\n        local mid = (lo + hi) // 2\n        if a[mid] < x then lo = mid + 1 else hi = mid end\n    end\n    return lo\nend` },
      ],
    },
    {
      title: "Handy",
      items: [
        { desc: "Min / max of array", code: `local mn = math.min(table.unpack(a))\nlocal mx = math.max(table.unpack(a))` },
        { desc: "Is sorted?", code: `local function sorted(a)\n    for i = 2, #a do if a[i] < a[i-1] then return false end end\n    return true\nend` },
      ],
    },
  ],
};
