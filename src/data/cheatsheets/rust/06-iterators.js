export default {
  id: "iterators",
  title: "Iterators",
  icon: "loop",
  group: "Language",
  order: 6,
  description: "Lazy, chainable, zero-cost. The Rust way to transform data.",
  cards: [
    {
      title: "Transform",
      items: [
        { desc: "map / filter", code: `let v: Vec<i32> = a.iter().map(|x| x * 2).collect();\nlet v: Vec<_> = a.iter().filter(|&&x| x > 0).collect();` },
        { desc: "filter_map (map + drop None)", code: `let v: Vec<i32> = a.iter()\n    .filter_map(|s| s.parse().ok()).collect();` },
        { desc: "flat_map / flatten", code: `let v: Vec<_> = grid.iter().flatten().collect();` },
        { desc: "enumerate / zip", code: `for (i, x) in a.iter().enumerate() { }\nfor (x, y) in a.iter().zip(b.iter()) { }` },
        { desc: "scan (running state)", code: `let prefix: Vec<i32> = a.iter()\n    .scan(0, |acc, &x| { *acc += x; Some(*acc) }).collect();` },
      ],
    },
    {
      title: "Reduce / aggregate",
      items: [
        { desc: "sum / product", code: `let s: i64 = a.iter().sum();\nlet p: i64 = a.iter().product();` },
        { desc: "max / min", code: `let mx = a.iter().max().unwrap();\nlet mn = a.iter().min().unwrap();` },
        { desc: "max_by_key / min_by_key", code: `let longest = words.iter().max_by_key(|w| w.len());` },
        { desc: "fold (custom accumulate)", code: `let sum = a.iter().fold(0, |acc, &x| acc + x);` },
        { desc: "count", code: `let n = a.iter().filter(|&&x| x > 0).count();` },
      ],
    },
    {
      title: "Search & test",
      items: [
        { desc: "any / all", code: `a.iter().any(|&x| x < 0);\na.iter().all(|&x| x > 0);` },
        { desc: "find / position", code: `let x = a.iter().find(|&&x| x > 5);\nlet i = a.iter().position(|&x| x == 5);` },
        { desc: "take / skip", code: `a.iter().take(3);\na.iter().skip(2);` },
        { desc: "take_while / skip_while", code: `a.iter().take_while(|&&x| x < 10);` },
        { desc: "step_by", code: `(0..n).step_by(2); // 0,2,4,...` },
      ],
    },
    {
      title: "Ranges & collect targets",
      items: [
        { desc: "Range iteration", code: `for i in 0..n { }      // exclusive\nfor i in 0..=n { }     // inclusive\nfor i in (0..n).rev() { }` },
        { desc: "Safe upper bound (avoid n-1 underflow)", code: `for i in 0..n.saturating_sub(1) { } // empty when n == 0\n// n-1 would panic/underflow at n = 0 (usize)` },
        { desc: "Collect into different types", code: `let set: HashSet<_> = it.collect();\nlet map: HashMap<_,_> = it.collect();\nlet s: String = chars.collect();` },
        { desc: "Result<Vec<_>> (short-circuit err)", code: `let v: Result<Vec<i32>, _> =\n    strs.iter().map(|s| s.parse()).collect();` },
        { desc: "unzip", code: `let (xs, ys): (Vec<_>, Vec<_>) = pairs.into_iter().unzip();` },
      ],
    },
  ],
};
