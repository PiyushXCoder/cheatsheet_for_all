export default {
  lang: "lua",
  id: "lua-io",
  title: "Competitive I/O",
  icon: "⌨️",
  group: "I/O & Misc",
  order: 12,
  description: "Fast stdin/stdout patterns for judges.",
  cards: [
    {
      title: "Reading input",
      items: [
        { desc: "One line", code: `local line = io.read("l")   -- "l" = line, no newline` },
        { desc: "One number", code: `local n = io.read("n")` },
        { desc: "All of stdin", code: `local all = io.read("a")` },
        { desc: "Two ints on a line", code: `local a, b = io.read("n", "n")` },
        { desc: "Iterate all lines", code: `for line in io.lines() do end` },
      ],
    },
    {
      title: "Parsing a line into numbers",
      items: [
        { desc: "Split line to number array", code: `local a = {}\nfor tok in line:gmatch("%S+") do\n    a[#a+1] = tonumber(tok)\nend` },
        { desc: "Read n then n numbers", code: `local n = io.read("n")\nlocal a = {}\nfor i = 1, n do a[i] = io.read("n") end` },
        { desc: "Read a grid", code: `local m, n = io.read("n", "n")\nlocal g = {}\nfor i = 1, m do g[i] = io.read("l") end` },
      ],
    },
    {
      title: "Writing output",
      items: [
        { desc: "Print (tab-sep + newline)", code: `print(a, b)` },
        { desc: "No trailing newline", code: `io.write(x)\nio.write(x, "\\n")` },
        { desc: "Formatted", code: `io.write(string.format("%d %.3f\\n", n, x))` },
        { desc: "Space-separated array", code: `print(table.concat(a, " "))` },
        { desc: "Yes / No", code: `print(ok and "YES" or "NO")` },
      ],
    },
    {
      title: "Speed tips",
      items: [
        { desc: "Buffer output, write once", code: `local buf = {}\nfor i = 1, n do buf[#buf+1] = tostring(ans[i]) end\nio.write(table.concat(buf, "\\n"), "\\n")` },
        { desc: "localize hot functions", code: `local insert = table.insert\nlocal floor = math.floor  -- fewer global lookups` },
        { desc: "Read all, then tokenize (fastest)", code: `local data = io.read("a")\nlocal it = data:gmatch("%S+")\nlocal function nextInt() return tonumber(it()) end` },
      ],
    },
  ],
};
