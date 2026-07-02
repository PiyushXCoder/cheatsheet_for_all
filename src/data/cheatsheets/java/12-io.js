export default {
  lang: "java",
  id: "java-io",
  title: "Competitive I/O",
  icon: "⌨️",
  group: "I/O & Misc",
  order: 12,
  description: "Fast reading and buffered output for contests.",
  cards: [
    {
      title: "Fast input (BufferedReader)",
      items: [
        { desc: "Setup", code: `BufferedReader br = new BufferedReader(\n    new InputStreamReader(System.in));` },
        { desc: "Read one int", code: `int n = Integer.parseInt(br.readLine().trim());` },
        { desc: "Tokenize a line", code: `StringTokenizer st = new StringTokenizer(br.readLine());\nint a = Integer.parseInt(st.nextToken());\nint b = Integer.parseInt(st.nextToken());` },
        { desc: "Split alternative", code: `String[] p = br.readLine().split(" ");` },
      ],
    },
    {
      title: "Scanner (simple)",
      items: [
        { desc: "Setup", code: `Scanner sc = new Scanner(System.in);` },
        { desc: "Read values", code: `int n = sc.nextInt();\nlong l = sc.nextLong();\nString w = sc.next();      // one token\nString line = sc.nextLine();` },
        { desc: "Note", code: `// Scanner is slower — prefer BufferedReader for big input` },
      ],
    },
    {
      title: "Read n ints",
      items: [
        { desc: "Into array (one line)", code: `int n = Integer.parseInt(br.readLine().trim());\nint[] a = new int[n];\nStringTokenizer st = new StringTokenizer(br.readLine());\nfor (int i = 0; i < n; i++)\n    a[i] = Integer.parseInt(st.nextToken());` },
        { desc: "Stream one-liner", code: `int[] a = Arrays.stream(br.readLine().split(" "))\n    .mapToInt(Integer::parseInt).toArray();` },
      ],
    },
    {
      title: "Read a grid",
      items: [
        { desc: "Char grid", code: `char[][] g = new char[r][];\nfor (int i = 0; i < r; i++)\n    g[i] = br.readLine().toCharArray();` },
        { desc: "Int grid", code: `int[][] g = new int[r][c];\nfor (int i = 0; i < r; i++) {\n    StringTokenizer st = new StringTokenizer(br.readLine());\n    for (int j = 0; j < c; j++)\n        g[i][j] = Integer.parseInt(st.nextToken());\n}` },
      ],
    },
    {
      title: "Fast output",
      items: [
        { desc: "StringBuilder + single print", code: `StringBuilder sb = new StringBuilder();\nfor (int x : ans) sb.append(x).append('\\n');\nSystem.out.print(sb);` },
        { desc: "PrintWriter (buffered)", code: `PrintWriter pw = new PrintWriter(\n    new BufferedWriter(new OutputStreamWriter(System.out)));\npw.println(ans);\npw.flush(); // must flush at end` },
      ],
    },
  ],
};
