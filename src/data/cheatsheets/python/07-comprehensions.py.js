export default {
  lang: "python",
  id: "py-comprehensions",
  title: "Comprehensions & Iterators",
  icon: "🔁",
  group: "Language",
  order: 6,
  description: "Comprehensions, generators, and the itertools toolkit.",
  cards: [
    {
      title: "Comprehensions",
      items: [
        { desc: "List", code: `[x*x for x in range(n)]` },
        { desc: "With filter", code: `[x for x in a if x > 0]` },
        { desc: "Nested / flatten", code: `[c for row in grid for c in row]` },
        { desc: "Dict / set", code: `{k: v for k, v in pairs}\n{x % 3 for x in a}` },
        { desc: "Conditional expr", code: `[x if x > 0 else 0 for x in a]` },
      ],
    },
    {
      title: "Generators & map/filter",
      items: [
        { desc: "Generator expr (lazy)", code: `gen = (x*x for x in a)\nsum(x*x for x in a)  # no list built` },
        { desc: "map", code: `list(map(int, input().split()))\nlist(map(lambda x: x*2, a))` },
        { desc: "filter", code: `list(filter(lambda x: x > 0, a))` },
        { desc: "any / all", code: `any(x < 0 for x in a)\nall(x > 0 for x in a)` },
        { desc: "yield", code: `def gen():\n    for i in range(3):\n        yield i` },
      ],
    },
    {
      title: "itertools: combinatorics",
      items: [
        { desc: "Import", code: `import itertools as it` },
        { desc: "product (cartesian)", code: `it.product([0,1], repeat=3)  # 000..111\nit.product(a, b)` },
        { desc: "permutations", code: `it.permutations([1,2,3])\nit.permutations(a, 2)` },
        { desc: "combinations", code: `it.combinations([1,2,3], 2)  # (1,2),(1,3),(2,3)` },
        { desc: "with replacement", code: `it.combinations_with_replacement(a, 2)` },
      ],
    },
    {
      title: "itertools: sequences",
      items: [
        { desc: "accumulate (prefix)", code: `list(it.accumulate([1,2,3]))  # [1,3,6]\nit.accumulate(a, max)` },
        { desc: "chain (concat)", code: `list(it.chain(a, b))\nit.chain.from_iterable(lists)` },
        { desc: "groupby (sorted!)", code: `for k, grp in it.groupby(sorted(a)):\n    print(k, list(grp))` },
        { desc: "pairwise (3.10+)", code: `for x, y in it.pairwise(a):\n    ...  # (a0,a1),(a1,a2)` },
        { desc: "count / repeat / cycle", code: `it.count(0, 2)   # 0,2,4,...\nit.repeat(5, 3)` },
      ],
    },
    {
      title: "sorted with key",
      items: [
        { desc: "Basic", code: `sorted(a)\nsorted(a, reverse=True)` },
        { desc: "By key", code: `sorted(words, key=len)\nsorted(pts, key=lambda p: p[1])` },
        { desc: "Multi-key (tuple)", code: `sorted(a, key=lambda x: (x[0], -x[1]))` },
        { desc: "min / max with key", code: `max(pts, key=lambda p: p[1])` },
      ],
    },
  ],
};
