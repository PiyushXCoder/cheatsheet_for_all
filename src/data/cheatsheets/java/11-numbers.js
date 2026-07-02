export default {
  lang: "java",
  id: "java-numbers",
  title: "Numbers, Math & Bits",
  icon: "🔢",
  group: "Language",
  order: 10,
  description: "Overflow-safe arithmetic, Math helpers and bit tricks.",
  cards: [
    {
      title: "Overflow & limits",
      items: [
        { desc: "int overflows at ~2.1e9", code: `int a = 100000, b = 100000;\nlong prod = (long) a * b; // cast BEFORE multiply` },
        { desc: "Wrong (overflows first)", code: `long bad = a * b; // int * int done in int, then widened` },
        { desc: "Bounds", code: `Integer.MAX_VALUE; // 2147483647\nLong.MAX_VALUE;    // ~9.2e18` },
        { desc: "Use long for sums", code: `long sum = 0;\nfor (int x : a) sum += x;` },
      ],
    },
    {
      title: "Math",
      items: [
        { desc: "abs / min / max", code: `Math.abs(-5); Math.min(a, b); Math.max(a, b);` },
        { desc: "pow / sqrt", code: `double p = Math.pow(2, 10);\nint s = (int) Math.sqrt(n);` },
        { desc: "Ceil division (ints)", code: `int c = (a + b - 1) / b; // ceil(a/b), a,b > 0` },
        { desc: "floorDiv / floorMod", code: `Math.floorDiv(-7, 2);  // -4\nMath.floorMod(-7, 3);  // 2 (never negative)` },
        { desc: "round / floor / ceil", code: `Math.round(2.5); Math.floor(2.9); Math.ceil(2.1);` },
      ],
    },
    {
      title: "GCD & modular",
      items: [
        { desc: "GCD (loop)", code: `static long gcd(long a, long b) {\n    while (b != 0) { long t = b; b = a % b; a = t; }\n    return a;\n}` },
        { desc: "LCM (avoid overflow)", code: `long lcm = a / gcd(a, b) * b;` },
        { desc: "Modular add / mul", code: `long MOD = 1_000_000_007L;\nlong r = ((a % MOD) * (b % MOD)) % MOD;` },
        { desc: "Fix negative mod", code: `int m = ((x % MOD) + MOD) % MOD;` },
      ],
    },
    {
      title: "Bit operations",
      items: [
        { desc: "and / or / xor / not", code: `a & b;  a | b;  a ^ b;  ~a;` },
        { desc: "Shifts", code: `x << 1;   // *2\nx >> 1;   // /2 (arithmetic, keeps sign)\nx >>> 1;  // logical (fills 0)` },
        { desc: "Test / set / clear bit i", code: `boolean on = (x >> i & 1) == 1;\nx |= (1 << i);\nx &= ~(1 << i);` },
        { desc: "Toggle bit i", code: `x ^= (1 << i);` },
      ],
    },
    {
      title: "Bit tricks",
      items: [
        { desc: "Popcount", code: `int bits = Integer.bitCount(x);` },
        { desc: "Lowest set bit", code: `int low = x & (-x);` },
        { desc: "Clear lowest set bit", code: `x &= (x - 1);` },
        { desc: "Power of two check", code: `boolean pow2 = x > 0 && (x & (x - 1)) == 0;` },
        { desc: "Fast modpow", code: `long pow(long b, long e, long mod) {\n    long r = 1; b %= mod;\n    while (e > 0) {\n        if ((e & 1) == 1) r = r * b % mod;\n        b = b * b % mod; e >>= 1;\n    }\n    return r;\n}` },
      ],
    },
  ],
};
