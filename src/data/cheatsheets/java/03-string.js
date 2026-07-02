export default {
  lang: "java",
  id: "java-string",
  title: "String & StringBuilder",
  icon: "🔤",
  group: "Collections",
  order: 2,
  description: "Immutable strings and the mutable StringBuilder.",
  cards: [
    {
      title: "Basics",
      items: [
        { desc: "Immutable", code: `String s = "abc"; // any op returns a NEW string` },
        { desc: "Length / char", code: `int n = s.length();\nchar c = s.charAt(0);` },
        { desc: "Equality (never ==)", code: `boolean eq = s.equals("abc");\nboolean ci = s.equalsIgnoreCase("ABC");` },
        { desc: "Compare (lexicographic)", code: `int c = s.compareTo("abd"); // <0, 0, >0` },
        { desc: "Empty / blank", code: `s.isEmpty();\ns.isBlank(); // only whitespace` },
      ],
    },
    {
      title: "Methods",
      items: [
        { desc: "Substring", code: `s.substring(1);      // from index 1\ns.substring(1, 3);   // [1, 3)` },
        { desc: "indexOf / contains", code: `int i = s.indexOf('a');\nboolean has = s.contains("bc");` },
        { desc: "split", code: `String[] parts = s.split(",");\nString[] ws = s.split("\\\\s+"); // whitespace` },
        { desc: "replace / trim", code: `s.replace("a", "x");\ns.trim();      // both ends\ns.strip();     // unicode-aware` },
        { desc: "case / repeat", code: `s.toUpperCase(); s.toLowerCase();\n"ab".repeat(3); // "ababab"` },
        { desc: "startsWith / endsWith", code: `s.startsWith("ab"); s.endsWith("c");` },
      ],
    },
    {
      title: "StringBuilder",
      items: [
        { desc: "Create", code: `StringBuilder sb = new StringBuilder();` },
        { desc: "Append", code: `sb.append("x").append(5).append('!');` },
        { desc: "Insert", code: `sb.insert(0, "pre");` },
        { desc: "Delete char / reverse", code: `sb.deleteCharAt(sb.length() - 1);\nsb.reverse();` },
        { desc: "Access / set", code: `char c = sb.charAt(0);\nsb.setCharAt(0, 'z');` },
        { desc: "To string", code: `String out = sb.toString();` },
      ],
    },
    {
      title: "Char & int",
      items: [
        { desc: "char to int (digit)", code: `int d = c - '0'; // '7' -> 7` },
        { desc: "int to char (digit)", code: `char c = (char) ('0' + d);` },
        { desc: "letter index (a=0)", code: `int idx = c - 'a';` },
        { desc: "parse / value", code: `int n = Integer.parseInt("42");\nString s = String.valueOf(42);` },
      ],
    },
    {
      title: "Character utils",
      items: [
        { desc: "Classify", code: `Character.isDigit(c);\nCharacter.isLetter(c);\nCharacter.isLetterOrDigit(c);` },
        { desc: "Case", code: `Character.isUpperCase(c);\nCharacter.toLowerCase(c);` },
        { desc: "Digit value", code: `int d = Character.getNumericValue(c);` },
        { desc: "To char array", code: `char[] arr = s.toCharArray();\nString back = new String(arr);` },
      ],
    },
  ],
};
