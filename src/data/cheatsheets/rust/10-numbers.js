export default {
  id: "numbers",
  title: "Numbers & Math",
  icon: "🔢",
  group: "Language",
  order: 10,
  description: "Int types, overflow, casts, gcd, bit tricks, common constants.",
  cards: [
    {
      title: "Types & limits",
      items: [
        { desc: "Signed / unsigned", code: `i8 i16 i32 i64 i128 isize\nu8 u16 u32 u64 u128 usize` },
        { desc: "MIN / MAX", code: `i64::MAX; i64::MIN;\nusize::MAX;` },
        { desc: "Big neutral values", code: `const INF: i64 = 1 << 60;\nconst NEG_INF: i64 = -(1 << 60);` },
        { desc: "Default int is i32 — cast up early", code: `let big = n as i64 * n as i64; // avoid i32 overflow` },
      ],
    },
    {
      title: "Casts & conversions",
      items: [
        { desc: "as cast (truncates!)", code: `let x = y as i64;\nlet i = f as i64; // toward zero` },
        { desc: "usize <-> i32 (indexing)", code: `let idx = i as usize;\nlet signed = idx as i32;` },
        { desc: "Safe try_into", code: `let x: i32 = big.try_into().unwrap();` },
        { desc: "Parse from string", code: `let n: i64 = s.trim().parse().unwrap();` },
      ],
    },
    {
      title: "Overflow-safe ops",
      items: [
        { desc: "Checked (Option)", code: `a.checked_add(b);\na.checked_mul(b);` },
        { desc: "Saturating (clamps)", code: `a.saturating_sub(b); // no underflow panic` },
        { desc: "Wrapping (mod 2^n)", code: `a.wrapping_add(b);` },
        { desc: "Modular arithmetic", code: `const MOD: u64 = 1_000_000_007;\nlet r = (a % MOD * (b % MOD)) % MOD;` },
      ],
    },
    {
      title: "Math helpers",
      items: [
        { desc: "abs / pow / sqrt", code: `x.abs();\ni64::pow(2, 10);\n(x as f64).sqrt();` },
        { desc: "min / max / clamp", code: `a.min(b); a.max(b);\nx.clamp(lo, hi);` },
        { desc: "Integer sqrt / log", code: `(x as f64).sqrt() as i64;\nx.ilog2(); // floor log2` },
        { desc: "gcd (Euclid)", code: `fn gcd(a: u64, b: u64) -> u64 {\n    if b == 0 { a } else { gcd(b, a % b) }\n}` },
        { desc: "Div ceil / rem_euclid", code: `a.div_ceil(b);\n(-3i32).rem_euclid(5); // 2, always non-neg` },
      ],
    },
    {
      title: "Bit manipulation",
      items: [
        { desc: "Test / set / clear bit i", code: `(x >> i) & 1;\nx |= 1 << i;\nx &= !(1 << i);` },
        { desc: "Count / trailing / leading", code: `x.count_ones();\nx.trailing_zeros();\nx.leading_zeros();` },
        { desc: "Lowest set bit", code: `let low = x & x.wrapping_neg();` },
        { desc: "Is power of two", code: `x != 0 && (x & (x - 1)) == 0;` },
        { desc: "Iterate subsets of mask", code: `let mut s = mask;\nwhile s > 0 { /* use s */ s = (s - 1) & mask; }` },
      ],
    },
  ],
};
