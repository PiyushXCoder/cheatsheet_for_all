export default {
  lang: "java",
  id: "java-map",
  title: "HashMap & TreeMap",
  icon: "map",
  group: "Collections",
  order: 3,
  description: "Hash and sorted key-value maps for counting and lookup.",
  cards: [
    {
      title: "Create & basics",
      items: [
        { desc: "HashMap", code: `Map<String, Integer> m = new HashMap<>();` },
        { desc: "Put / get", code: `m.put("a", 1);\nint v = m.get("a"); // NPE if absent (unbox)` },
        { desc: "getOrDefault", code: `int v = m.getOrDefault("a", 0);` },
        { desc: "Contains", code: `m.containsKey("a");\nm.containsValue(1);` },
        { desc: "Size / remove", code: `int n = m.size();\nm.remove("a");` },
      ],
    },
    {
      title: "Counter idioms",
      items: [
        { desc: "Frequency count (merge)", code: `m.merge(key, 1, Integer::sum);` },
        { desc: "Equivalent long form", code: `m.put(key, m.getOrDefault(key, 0) + 1);` },
        { desc: "Put if absent", code: `m.putIfAbsent("a", 0);` },
        { desc: "Decrement / drop", code: `m.merge(key, -1, Integer::sum);\nif (m.get(key) == 0) m.remove(key);` },
      ],
    },
    {
      title: "compute family",
      items: [
        { desc: "computeIfAbsent (map of lists)", code: `Map<Integer, List<Integer>> g = new HashMap<>();\ng.computeIfAbsent(u, k -> new ArrayList<>()).add(v);` },
        { desc: "compute", code: `m.compute("a", (k, val) -> val == null ? 1 : val + 1);` },
        { desc: "computeIfPresent", code: `m.computeIfPresent("a", (k, val) -> val + 1);` },
      ],
    },
    {
      title: "Iterate",
      items: [
        { desc: "Entry set", code: `for (Map.Entry<String,Integer> e : m.entrySet()) {\n    String k = e.getKey();\n    int v = e.getValue();\n}` },
        { desc: "Keys / values", code: `for (String k : m.keySet()) { }\nfor (int v : m.values()) { }` },
        { desc: "forEach", code: `m.forEach((k, v) -> System.out.println(k + "=" + v));` },
      ],
    },
    {
      title: "TreeMap (sorted)",
      items: [
        { desc: "Create", code: `TreeMap<Integer, String> t = new TreeMap<>(); // sorted by key` },
        { desc: "First / last key", code: `int lo = t.firstKey();\nint hi = t.lastKey();` },
        { desc: "floor / ceiling", code: `Integer f = t.floorKey(x);   // largest <= x\nInteger c = t.ceilingKey(x); // smallest >= x` },
        { desc: "lower / higher (strict)", code: `Integer l = t.lowerKey(x);   // < x\nInteger h = t.higherKey(x);  // > x` },
        { desc: "Range view", code: `SortedMap<Integer,String> sub = t.subMap(l, r); // [l, r)` },
      ],
    },
  ],
};
