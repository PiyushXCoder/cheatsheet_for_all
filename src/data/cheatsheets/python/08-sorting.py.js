export default {
  lang: "python",
  id: "py-sorting",
  title: "Sorting & Searching",
  icon: "📊",
  group: "Algorithms",
  order: 7,
  description: "Sort keys, custom comparators, and binary search (bisect).",
  cards: [
    {
      title: "sorted vs list.sort",
      items: [
        { desc: "In place (returns None)", code: `a.sort()` },
        { desc: "New list", code: `b = sorted(a)  # a unchanged` },
        { desc: "Descending", code: `a.sort(reverse=True)` },
        { desc: "Works on any iterable", code: `sorted("bca")  # ['a','b','c']\nsorted(d.items())` },
      ],
    },
    {
      title: "key functions",
      items: [
        { desc: "Lambda key", code: `a.sort(key=lambda x: abs(x))` },
        { desc: "By length", code: `words.sort(key=len)` },
        { desc: "By attribute / index", code: `pts.sort(key=lambda p: p[0])` },
        { desc: "operator.itemgetter (fast)", code: `from operator import itemgetter\npts.sort(key=itemgetter(1, 0))` },
        { desc: "attrgetter", code: `from operator import attrgetter\nobjs.sort(key=attrgetter("age"))` },
      ],
    },
    {
      title: "Multi-key & comparators",
      items: [
        { desc: "Tuple key (asc, asc)", code: `a.sort(key=lambda x: (x.grade, x.name))` },
        { desc: "Mixed asc / desc", code: `a.sort(key=lambda x: (-x.score, x.name))` },
        { desc: "cmp_to_key (custom)", code: `from functools import cmp_to_key\ndef cmp(a, b):\n    return -1 if a+b > b+a else 1\na.sort(key=cmp_to_key(cmp))` },
        { desc: "Stable sort", code: `# Python sort is stable:\n# equal keys keep original order` },
      ],
    },
    {
      title: "bisect (binary search)",
      items: [
        { desc: "Import (needs sorted list)", code: `import bisect` },
        { desc: "Leftmost / rightmost pos", code: `bisect.bisect_left(a, x)   # first >= x\nbisect.bisect_right(a, x)  # first > x` },
        { desc: "Insert keeping sorted", code: `bisect.insort(a, x)\nbisect.insort_left(a, x)` },
        { desc: "Count of x", code: `bisect_right(a, x) - bisect_left(a, x)` },
        { desc: "Exists?", code: `i = bisect_left(a, x)\nfound = i < len(a) and a[i] == x` },
      ],
    },
    {
      title: "bisect on answer / ranges",
      items: [
        { desc: "Predecessor (< x)", code: `i = bisect_left(a, x) - 1  # -1 if none` },
        { desc: "Successor (> x)", code: `i = bisect_right(a, x)     # len if none` },
        { desc: "With key (3.10+)", code: `bisect.bisect_left(a, x, key=lambda v: v.t)` },
        { desc: "Search in range", code: `bisect_left(a, x, lo, hi)` },
      ],
    },
  ],
};
