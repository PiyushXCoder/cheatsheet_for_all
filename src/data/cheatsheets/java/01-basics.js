export default {
  lang: "java",
  id: "java-basics",
  title: "Syntax Basics",
  icon: "gear",
  group: "Language",
  order: 0,
  description: "Class skeleton, types, control flow and lambdas.",
  cards: [
    {
      title: "Skeleton",
      items: [
        { desc: "Class + main", code: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello");\n    }\n}` },
        { desc: "Print", code: `System.out.println(x);       // with newline\nSystem.out.print(x);         // no newline\nSystem.err.println("debug");` },
        { desc: "Formatted print", code: `System.out.printf("%d %.2f%n", 5, 3.1);` },
      ],
    },
    {
      title: "Types",
      items: [
        { desc: "Primitives", code: `int a = 5; long b = 5L;\ndouble d = 1.5; char c = 'x';\nboolean ok = true;` },
        { desc: "Boxed (wrappers)", code: `Integer x = 5;   // needed for generics\nLong y = 5L;\nInteger n = null; // primitives can't be null` },
        { desc: "var (Java 10+)", code: `var list = new ArrayList<Integer>();\nvar sum = 0L; // inferred as long` },
        { desc: "Constant", code: `final int N = 100;` },
        { desc: "Cast", code: `int i = (int) 3.9;      // 3\nlong l = (long) i;` },
      ],
    },
    {
      title: "Control flow",
      items: [
        { desc: "for", code: `for (int i = 0; i < n; i++) { }` },
        { desc: "Enhanced for", code: `for (int x : arr) { }\nfor (String s : list) { }` },
        { desc: "while / do-while", code: `while (cond) { }\ndo { } while (cond);` },
        { desc: "if / else if", code: `if (x > 0) { } else if (x < 0) { } else { }` },
        { desc: "switch (arrow, Java 14+)", code: `switch (day) {\n    case 1 -> System.out.println("Mon");\n    default -> System.out.println("?");\n}` },
      ],
    },
    {
      title: "Methods & lambdas",
      items: [
        { desc: "Static method", code: `static int add(int a, int b) { return a + b; }` },
        { desc: "Varargs", code: `static int sum(int... xs) {\n    int s = 0; for (int x : xs) s += x; return s;\n}` },
        { desc: "Lambda", code: `Comparator<Integer> cmp = (a, b) -> a - b;\nRunnable r = () -> System.out.println("run");` },
        { desc: "Functional interface", code: `Function<Integer,Integer> sq = x -> x * x;\nint y = sq.apply(4); // 16` },
      ],
    },
    {
      title: "Handy",
      items: [
        { desc: "Ternary", code: `int m = a > b ? a : b;` },
        { desc: "String.format", code: `String s = String.format("%d-%s", 5, "x");` },
        { desc: "String concat", code: `String s = "a" + 1 + true; // "a1true"` },
        { desc: "Multiple assign", code: `int a = 1, b = 2, c = 3;` },
        { desc: "Swap", code: `int t = a; a = b; b = t;` },
      ],
    },
  ],
};
