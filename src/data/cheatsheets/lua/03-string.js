export default {
  lang: "lua",
  id: "lua-string",
  title: "Strings",
  icon: "🔤",
  group: "Collections",
  order: 2,
  description: "Immutable strings + the powerful string library.",
  cards: [
    {
      title: "Create & convert",
      items: [
        { desc: "Literal (single/double/long)", code: `local s = "hi"\nlocal s = 'hi'\nlocal s = [[multi\nline]]` },
        { desc: "Number ↔ string", code: `local s = tostring(42)\nlocal n = tonumber("42")\nlocal h = tonumber("ff", 16)  -- base` },
        { desc: "Format", code: `string.format("%d-%s-%.2f", n, name, x)` },
        { desc: "Char ↔ code", code: `string.byte("A")   -- 65\nstring.char(65)    -- "A"` },
      ],
    },
    {
      title: "Inspect & access",
      items: [
        { desc: "Length", code: `local n = #s   -- or s:len()` },
        { desc: "Substring (1-based, inclusive)", code: `s:sub(2, 4)      -- chars 2..4\ns:sub(2)         -- from 2 to end\ns:sub(-3)        -- last 3` },
        { desc: "Nth character", code: `local c = s:sub(i, i)` },
        { desc: "Iterate bytes", code: `for i = 1, #s do local c = s:sub(i,i) end` },
      ],
    },
    {
      title: "Search & transform",
      items: [
        { desc: "Find (plain text)", code: `local i, j = s:find("lo", 1, true)  -- true = no pattern` },
        { desc: "Contains", code: `if s:find("x", 1, true) then end` },
        { desc: "Replace (gsub)", code: `local r, count = s:gsub("a", "b")` },
        { desc: "Upper / lower", code: `s:upper()   s:lower()` },
        { desc: "Trim (pattern)", code: `s = s:gsub("^%s+", ""):gsub("%s+$", "")` },
      ],
    },
    {
      title: "Patterns (Lua's regex-lite)",
      items: [
        { desc: "Classes", code: `%d digit  %a letter  %w alnum  %s space  . any` },
        { desc: "Match one", code: `local num = s:match("%d+")` },
        { desc: "Capture groups", code: `local k, v = s:match("(%w+)=(%w+)")` },
        { desc: "Iterate matches", code: `for word in s:gmatch("%a+") do end` },
      ],
    },
    {
      title: "Split & build",
      items: [
        { desc: "Split by delimiter", code: `local parts = {}\nfor tok in s:gmatch("[^,]+") do\n    parts[#parts+1] = tok\nend` },
        { desc: "Split whitespace tokens", code: `for w in s:gmatch("%S+") do end` },
        { desc: "Build efficiently (buffer)", code: `local buf = {}\nfor i = 1, n do buf[#buf+1] = tostring(i) end\nlocal out = table.concat(buf, " ")` },
      ],
    },
  ],
};
