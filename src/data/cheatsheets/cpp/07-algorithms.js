export default {
  lang: "cpp",
  id: "cpp-algorithms",
  title: "<algorithm> & iterators",
  icon: "🔁",
  group: "Language",
  order: 6,
  description: "The STL algorithms that replace hand-written loops.",
  cards: [
    {
      title: "Transform & generate",
      items: [
        { desc: "transform (map)", code: `transform(v.begin(), v.end(), v.begin(),\n          [](int x){ return x * x; });` },
        { desc: "for_each", code: `for_each(v.begin(), v.end(), [](int x){ ... });` },
        { desc: "iota (0,1,2,...)", code: `iota(v.begin(), v.end(), 0);` },
        { desc: "fill / generate", code: `fill(v.begin(), v.end(), 0);` },
      ],
    },
    {
      title: "Reduce & aggregate",
      items: [
        { desc: "Sum (use 0LL to avoid overflow)", code: `ll s = accumulate(v.begin(), v.end(), 0LL);` },
        { desc: "Product / custom fold", code: `ll p = accumulate(v.begin(), v.end(), 1LL, multiplies<ll>());` },
        { desc: "Max / min element", code: `int mx = *max_element(v.begin(), v.end());\nint mn = *min_element(v.begin(), v.end());` },
        { desc: "Count / count_if", code: `int c = count(v.begin(), v.end(), 5);\nint e = count_if(v.begin(), v.end(), [](int x){ return x%2==0; });` },
        { desc: "Prefix sums", code: `partial_sum(v.begin(), v.end(), pre.begin());` },
      ],
    },
    {
      title: "Search & test",
      items: [
        { desc: "find / find_if", code: `auto it = find(v.begin(), v.end(), x);\nauto it2 = find_if(v.begin(), v.end(), pred);` },
        { desc: "any / all / none of", code: `all_of(v.begin(), v.end(), [](int x){ return x > 0; });` },
        { desc: "binary_search (sorted)", code: `bool has = binary_search(v.begin(), v.end(), x);` },
        { desc: "lower / upper bound (sorted)", code: `auto lo = lower_bound(v.begin(), v.end(), x); // first ≥ x\nauto hi = upper_bound(v.begin(), v.end(), x); // first > x` },
        { desc: "Index from iterator", code: `int idx = it - v.begin();` },
      ],
    },
    {
      title: "Rearrange",
      items: [
        { desc: "reverse / rotate", code: `reverse(v.begin(), v.end());\nrotate(v.begin(), v.begin()+k, v.end());` },
        { desc: "next_permutation", code: `sort(v.begin(), v.end());\ndo { ... } while (next_permutation(v.begin(), v.end()));` },
        { desc: "unique (after sort)", code: `v.erase(unique(v.begin(), v.end()), v.end());` },
        { desc: "min / max / clamp", code: `int m = max(a, b);\nint c = clamp(x, lo, hi);` },
      ],
    },
    {
      title: "Iterators",
      items: [
        { desc: "begin / end", code: `v.begin(); v.end(); v.rbegin(); v.rend();` },
        { desc: "advance / next / prev", code: `auto it = next(v.begin(), 3);\nauto p = prev(v.end());` },
        { desc: "distance", code: `int d = distance(v.begin(), it);` },
        { desc: "back_inserter", code: `copy(a.begin(), a.end(), back_inserter(b));` },
      ],
    },
  ],
};
