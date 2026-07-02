export default {
  lang: "python",
  id: "py-dict",
  title: "dict",
  icon: "map",
  group: "Collections",
  order: 3,
  description: "Hash map — O(1) lookup, insertion-ordered since 3.7.",
  cards: [
    {
      title: "Create & access",
      items: [
        { desc: "Literal / empty", code: `d = {"a": 1, "b": 2}\nd = {}\nd = dict(a=1, b=2)` },
        { desc: "Set / get / delete", code: `d["c"] = 3\nx = d["a"]     # KeyError if absent\ndel d["a"]` },
        { desc: "From pairs / zip", code: `d = dict(zip(keys, vals))\nd = {k: 0 for k in keys}` },
        { desc: "Membership", code: `"a" in d\nlen(d)` },
        { desc: "Pop with default", code: `d.pop("a", None)` },
      ],
    },
    {
      title: "get / setdefault",
      items: [
        { desc: "get with default", code: `d.get("x", 0)   # no KeyError` },
        { desc: "Counter idiom", code: `d[x] = d.get(x, 0) + 1` },
        { desc: "setdefault (group)", code: `d.setdefault(k, []).append(v)` },
        { desc: "Update / merge", code: `d.update(other)\nmerged = {**a, **b}  # b wins` },
      ],
    },
    {
      title: "defaultdict & Counter",
      items: [
        { desc: "Import", code: `from collections import defaultdict, Counter` },
        { desc: "defaultdict(int)", code: `cnt = defaultdict(int)\nfor x in a: cnt[x] += 1` },
        { desc: "defaultdict(list)", code: `g = defaultdict(list)\ng[u].append(v)` },
        { desc: "Counter", code: `c = Counter(a)\nc = Counter("banana")  # {'a':3,...}` },
        { desc: "Counter ops", code: `c.most_common(2)\nc["z"]     # 0 if absent\nc.total()  # sum of counts` },
      ],
    },
    {
      title: "Iterate",
      items: [
        { desc: "Keys / values", code: `for k in d:\n    ...\nfor v in d.values():\n    ...` },
        { desc: "Items", code: `for k, v in d.items():\n    ...` },
        { desc: "As lists", code: `list(d.keys())\nlist(d.values())\nlist(d.items())` },
      ],
    },
    {
      title: "Sort by key / value",
      items: [
        { desc: "By key", code: `for k in sorted(d):\n    ...` },
        { desc: "By value asc", code: `sorted(d.items(), key=lambda kv: kv[1])` },
        { desc: "By value desc", code: `sorted(d.items(), key=lambda kv: -kv[1])` },
        { desc: "Max by value", code: `max(d, key=d.get)` },
      ],
    },
  ],
};
