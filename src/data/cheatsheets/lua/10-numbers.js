export default {
  lang: "lua",
  id: "lua-numbers",
  title: "Numbers, Math & Bits",
  icon: "🔢",
  group: "Language",
  order: 10,
  description: "math library, integer/float rules, and bit ops (5.3+).",
  cards: [
    {
      title: "Integer vs float (5.3+)",
      items: [
        { desc: "64-bit integers, double floats", code: `local i = 5       -- integer\nlocal f = 5 / 2   -- 2.5 (/ always float)` },
        { desc: "Floor division & modulo", code: `local q = 7 // 2   -- 3 (integer)\nlocal r = 7 % 2    -- 1` },
        { desc: "Force integer / float", code: `local n = math.floor(x)   -- integer\nlocal g = x | 0           -- also truncates` },
        { desc: "Check type", code: `math.type(x)   -- "integer" | "float" | nil` },
        { desc: "Limits", code: `math.maxinteger  math.mininteger  math.huge` },
      ],
    },
    {
      title: "math library",
      items: [
        { desc: "abs / min / max", code: `math.abs(x)\nmath.min(a, b)\nmath.max(a, b)` },
        { desc: "floor / ceil", code: `math.floor(x)   math.ceil(x)` },
        { desc: "sqrt / pow", code: `math.sqrt(x)\nlocal p = x ^ e   -- power (returns float)` },
        { desc: "Ceil division (ints)", code: `local c = (a + b - 1) // b` },
        { desc: "Random", code: `math.random()       -- [0,1)\nmath.random(1, n)   -- int in [1, n]` },
      ],
    },
    {
      title: "Bitwise operators (5.3+)",
      items: [
        { desc: "AND / OR / XOR / NOT", code: `a & b   a | b   a ~ b   ~a` },
        { desc: "Shifts", code: `a << k   a >> k` },
        { desc: "Test / set / clear bit i (0-based)", code: `local on = (x >> i) & 1 == 1\nx = x | (1 << i)\nx = x & ~(1 << i)` },
        { desc: "Lowest set bit", code: `local low = x & (-x)` },
        { desc: "Power of two check", code: `local p2 = x > 0 and (x & (x - 1)) == 0` },
      ],
    },
    {
      title: "Overflow & modular",
      items: [
        { desc: "Integers wrap at 64-bit", code: `-- math.maxinteger + 1 == math.mininteger` },
        { desc: "Modular add/mul", code: `local MOD = 1000000007\nlocal s = (a + b) % MOD\nlocal m = (a * b) % MOD   -- safe: 64-bit ints` },
        { desc: "Count set bits (loop)", code: `local function popcount(x)\n    local c = 0\n    while x ~= 0 do x = x & (x - 1); c = c + 1 end\n    return c\nend` },
      ],
    },
  ],
};
