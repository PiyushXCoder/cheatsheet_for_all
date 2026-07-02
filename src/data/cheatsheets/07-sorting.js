export default {
  id: "sorting",
  title: "Sorting & Searching",
  icon: "📊",
  group: "Algorithms",
  order: 7,
  description: "Sort by keys, custom comparators, binary search on slices.",
  cards: [
    {
      title: "Sort",
      items: [
        { desc: "Ascending in place", code: `v.sort();` },
        { desc: "Unstable (faster, no alloc)", code: `v.sort_unstable();` },
        { desc: "Descending", code: `v.sort_unstable_by(|a, b| b.cmp(a));` },
        { desc: "By key", code: `v.sort_by_key(|x| x.abs());\npeople.sort_by_key(|p| p.age);` },
        { desc: "By multiple keys", code: `v.sort_by(|a, b| a.0.cmp(&b.0).then(b.1.cmp(&a.1)));` },
        { desc: "Floats (no total Ord)", code: `v.sort_by(|a, b| a.partial_cmp(b).unwrap());` },
      ],
    },
    {
      title: "Binary search (sorted slice)",
      items: [
        { desc: "Find element", code: `match v.binary_search(&x) {\n    Ok(i)  => /* found at i */,\n    Err(i) => /* insert pos i */,\n}` },
        { desc: "By key", code: `v.binary_search_by_key(&target, |p| p.id);` },
        { desc: "Lower bound (first >= x)", code: `let lb = v.partition_point(|&y| y < x);` },
        { desc: "Upper bound (first > x)", code: `let ub = v.partition_point(|&y| y <= x);` },
      ],
    },
    {
      title: "Custom Ord for structs",
      items: [
        { desc: "Derive total ordering", code: `#[derive(PartialEq, Eq, PartialOrd, Ord)]\nstruct Item { key: i32, name: String }` },
        { desc: "min/max after derive", code: `items.iter().max(); // by key then name` },
        { desc: "Reverse a field in derive", code: `use std::cmp::Reverse;\nv.sort_by_key(|x| (Reverse(x.score), x.name.clone()));` },
      ],
    },
    {
      title: "Handy on slices",
      items: [
        { desc: "Is sorted", code: `v.is_sorted();` },
        { desc: "Select nth (quickselect, O(n))", code: `v.select_nth_unstable(k); // v[k] is kth smallest` },
        { desc: "Dedup after sort", code: `v.sort_unstable();\nv.dedup();` },
        { desc: "Min/max element index", code: `let (i, _) = v.iter().enumerate()\n    .max_by_key(|(_, &x)| x).unwrap();` },
      ],
    },
  ],
};
