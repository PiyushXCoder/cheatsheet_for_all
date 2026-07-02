export default {
  lang: "lua",
  id: "lua-basics",
  title: "Syntax Basics",
  icon: "⚙️",
  group: "Language",
  order: 0,
  description: "Lua fundamentals (5.3+) — note: tables are 1-indexed!",
  cards: [
    {
      title: "Variables & types",
      items: [
        { desc: "Local (always prefer local)", code: `local x = 5\nlocal a, b = 1, 2` },
        { desc: "Types", code: `nil, boolean, number, string, table, function` },
        { desc: "Integers vs floats (5.3+)", code: `local i = 5      -- integer\nlocal f = 5.0    -- float\nmath.type(i)     -- "integer"` },
        { desc: "nil = absent; only nil & false are falsy", code: `if x ~= nil then end\nif not ok then end  -- 0 and "" are TRUTHY` },
      ],
    },
    {
      title: "Operators",
      items: [
        { desc: "Arithmetic", code: `+ - * /   // (floor div)   % (mod)   ^ (power)` },
        { desc: "Comparison / not-equal", code: `== ~= < <= > >=   -- note: ~= not !=` },
        { desc: "Logical", code: `and  or  not\nlocal y = x or default   -- nil-coalesce idiom` },
        { desc: "Concatenate strings", code: `local s = "a" .. "b" .. tostring(n)` },
        { desc: "Length (# operator)", code: `#t   -- array length\n#s   -- string length` },
      ],
    },
    {
      title: "Control flow",
      items: [
        { desc: "if / elseif / else", code: `if a > b then\n    -- ...\nelseif a == b then\n    -- ...\nelse\n    -- ...\nend` },
        { desc: "Numeric for (inclusive!)", code: `for i = 1, n do end        -- 1..n\nfor i = 1, n, 2 do end     -- step 2\nfor i = n, 1, -1 do end    -- reverse` },
        { desc: "while / repeat", code: `while cond do end\nrepeat ... until cond   -- do-while` },
        { desc: "break (no continue in Lua)", code: `for i = 1, n do\n    if skip then goto cont end\n    -- ...\n    ::cont::\nend` },
      ],
    },
    {
      title: "Functions",
      items: [
        { desc: "Definition", code: `local function add(a, b)\n    return a + b\nend` },
        { desc: "Multiple return values", code: `local function minmax(t)\n    return math.min(table.unpack(t)),\n           math.max(table.unpack(t))\nend\nlocal lo, hi = minmax(t)` },
        { desc: "Varargs", code: `local function sum(...)\n    local s = 0\n    for _, v in ipairs({...}) do s = s + v end\n    return s\nend` },
        { desc: "Closures", code: `local function counter()\n    local n = 0\n    return function() n = n + 1; return n end\nend` },
      ],
    },
    {
      title: "I/O basics",
      items: [
        { desc: "Print", code: `print("hello", 42)   -- tab-separated + newline` },
        { desc: "Formatted", code: `print(string.format("%d %.2f", n, x))\nio.write("no newline")` },
        { desc: "Read a line / number", code: `local line = io.read("l")\nlocal n = io.read("n")   -- reads a number` },
      ],
    },
  ],
};
