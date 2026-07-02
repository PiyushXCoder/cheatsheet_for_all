export default {
  lang: "python",
  id: "py-list",
  title: "Lists",
  icon: "package",
  group: "Collections",
  order: 1,
  description: "Dynamic array — the workhorse of DSA in Python.",
  cards: [
    {
      title: "Create & init",
      items: [
        { desc: "Empty / literal", code: `a = []\na = [1, 2, 3]` },
        { desc: "N copies", code: `a = [0] * n        # n zeros\na = [None] * n` },
        { desc: "2D grid m×n", code: `g = [[0] * n for _ in range(m)]\n# NOT [[0]*n]*m  (shared rows!)` },
        { desc: "From range / iterable", code: `a = list(range(n))\na = list("abc")` },
        { desc: "From comprehension", code: `a = [x*x for x in range(n)]` },
      ],
    },
    {
      title: "Add & remove",
      items: [
        { desc: "Append / extend", code: `a.append(4)\na.extend([5, 6])\na += [5, 6]` },
        { desc: "Pop (O(1) end)", code: `x = a.pop()      # last\nx = a.pop(0)     # first (O(n))` },
        { desc: "Insert at index (O(n))", code: `a.insert(1, 99)` },
        { desc: "Remove by value / index", code: `a.remove(99)     # first match\ndel a[1]\ndel a[l:r]` },
        { desc: "Clear", code: `a.clear()` },
      ],
    },
    {
      title: "Slicing & indexing",
      items: [
        { desc: "Basic slice", code: `a[l:r]      # [l, r)\na[:k]  a[k:]  a[:]  # copy` },
        { desc: "Step / reverse", code: `a[::2]      # every 2nd\na[::-1]     # reversed copy` },
        { desc: "Negative index", code: `a[-1]       # last\na[-2:]      # last two` },
        { desc: "Slice assign", code: `a[1:3] = [9, 9, 9]  # can resize` },
        { desc: "Unpack", code: `first, *rest = a\n*init, last = a` },
      ],
    },
    {
      title: "Iterate",
      items: [
        { desc: "By value", code: `for x in a:\n    ...` },
        { desc: "With index", code: `for i, x in enumerate(a):\n    ...\nfor i, x in enumerate(a, 1):  # 1-based` },
        { desc: "Zip two lists", code: `for x, y in zip(a, b):\n    ...` },
        { desc: "Reversed", code: `for x in reversed(a):\n    ...` },
      ],
    },
    {
      title: "Common tricks",
      items: [
        { desc: "Reverse in place", code: `a.reverse()` },
        { desc: "Sort", code: `a.sort()\na.sort(reverse=True)\na.sort(key=lambda x: -x)` },
        { desc: "Sum / max / min", code: `sum(a)\nmax(a)  min(a)\nmax(a, default=0)` },
        { desc: "Count / index / contains", code: `a.count(3)\na.index(3)\n3 in a` },
        { desc: "Dedup keep order", code: `seen = set()\nout = [x for x in a if not (x in seen or seen.add(x))]` },
      ],
    },
  ],
};
