export default {
  lang: "python",
  id: "py-basics",
  title: "Syntax Basics",
  icon: "⚙️",
  group: "Language",
  order: 0,
  description: "Core Python 3 syntax: variables, control flow, functions.",
  cards: [
    {
      title: "Variables & types",
      items: [
        { desc: "Assignment (dynamic)", code: `x = 5\nname = "Ada"\npi = 3.14` },
        { desc: "Multiple / swap", code: `a, b = 1, 2\na, b = b, a  # swap` },
        { desc: "Built-in types", code: `int, float, str, bool, list, dict, set, tuple` },
        { desc: "Cast", code: `int("42")\nstr(42)\nfloat("3.5")\nlist("abc")  # ['a','b','c']` },
        { desc: "Constants (convention)", code: `MOD = 10**9 + 7\nINF = float("inf")` },
      ],
    },
    {
      title: "f-strings & printing",
      items: [
        { desc: "Interpolation", code: `print(f"x={x}, y={y}")` },
        { desc: "Format spec", code: `f"{pi:.2f}"     # 3.14\nf"{42:5d}"      # '   42'\nf"{255:b}"      # binary` },
        { desc: "Debug (=)", code: `print(f"{x=}")  # x=5` },
        { desc: "Padding / align", code: `f"{s:>10}"  # right\nf"{s:<10}"  # left\nf"{s:^10}"  # center` },
      ],
    },
    {
      title: "Control flow",
      items: [
        { desc: "if / elif / else", code: `if x > 0:\n    ...\nelif x == 0:\n    ...\nelse:\n    ...` },
        { desc: "for over range", code: `for i in range(n):        # 0..n-1\nfor i in range(1, n+1):   # 1..n\nfor i in range(n-1, -1, -1):  # reverse` },
        { desc: "enumerate", code: `for i, v in enumerate(arr):\n    ...` },
        { desc: "while / break / continue", code: `while cond:\n    if done: break\n    if skip: continue` },
        { desc: "Ternary", code: `y = a if cond else b` },
      ],
    },
    {
      title: "Functions & lambdas",
      items: [
        { desc: "Define", code: `def add(a, b=0):\n    return a + b` },
        { desc: "Multiple return (tuple)", code: `def minmax(a):\n    return min(a), max(a)\nlo, hi = minmax(a)` },
        { desc: "Varargs / kwargs", code: `def f(*args, **kwargs):\n    ...` },
        { desc: "Lambda", code: `sq = lambda x: x * x\narr.sort(key=lambda p: p[1])` },
        { desc: "Default trap", code: `def f(x, acc=None):\n    if acc is None: acc = []  # never []` },
      ],
    },
    {
      title: "Comprehensions & truthiness",
      items: [
        { desc: "List comprehension", code: `squares = [x*x for x in range(5)]\nevens = [x for x in a if x % 2 == 0]` },
        { desc: "Dict / set comp", code: `{k: v for k, v in pairs}\n{x % 3 for x in a}` },
        { desc: "Falsy values", code: `0, 0.0, "", [], {}, set(), None, False` },
        { desc: "Truthy check", code: `if arr:        # non-empty\nif not s:      # empty string` },
        { desc: "Chained compare", code: `if 0 <= i < n:\n    ...` },
      ],
    },
  ],
};
