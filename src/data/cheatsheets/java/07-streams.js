export default {
  lang: "java",
  id: "java-streams",
  title: "Streams & Iterators",
  icon: "loop",
  group: "Language",
  order: 6,
  description: "Functional pipelines over collections and ranges.",
  cards: [
    {
      title: "Build a stream",
      items: [
        { desc: "From collection", code: `list.stream()` },
        { desc: "From array (objects)", code: `Arrays.stream(arr)` },
        { desc: "IntStream range [0, n)", code: `IntStream.range(0, n)` },
        { desc: "Of values", code: `Stream.of(1, 2, 3)` },
        { desc: "int[] to IntStream", code: `IntStream.of(a) // or Arrays.stream(a)` },
      ],
    },
    {
      title: "Transform & filter",
      items: [
        { desc: "map", code: `list.stream().map(x -> x * 2)` },
        { desc: "filter", code: `list.stream().filter(x -> x % 2 == 0)` },
        { desc: "mapToInt (to IntStream)", code: `list.stream().mapToInt(Integer::intValue)` },
        { desc: "boxed (IntStream to Stream)", code: `IntStream.range(0, n).boxed()` },
        { desc: "distinct / sorted / limit", code: `s.distinct().sorted().limit(5)` },
      ],
    },
    {
      title: "Numeric reduce",
      items: [
        { desc: "sum / max / min", code: `int total = list.stream().mapToInt(x -> x).sum();\nint mx = Arrays.stream(a).max().getAsInt();` },
        { desc: "count", code: `long c = list.stream().filter(x -> x > 0).count();` },
        { desc: "average", code: `double avg = Arrays.stream(a).average().orElse(0);` },
        { desc: "reduce", code: `int prod = list.stream().reduce(1, (x, y) -> x * y);` },
      ],
    },
    {
      title: "Collect",
      items: [
        { desc: "To list", code: `List<Integer> r = s.collect(Collectors.toList());\nList<Integer> r2 = s.toList(); // Java 16+, immutable` },
        { desc: "To int[]", code: `int[] a = s.mapToInt(x -> x).toArray();` },
        { desc: "To set / map", code: `Set<Integer> set = s.collect(Collectors.toSet());` },
        { desc: "groupingBy", code: `Map<Integer,List<String>> g =\n    words.stream().collect(Collectors.groupingBy(String::length));` },
        { desc: "joining", code: `String csv = list.stream().map(String::valueOf)\n    .collect(Collectors.joining(","));` },
      ],
    },
    {
      title: "Test & find",
      items: [
        { desc: "anyMatch / allMatch", code: `boolean any = list.stream().anyMatch(x -> x > 10);\nboolean all = list.stream().allMatch(x -> x > 0);` },
        { desc: "noneMatch", code: `boolean none = list.stream().noneMatch(x -> x < 0);` },
        { desc: "findFirst", code: `Optional<Integer> first = list.stream()\n    .filter(x -> x > 5).findFirst();` },
        { desc: "forEach", code: `list.stream().forEach(System.out::println);` },
      ],
    },
  ],
};
