export default {
  id: "array",
  title: "Arrays & Slices",
  icon: "array",
  group: "Collections",
  order: 1,
  description: "Fixed-size arrays [T; N] and borrowed slices &[T].",
  cards: [
    {
      title: "Create & init",
      items: [
        { desc: "Array literal (size inferred)", code: `let a = [1, 2, 3]; // [i32; 3]` },
        { desc: "N copies of a value", code: `let a = [0; 5]; // five zeros` },
        { desc: "Explicit type", code: `let a: [i32; 3] = [1, 2, 3];` },
        { desc: "2D array m×n", code: `let g = [[0; 3]; 2]; // 2 rows, 3 cols` },
        { desc: "Size is fixed at compile time", code: `const N: usize = 4;\nlet a = [0u8; N];` },
        { desc: "Build then freeze into Vec", code: `let v: Vec<i32> = [1, 2, 3].to_vec();` },
      ],
    },
    {
      title: "Access & inspect",
      items: [
        { desc: "Index (panics if OOB)", code: `let x = a[0];` },
        { desc: "Safe get", code: `if let Some(&x) = a.get(i) { /* ... */ }` },
        { desc: "First / last", code: `a.first(); a.last(); // Option<&T>` },
        { desc: "Length (const, no is_empty needed)", code: `let n = a.len();` },
        { desc: "Contains", code: `a.contains(&3);` },
        { desc: "Find index", code: `let i = a.iter().position(|&x| x == 3);` },
      ],
    },
    {
      title: "Iterate",
      items: [
        { desc: "By reference", code: `for x in &a { println!("{x}"); }` },
        { desc: "By value (T: Copy)", code: `for x in a { }` },
        { desc: "Mutable", code: `for x in &mut a { *x *= 2; }` },
        { desc: "With index", code: `for (i, x) in a.iter().enumerate() { }` },
        { desc: "Reversed", code: `for x in a.iter().rev() { }` },
      ],
    },
    {
      title: "Slices (&[T])",
      items: [
        { desc: "Borrow whole array as slice", code: `let s: &[i32] = &a;` },
        { desc: "Sub-slice by range", code: `let s = &a[1..3]; // [a[1], a[2]]` },
        { desc: "Mutable slice", code: `let s = &mut a[..];` },
        { desc: "Split at index", code: `let (l, r) = a.split_at(2);` },
        { desc: "Head / tail pattern", code: `if let [head, tail @ ..] = &a[..] { }` },
        { desc: "Windows / chunks", code: `for w in a.windows(2) { }\nfor c in a.chunks(3) { }` },
      ],
    },
    {
      title: "Common ops (need `let mut a`)",
      items: [
        { desc: "Sort in place", code: `a.sort();` },
        { desc: "Reverse in place", code: `a.reverse();` },
        { desc: "Fill with a value", code: `a.fill(0);` },
        { desc: "Sum / max / min", code: `let s: i32 = a.iter().sum();\nlet mx = *a.iter().max().unwrap();` },
        { desc: "Swap two elements", code: `a.swap(0, 1);` },
        { desc: "Binary search (must be sorted)", code: `let r = a.binary_search(&3); // Ok(i) | Err(i)` },
      ],
    },
    {
      title: "Array vs Vec",
      items: [
        { desc: "Array: fixed length, on the stack", code: `let a = [0; 3]; // cannot push/pop` },
        { desc: "Vec: growable, on the heap", code: `let mut v = vec![0; 3];\nv.push(1); // ok` },
        { desc: "Both deref to a slice &[T]", code: `fn sum(s: &[i32]) -> i32 { s.iter().sum() }\nsum(&a); sum(&v);` },
        { desc: "Convert array → Vec", code: `let v = a.to_vec();` },
        { desc: "Convert Vec → array (fallible)", code: `let a: [i32; 3] = v.try_into().unwrap();` },
      ],
    },
  ],
};
