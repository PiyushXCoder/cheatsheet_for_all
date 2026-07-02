export default {
  lang: "python",
  id: "py-io",
  title: "Competitive I/O",
  icon: "⌨️",
  group: "I/O & Misc",
  order: 12,
  description: "Fast reading, parsing, and formatted output for judges.",
  cards: [
    {
      title: "Basic input",
      items: [
        { desc: "Single line (string)", code: `s = input()          # no trailing newline\nname = input().strip()` },
        { desc: "Single int", code: `n = int(input())` },
        { desc: "Ints on one line", code: `a, b = map(int, input().split())` },
        { desc: "List of ints", code: `arr = list(map(int, input().split()))` },
        { desc: "List of floats / strs", code: `xs = list(map(float, input().split()))\nwords = input().split()` },
      ],
    },
    {
      title: "Reading n lines",
      items: [
        { desc: "n ints (one per line)", code: `n = int(input())\narr = [int(input()) for _ in range(n)]` },
        { desc: "n rows of ints", code: `grid = [list(map(int, input().split()))\n        for _ in range(n)]` },
        { desc: "Read all remaining", code: `import sys\ndata = sys.stdin.read().split()` },
        { desc: "Index into token stream", code: `it = iter(data)\nn = int(next(it))\narr = [int(next(it)) for _ in range(n)]` },
      ],
    },
    {
      title: "Fast input",
      items: [
        { desc: "Rebind input (fastest)", code: `import sys\ninput = sys.stdin.readline` },
        { desc: "readline (keeps newline)", code: `line = sys.stdin.readline().rstrip()` },
        { desc: "Read all lines", code: `for line in sys.stdin:\n    process(line.split())` },
        { desc: "Buffered read", code: `data = sys.stdin.buffer.read().split()` },
      ],
    },
    {
      title: "Output",
      items: [
        { desc: "sep / end", code: `print(a, b, sep=", ", end="\\n")` },
        { desc: "Print a list spaced", code: `print(*arr)          # unpacks\nprint(" ".join(map(str, arr)))` },
        { desc: "One per line", code: `print("\\n".join(map(str, arr)))` },
        { desc: "Fast bulk output", code: `sys.stdout.write("\\n".join(map(str, ans)) + "\\n")` },
        { desc: "No newline flush", code: `print(x, flush=True)` },
      ],
    },
    {
      title: "Misc setup",
      items: [
        { desc: "Recursion limit", code: `import sys\nsys.setrecursionlimit(10**6)` },
        { desc: "Boolean output", code: `print("YES" if ok else "NO")` },
        { desc: "Multiple test cases", code: `t = int(input())\nfor _ in range(t):\n    solve()` },
        { desc: "2D output", code: `for row in grid:\n    print(*row)` },
      ],
    },
  ],
};
