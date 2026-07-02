export default {
  lang: "cpp",
  id: "cpp-sorting",
  title: "Sorting & Searching",
  icon: "📊",
  group: "Algorithms",
  order: 7,
  description: "sort, custom comparators, and binary search on sorted data.",
  cards: [
    {
      title: "Sort",
      items: [
        { desc: "Ascending", code: `sort(v.begin(), v.end());` },
        { desc: "Descending", code: `sort(v.begin(), v.end(), greater<int>());` },
        { desc: "By lambda", code: `sort(v.begin(), v.end(),\n     [](int a, int b){ return a > b; });` },
        { desc: "Stable sort (keep ties' order)", code: `stable_sort(v.begin(), v.end(), cmp);` },
        { desc: "Partial (top k)", code: `partial_sort(v.begin(), v.begin()+k, v.end());` },
        { desc: "nth_element (kth in O(n))", code: `nth_element(v.begin(), v.begin()+k, v.end());` },
      ],
    },
    {
      title: "Sort structs / pairs",
      items: [
        { desc: "pairs sort by first, then second", code: `sort(v.begin(), v.end()); // vector<pii>` },
        { desc: "By second element", code: `sort(v.begin(), v.end(),\n     [](auto& a, auto& b){ return a.second < b.second; });` },
        { desc: "Multi-key (x asc, y desc)", code: `sort(v.begin(), v.end(), [](auto& a, auto& b){\n    if (a.x != b.x) return a.x < b.x;\n    return a.y > b.y;\n});` },
        { desc: "operator< in struct", code: `struct P { int x,y;\n  bool operator<(const P& o) const { return x < o.x; } };` },
      ],
    },
    {
      title: "Binary search (sorted)",
      items: [
        { desc: "Exists?", code: `bool has = binary_search(v.begin(), v.end(), x);` },
        { desc: "First index ≥ x (lower_bound)", code: `int i = lower_bound(v.begin(), v.end(), x) - v.begin();` },
        { desc: "First index > x (upper_bound)", code: `int i = upper_bound(v.begin(), v.end(), x) - v.begin();` },
        { desc: "Count of x in sorted array", code: `int c = upper_bound(..., x) - lower_bound(..., x);` },
        { desc: "Equal range", code: `auto [lo, hi] = equal_range(v.begin(), v.end(), x);` },
      ],
    },
    {
      title: "Handy on ranges",
      items: [
        { desc: "Is sorted?", code: `bool ok = is_sorted(v.begin(), v.end());` },
        { desc: "Min & max together", code: `auto [mn, mx] = minmax_element(v.begin(), v.end());` },
        { desc: "Merge two sorted", code: `merge(a.begin(), a.end(), b.begin(), b.end(),\n      back_inserter(out));` },
        { desc: "Set operations (sorted)", code: `set_intersection(a.begin(),a.end(), b.begin(),b.end(),\n                 back_inserter(out));` },
      ],
    },
  ],
};
