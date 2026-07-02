export default {
  lang: "java",
  id: "java-list",
  title: "ArrayList",
  icon: "📦",
  group: "Collections",
  order: 1,
  description: "Dynamic array — the workhorse list for DSA in Java.",
  cards: [
    {
      title: "Create",
      items: [
        { desc: "Empty", code: `List<Integer> v = new ArrayList<>();` },
        { desc: "With capacity", code: `List<Integer> v = new ArrayList<>(n);` },
        { desc: "From values", code: `List<Integer> v = new ArrayList<>(List.of(1, 2, 3));` },
        { desc: "Fixed-size view", code: `List<Integer> v = Arrays.asList(1, 2, 3); // no add/remove` },
        { desc: "Copy", code: `List<Integer> c = new ArrayList<>(v);` },
      ],
    },
    {
      title: "Add & remove",
      items: [
        { desc: "Append", code: `v.add(4);` },
        { desc: "Insert at index (O(n))", code: `v.add(1, 99);` },
        { desc: "Remove at index", code: `v.remove(1); // by index (int)` },
        { desc: "Remove by value", code: `v.remove(Integer.valueOf(99)); // the object` },
        { desc: "Remove last", code: `v.remove(v.size() - 1);` },
        { desc: "Clear", code: `v.clear();` },
      ],
    },
    {
      title: "Access & inspect",
      items: [
        { desc: "Get / set", code: `int x = v.get(0);\nv.set(0, 42);` },
        { desc: "Size / empty", code: `int n = v.size();\nboolean e = v.isEmpty();` },
        { desc: "Contains / indexOf", code: `boolean has = v.contains(3);\nint i = v.indexOf(3); // -1 if absent` },
        { desc: "First / last", code: `int f = v.get(0), l = v.get(v.size() - 1);` },
      ],
    },
    {
      title: "Iterate",
      items: [
        { desc: "Enhanced for", code: `for (int x : v) { }` },
        { desc: "By index", code: `for (int i = 0; i < v.size(); i++) { int x = v.get(i); }` },
        { desc: "Iterator (safe remove)", code: `Iterator<Integer> it = v.iterator();\nwhile (it.hasNext()) {\n    int x = it.next();\n    if (x == 0) it.remove();\n}` },
      ],
    },
    {
      title: "2D & arrays",
      items: [
        { desc: "List of lists", code: `List<List<Integer>> g = new ArrayList<>();\ng.add(new ArrayList<>());\ng.get(0).add(5);` },
        { desc: "Raw 2D array", code: `int[][] grid = new int[m][n]; // zero-filled` },
        { desc: "toArray (int)", code: `int[] a = v.stream().mapToInt(Integer::intValue).toArray();` },
        { desc: "Array to List", code: `List<Integer> v = Arrays.stream(a).boxed().toList();` },
      ],
    },
    {
      title: "Collections utils",
      items: [
        { desc: "Sort", code: `Collections.sort(v);\nCollections.sort(v, Collections.reverseOrder());` },
        { desc: "Reverse", code: `Collections.reverse(v);` },
        { desc: "Max / min", code: `int mx = Collections.max(v);\nint mn = Collections.min(v);` },
        { desc: "Fill / swap", code: `Collections.fill(v, 0);\nCollections.swap(v, 0, 1);` },
      ],
    },
  ],
};
