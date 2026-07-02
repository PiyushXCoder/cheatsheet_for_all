export default {
  id: "btree",
  title: "BTreeMap & BTreeSet",
  icon: "tree",
  group: "Collections",
  order: 4,
  description: "Sorted map/set. Ordered iteration + range queries in O(log n).",
  cards: [
    {
      title: "BTreeMap",
      note: "use std::collections::BTreeMap;",
      items: [
        { desc: "Create & insert (keeps keys sorted)", code: `let mut m: BTreeMap<i32, i32> = BTreeMap::new();\nm.insert(5, 1);` },
        { desc: "Iterate in sorted key order", code: `for (k, v) in &m { }` },
        { desc: "Min / max entry", code: `m.first_key_value();\nm.last_key_value();` },
        { desc: "Pop min / max", code: `m.pop_first();\nm.pop_last();` },
        { desc: "Same entry API as HashMap", code: `*m.entry(k).or_insert(0) += 1;` },
      ],
    },
    {
      title: "Range queries",
      items: [
        { desc: "Values in [lo, hi)", code: `for (k, v) in m.range(lo..hi) { }` },
        { desc: "Ceiling — smallest key >= x", code: `let c = m.range(x..).next();` },
        { desc: "Floor — largest key <= x", code: `let f = m.range(..=x).next_back();` },
        { desc: "Strictly greater", code: `let g = m.range((Bound::Excluded(x), Bound::Unbounded)).next();` },
      ],
    },
    {
      title: "BTreeSet",
      note: "use std::collections::BTreeSet;",
      items: [
        { desc: "Sorted unique set", code: `let mut s: BTreeSet<i32> = BTreeSet::new();\ns.insert(3);` },
        { desc: "Min / max", code: `s.first(); s.last();` },
        { desc: "Range", code: `for x in s.range(2..=8) { }` },
        { desc: "Ordered floor/ceil (like C++ set)", code: `let ceil = s.range(x..).next();\nlet floor = s.range(..=x).next_back();` },
      ],
    },
  ],
};
