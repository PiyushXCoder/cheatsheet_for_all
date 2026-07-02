export default {
  lang: "java",
  id: "java-sorting",
  title: "Sorting & Searching",
  icon: "📊",
  group: "Algorithms",
  order: 7,
  description: "Sort arrays and lists, build comparators, binary search.",
  cards: [
    {
      title: "Basic sort",
      items: [
        { desc: "Sort primitive array", code: `Arrays.sort(a); // ascending` },
        { desc: "Sort subrange", code: `Arrays.sort(a, l, r); // [l, r)` },
        { desc: "Sort list", code: `Collections.sort(list);\nlist.sort(null); // natural order` },
        { desc: "Descending (list)", code: `list.sort(Collections.reverseOrder());` },
        { desc: "Descending int[]: box first", code: `Integer[] b = Arrays.stream(a).boxed().toArray(Integer[]::new);\nArrays.sort(b, Collections.reverseOrder());` },
      ],
    },
    {
      title: "Comparators",
      items: [
        { desc: "By key ascending", code: `list.sort(Comparator.comparingInt(x -> x.val));` },
        { desc: "Reversed", code: `list.sort(Comparator.comparingInt(Node::getVal).reversed());` },
        { desc: "Tie-break (thenComparing)", code: `list.sort(Comparator.comparingInt((int[] a) -> a[0])\n    .thenComparingInt(a -> a[1]));` },
        { desc: "Lambda comparator", code: `list.sort((a, b) -> a.val - b.val); // beware overflow` },
        { desc: "Safe int compare", code: `list.sort((a, b) -> Integer.compare(a.val, b.val));` },
      ],
    },
    {
      title: "Sort 2D by column",
      items: [
        { desc: "By column 0", code: `Arrays.sort(pts, (a, b) -> a[0] - b[0]);` },
        { desc: "By col 0, then col 1", code: `Arrays.sort(pts, (a, b) ->\n    a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);` },
        { desc: "comparingInt style", code: `Arrays.sort(pts, Comparator.comparingInt(a -> a[1]));` },
      ],
    },
    {
      title: "Binary search",
      items: [
        { desc: "Array (must be sorted)", code: `int i = Arrays.binarySearch(a, key);\n// >=0 found; else -(insertionPoint)-1` },
        { desc: "Insertion point", code: `int ip = i < 0 ? -(i + 1) : i;` },
        { desc: "List", code: `int i = Collections.binarySearch(list, key);` },
        { desc: "With comparator", code: `int i = Arrays.binarySearch(arr, key, cmp);` },
      ],
    },
    {
      title: "Stability note",
      items: [
        { desc: "Primitives: dual-pivot quicksort", code: `Arrays.sort(int[]) // NOT stable, O(n log n)` },
        { desc: "Objects: TimSort (merge)", code: `Arrays.sort(T[]) // STABLE, O(n log n)` },
        { desc: "Need stable on ints?", code: `// box to Integer[] then Arrays.sort` },
      ],
    },
  ],
};
