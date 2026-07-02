export default {
  lang: "lua",
  id: "lua-map",
  title: "Tables as Maps & Sets",
  icon: "map",
  group: "Collections",
  order: 3,
  description: "The same table doubles as hash map and set.",
  cards: [
    {
      title: "Map (hash)",
      items: [
        { desc: "Create", code: `local m = {}\nlocal m = {apple = 3, pear = 5}` },
        { desc: "Set / get", code: `m[key] = val\nlocal v = m[key]   -- nil if absent` },
        { desc: "Any value as key", code: `m["str"] = 1\nm[42] = 2\nm[someTable] = 3   -- reference identity` },
        { desc: "Remove", code: `m[key] = nil` },
        { desc: "Get with default", code: `local v = m[key] or 0` },
      ],
    },
    {
      title: "Counter idiom",
      items: [
        { desc: "Count frequencies", code: `local freq = {}\nfor _, x in ipairs(a) do\n    freq[x] = (freq[x] or 0) + 1\nend` },
        { desc: "Group into buckets", code: `local groups = {}\nfor _, x in ipairs(a) do\n    local k = key(x)\n    groups[k] = groups[k] or {}\n    table.insert(groups[k], x)\nend` },
      ],
    },
    {
      title: "Lookup & iterate",
      items: [
        { desc: "Contains key", code: `if m[key] ~= nil then end` },
        { desc: "Iterate (order NOT guaranteed)", code: `for k, v in pairs(m) do end` },
        { desc: "Count entries (no # for maps!)", code: `local n = 0\nfor _ in pairs(m) do n = n + 1 end` },
        { desc: "Sorted iteration", code: `local keys = {}\nfor k in pairs(m) do keys[#keys+1] = k end\ntable.sort(keys)\nfor _, k in ipairs(keys) do local v = m[k] end` },
      ],
    },
    {
      title: "Set (table with true values)",
      items: [
        { desc: "Create", code: `local set = {}\nset[x] = true` },
        { desc: "Membership", code: `if set[x] then end` },
        { desc: "Remove", code: `set[x] = nil` },
        { desc: "From array", code: `local set = {}\nfor _, v in ipairs(a) do set[v] = true end` },
        { desc: "Dedup an array", code: `local seen, out = {}, {}\nfor _, v in ipairs(a) do\n    if not seen[v] then seen[v] = true; out[#out+1] = v end\nend` },
      ],
    },
  ],
};
