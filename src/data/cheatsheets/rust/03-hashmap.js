export default {
  id: "hashmap",
  title: "HashMap & HashSet",
  icon: "cards",
  group: "Collections",
  order: 3,
  description: "O(1) average lookup. Frequency counts, seen-sets, memoization.",
  cards: [
    {
      title: "HashMap basics",
      note: "use std::collections::HashMap;",
      items: [
        { desc: "Create & insert", code: `let mut m: HashMap<String, i32> = HashMap::new();\nm.insert("a".into(), 1);` },
        { desc: "Get (Option)", code: `if let Some(&v) = m.get("a") { }` },
        { desc: "Get or default", code: `let v = *m.get("a").unwrap_or(&0);` },
        { desc: "Contains / remove / len", code: `m.contains_key("a");\nm.remove("a");\nm.len();` },
      ],
    },
    {
      title: "entry API (the killer feature)",
      items: [
        { desc: "Frequency count", code: `*m.entry(k).or_insert(0) += 1;` },
        { desc: "Push into Vec value (adjacency/group)", code: `m.entry(k).or_default().push(v);` },
        { desc: "Insert only if absent", code: `m.entry(k).or_insert(compute());` },
        { desc: "Modify existing", code: `m.entry(k).and_modify(|c| *c += 1).or_insert(1);` },
      ],
    },
    {
      title: "Iterate HashMap",
      items: [
        { desc: "Key-value pairs", code: `for (k, v) in &m { }` },
        { desc: "Mutable values", code: `for v in m.values_mut() { *v += 1; }` },
        { desc: "Keys / values", code: `for k in m.keys() { }\nfor v in m.values() { }` },
        { desc: "Collect into map", code: `let m: HashMap<_,_> = v.iter().enumerate()\n    .map(|(i, &x)| (x, i)).collect();` },
      ],
    },
    {
      title: "HashSet",
      note: "use std::collections::HashSet;",
      items: [
        { desc: "Create & insert", code: `let mut s: HashSet<i32> = HashSet::new();\ns.insert(1); // returns bool: was new?` },
        { desc: "Contains / remove", code: `s.contains(&1);\ns.remove(&1);` },
        { desc: "From iterator", code: `let s: HashSet<i32> = v.iter().cloned().collect();` },
        { desc: "Set ops", code: `a.intersection(&b);\na.union(&b);\na.difference(&b);` },
        { desc: "Seen-before check", code: `if !seen.insert(x) { /* duplicate! */ }` },
      ],
    },
  ],
};
