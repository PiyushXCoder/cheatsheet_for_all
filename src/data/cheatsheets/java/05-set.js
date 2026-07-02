export default {
  lang: "java",
  id: "java-set",
  title: "HashSet & TreeSet",
  icon: "🎯",
  group: "Collections",
  order: 4,
  description: "Unique-element sets, hashed or sorted.",
  cards: [
    {
      title: "HashSet basics",
      items: [
        { desc: "Create", code: `Set<Integer> s = new HashSet<>();` },
        { desc: "Add / remove", code: `s.add(5);       // returns false if already present\ns.remove(5);` },
        { desc: "Contains", code: `boolean has = s.contains(5);` },
        { desc: "Size / empty", code: `int n = s.size();\nboolean e = s.isEmpty();` },
        { desc: "From collection (dedup)", code: `Set<Integer> uniq = new HashSet<>(list);` },
      ],
    },
    {
      title: "Set operations",
      items: [
        { desc: "Union", code: `a.addAll(b);` },
        { desc: "Intersection", code: `a.retainAll(b);` },
        { desc: "Difference (a - b)", code: `a.removeAll(b);` },
        { desc: "Subset check", code: `boolean sub = a.containsAll(b);` },
      ],
    },
    {
      title: "TreeSet (sorted)",
      items: [
        { desc: "Create", code: `TreeSet<Integer> t = new TreeSet<>(); // ascending` },
        { desc: "Reverse order", code: `TreeSet<Integer> t = new TreeSet<>(Collections.reverseOrder());` },
        { desc: "First / last", code: `int lo = t.first();\nint hi = t.last();` },
        { desc: "floor / ceiling", code: `Integer f = t.floor(x);   // largest <= x\nInteger c = t.ceiling(x); // smallest >= x` },
        { desc: "lower / higher (strict)", code: `Integer l = t.lower(x);   // < x\nInteger h = t.higher(x);  // > x` },
        { desc: "Poll ends", code: `int mn = t.pollFirst();\nint mx = t.pollLast();` },
      ],
    },
    {
      title: "Iterate",
      items: [
        { desc: "Enhanced for", code: `for (int x : s) { }` },
        { desc: "TreeSet ascending", code: `for (int x : t) { } // sorted order` },
        { desc: "Descending view", code: `for (int x : t.descendingSet()) { }` },
        { desc: "Range subset", code: `for (int x : t.subSet(l, r)) { } // [l, r)` },
      ],
    },
  ],
};
