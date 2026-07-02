export default {
  lang: "cpp",
  id: "cpp-vector",
  title: "vector",
  icon: "📦",
  group: "Collections",
  order: 1,
  description: "Dynamic array — the workhorse of DSA in C++.",
  cards: [
    {
      title: "Create & init",
      items: [
        { desc: "Empty", code: `vector<int> v;` },
        { desc: "Literal", code: `vector<int> v = {1, 2, 3};` },
        { desc: "N copies of a value", code: `vector<int> v(n, 0); // n zeros` },
        { desc: "2D grid m×n", code: `vector<vector<int>> g(m, vector<int>(n, 0));` },
        { desc: "Reserve capacity", code: `v.reserve(n); // avoid reallocs` },
        { desc: "From a range", code: `vector<int> v(arr, arr + n);` },
      ],
    },
    {
      title: "Add & remove",
      items: [
        { desc: "Push / pop (back)", code: `v.push_back(4);\nv.emplace_back(4); // in-place\nv.pop_back();` },
        { desc: "Insert / erase at index (O(n))", code: `v.insert(v.begin() + 1, 99);\nv.erase(v.begin() + 1);` },
        { desc: "Erase range", code: `v.erase(v.begin() + l, v.begin() + r);` },
        { desc: "Erase by value (all)", code: `v.erase(remove(v.begin(), v.end(), x), v.end());` },
        { desc: "Resize / clear", code: `v.resize(2);\nv.clear();` },
      ],
    },
    {
      title: "Access & inspect",
      items: [
        { desc: "Index (no bounds check)", code: `int x = v[0];` },
        { desc: "Checked access", code: `int x = v.at(i); // throws if OOB` },
        { desc: "Front / back", code: `v.front(); v.back();` },
        { desc: "Size / empty", code: `v.size(); v.empty();` },
        { desc: "Contains (unsorted)", code: `bool has = find(v.begin(), v.end(), 3) != v.end();` },
      ],
    },
    {
      title: "Iterate",
      items: [
        { desc: "By value / reference", code: `for (int x : v) { }\nfor (auto& x : v) x *= 2;` },
        { desc: "With index", code: `for (int i = 0; i < (int)v.size(); ++i) { }` },
        { desc: "Iterators", code: `for (auto it = v.begin(); it != v.end(); ++it) { }` },
        { desc: "Reversed", code: `for (auto it = v.rbegin(); it != v.rend(); ++it) { }` },
      ],
    },
    {
      title: "Common tricks",
      items: [
        { desc: "Reverse in place", code: `reverse(v.begin(), v.end());` },
        { desc: "Sort + unique (dedup)", code: `sort(v.begin(), v.end());\nv.erase(unique(v.begin(), v.end()), v.end());` },
        { desc: "Sum / max / min", code: `ll s = accumulate(v.begin(), v.end(), 0LL);\nint mx = *max_element(v.begin(), v.end());` },
        { desc: "Rotate left by k", code: `rotate(v.begin(), v.begin() + k, v.end());` },
        { desc: "Fill", code: `fill(v.begin(), v.end(), 0);\niota(v.begin(), v.end(), 0); // 0,1,2,...` },
      ],
    },
  ],
};
