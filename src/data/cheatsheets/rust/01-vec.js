export default {
  id: "vec",
  title: "Vec<T>",
  icon: "📦",
  group: "Collections",
  order: 1,
  description: "Growable array — the workhorse of DSA in Rust.",
  cards: [
    {
      title: "Create & init",
      items: [
        { desc: "Empty vec (annotate type)", code: `let mut v: Vec<i32> = Vec::new();` },
        { desc: "Literal macro", code: `let v = vec![1, 2, 3];` },
        { desc: "N copies of a value", code: `let v = vec![0; n]; // n zeros` },
        { desc: "2D grid m×n", code: `let mut g = vec![vec![0; n]; m];` },
        { desc: "With capacity (avoid reallocs)", code: `let mut v = Vec::with_capacity(n);` },
        { desc: "From an iterator", code: `let v: Vec<i32> = (0..n).collect();` },
      ],
    },
    {
      title: "Add & remove",
      items: [
        { desc: "Push / pop (back)", code: `v.push(4);\nlet last = v.pop(); // Option<T>` },
        { desc: "Insert / remove at index (O(n))", code: `v.insert(1, 99);\nlet x = v.remove(1);` },
        { desc: "Swap-remove (O(1), unordered)", code: `let x = v.swap_remove(0);` },
        { desc: "Extend / append", code: `v.extend([4, 5]);\nv.append(&mut other);` },
        { desc: "Truncate / clear", code: `v.truncate(2);\nv.clear();` },
        { desc: "Retain (filter in place)", code: `v.retain(|&x| x % 2 == 0);` },
      ],
    },
    {
      title: "Access & inspect",
      items: [
        { desc: "Index (panics if OOB)", code: `let x = v[0];` },
        { desc: "Safe get", code: `if let Some(&x) = v.get(i) { /* ... */ }` },
        { desc: "First / last", code: `v.first(); v.last(); // Option<&T>` },
        { desc: "Length / empty", code: `v.len(); v.is_empty();` },
        { desc: "Contains", code: `v.contains(&3);` },
        { desc: "Mutable element", code: `if let Some(x) = v.get_mut(i) { *x += 1; }` },
      ],
    },
    {
      title: "Iterate",
      items: [
        { desc: "By reference", code: `for x in &v { println!("{x}"); }` },
        { desc: "Mutable", code: `for x in &mut v { *x *= 2; }` },
        { desc: "With index", code: `for (i, x) in v.iter().enumerate() { }` },
        { desc: "Reversed", code: `for x in v.iter().rev() { }` },
        { desc: "Windows / chunks", code: `for w in v.windows(2) { }\nfor c in v.chunks(3) { }` },
      ],
    },
    {
      title: "Common tricks",
      items: [
        { desc: "Reverse in place", code: `v.reverse();` },
        { desc: "Dedup consecutive (sort first for all)", code: `v.sort();\nv.dedup();` },
        { desc: "Sum / max / min", code: `let s: i32 = v.iter().sum();\nlet mx = *v.iter().max().unwrap();` },
        { desc: "Rotate", code: `v.rotate_left(2);\nv.rotate_right(2);` },
        { desc: "Fill", code: `v.fill(0);` },
        { desc: "Split at index", code: `let (a, b) = v.split_at(mid);` },
      ],
    },
  ],
};
