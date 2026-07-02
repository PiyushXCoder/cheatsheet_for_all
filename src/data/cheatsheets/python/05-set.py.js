export default {
  lang: "python",
  id: "py-set",
  title: "set",
  icon: "🎯",
  group: "Collections",
  order: 4,
  description: "Hash set — O(1) membership and set algebra.",
  cards: [
    {
      title: "Create",
      items: [
        { desc: "Literal", code: `s = {1, 2, 3}` },
        { desc: "Empty (NOT {})", code: `s = set()   # {} is a dict!` },
        { desc: "From iterable", code: `s = set([1, 2, 2, 3])  # {1,2,3}\ns = set("aab")         # {'a','b'}` },
        { desc: "Comprehension", code: `s = {x % 3 for x in a}` },
      ],
    },
    {
      title: "Add & remove",
      items: [
        { desc: "Add", code: `s.add(4)\ns.update([5, 6])` },
        { desc: "Remove (KeyError if absent)", code: `s.remove(4)` },
        { desc: "Discard (safe)", code: `s.discard(4)  # no error` },
        { desc: "Pop arbitrary", code: `x = s.pop()` },
        { desc: "Clear", code: `s.clear()` },
      ],
    },
    {
      title: "Membership & size",
      items: [
        { desc: "Contains O(1)", code: `if x in s:\n    ...` },
        { desc: "Size / empty", code: `len(s)\nif not s: ...  # empty` },
        { desc: "Iterate (unordered)", code: `for x in s:\n    ...` },
      ],
    },
    {
      title: "Set operations",
      items: [
        { desc: "Union", code: `a | b\na.union(b)` },
        { desc: "Intersection", code: `a & b\na.intersection(b)` },
        { desc: "Difference", code: `a - b` },
        { desc: "Symmetric diff", code: `a ^ b  # in exactly one` },
        { desc: "Subset / superset", code: `a <= b   # a subset of b\na >= b   # a superset of b\na.isdisjoint(b)` },
      ],
    },
    {
      title: "frozenset & dedup",
      items: [
        { desc: "Immutable set (hashable)", code: `fs = frozenset([1, 2, 3])\nseen = {fs}  # can be dict key / set elem` },
        { desc: "Dedup a list", code: `unique = list(set(a))  # order lost` },
        { desc: "Dedup keep order", code: `list(dict.fromkeys(a))` },
        { desc: "Count distinct", code: `len(set(a))` },
      ],
    },
  ],
};
