export default {
  lang: "python",
  id: "py-numbers",
  title: "Numbers, Math & Bits",
  icon: "🔢",
  group: "Language",
  order: 10,
  description: "Arbitrary-precision ints, math module, and bit tricks.",
  cards: [
    {
      title: "Int & float",
      items: [
        { desc: "Arbitrary precision", code: `x = 2 ** 1000  # no overflow` },
        { desc: "Int / float divide", code: `7 / 2    # 3.5 (float)\n7 // 2   # 3 (floor)` },
        { desc: "Floor toward -inf", code: `-7 // 2  # -4 (not -3!)` },
        { desc: "Rounding", code: `round(3.567, 2)  # 3.57\nimport math\nmath.floor(x)  math.ceil(x)` },
        { desc: "Infinity", code: `INF = float("inf")\nNEG = float("-inf")` },
      ],
    },
    {
      title: "Modulo & divmod",
      items: [
        { desc: "Modulo (sign of divisor)", code: `-7 % 3   # 2 (always >= 0 here)` },
        { desc: "divmod", code: `q, r = divmod(17, 5)  # (3, 2)` },
        { desc: "Digits of a number", code: `while n:\n    n, d = divmod(n, 10)` },
        { desc: "Competitive MOD", code: `MOD = 10**9 + 7\nans = (a * b) % MOD` },
      ],
    },
    {
      title: "math module",
      items: [
        { desc: "Import", code: `import math` },
        { desc: "gcd / lcm", code: `math.gcd(12, 18)  # 6\nmath.lcm(4, 6)    # 12` },
        { desc: "sqrt / isqrt", code: `math.sqrt(2)     # 1.414\nmath.isqrt(17)   # 4 (int)` },
        { desc: "Combinatorics", code: `math.comb(5, 2)  # 10\nmath.perm(5, 2)  # 20\nmath.factorial(5)` },
        { desc: "Fast modular pow", code: `pow(base, exp, mod)  # (base**exp) % mod` },
      ],
    },
    {
      title: "Bit operations",
      items: [
        { desc: "AND / OR / XOR", code: `a & b\na | b\na ^ b` },
        { desc: "NOT / shifts", code: `~a       # -a - 1\na << k   # * 2^k\na >> k   # // 2^k` },
        { desc: "Test / set / clear bit", code: `(x >> i) & 1        # test\nx |= (1 << i)       # set\nx &= ~(1 << i)      # clear\nx ^= (1 << i)       # toggle` },
        { desc: "Power of two check", code: `x > 0 and x & (x - 1) == 0` },
      ],
    },
    {
      title: "Bit tricks",
      items: [
        { desc: "Binary string", code: `bin(6)      # '0b110'\nbin(6)[2:]  # '110'` },
        { desc: "Popcount", code: `(6).bit_count()   # 2 (3.10+)\nbin(6).count("1")` },
        { desc: "Bit length", code: `(6).bit_length()  # 3` },
        { desc: "Lowest set bit", code: `x & -x  # isolates lowest 1-bit` },
        { desc: "Iterate subsets of mask", code: `s = mask\nwhile s:\n    ...\n    s = (s - 1) & mask` },
      ],
    },
  ],
};
