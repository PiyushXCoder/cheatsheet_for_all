export default {
  lang: "cpp",
  id: "cpp-numbers",
  title: "Numbers, Math & Bits",
  icon: "numbers",
  group: "Language",
  order: 10,
  description: "Overflow safety, math helpers, and bit tricks.",
  cards: [
    {
      title: "Types & limits",
      items: [
        { desc: "Sizes", code: `int   ~2.1e9   (32-bit)\nlong long ~9.2e18 (64-bit)` },
        { desc: "Limits", code: `INT_MAX, INT_MIN, LLONG_MAX;\nnumeric_limits<int>::max();` },
        { desc: "Watch overflow", code: `ll prod = (ll)a * b; // cast BEFORE multiply` },
        { desc: "Doubles", code: `double x = 1.0 / 3;\nprintf("%.6f\\n", x);` },
      ],
    },
    {
      title: "Casts & conversions",
      items: [
        { desc: "Explicit cast", code: `ll b = (ll)a;\nint c = (int)d;` },
        { desc: "Round / floor / ceil", code: `round(x); floor(x); ceil(x);` },
        { desc: "Ceil division (ints)", code: `int c = (a + b - 1) / b;` },
      ],
    },
    {
      title: "Math helpers",
      items: [
        { desc: "abs / min / max", code: `abs(x); llabs(x); min(a,b); max(a,b);` },
        { desc: "Power (integer, careful)", code: `ll p = 1; for (int i=0;i<e;++i) p *= base;` },
        { desc: "gcd / lcm (C++17)", code: `int g = __gcd(a, b); // or gcd(a,b)\nll l = (ll)a / g * b;` },
        { desc: "sqrt (verify int)", code: `ll s = sqrtl(n);\nwhile (s*s > n) --s;\nwhile ((s+1)*(s+1) <= n) ++s;` },
        { desc: "Modular add/mul", code: `ll add = (a + b) % MOD;\nll mul = (a * b) % MOD;` },
      ],
    },
    {
      title: "Fast power (mod)",
      items: [
        { desc: "Binary exponentiation", code: `ll power(ll b, ll e, ll m) {\n    ll r = 1; b %= m;\n    while (e) {\n        if (e & 1) r = r * b % m;\n        b = b * b % m;\n        e >>= 1;\n    }\n    return r;\n}` },
      ],
    },
    {
      title: "Bit manipulation",
      items: [
        { desc: "Test / set / clear bit i", code: `bool on = x >> i & 1;\nx |= (1 << i);\nx &= ~(1 << i);` },
        { desc: "Toggle / lowest set bit", code: `x ^= (1 << i);\nint low = x & (-x);` },
        { desc: "Count set bits", code: `int c = __builtin_popcount(x);\nint cll = __builtin_popcountll(x);` },
        { desc: "Leading/trailing zeros", code: `__builtin_clz(x);  __builtin_ctz(x);` },
        { desc: "Iterate subsets of mask", code: `for (int s = mask; s; s = (s - 1) & mask) { }` },
        { desc: "Power of two check", code: `bool p2 = x && !(x & (x - 1));` },
      ],
    },
  ],
};
