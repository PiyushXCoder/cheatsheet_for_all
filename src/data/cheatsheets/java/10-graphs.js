export default {
  lang: "java",
  id: "java-graphs",
  title: "Graphs & Trees",
  icon: "network",
  group: "Algorithms",
  order: 9,
  description: "Adjacency lists, BFS/DFS, Dijkstra, topo sort and trees.",
  cards: [
    {
      title: "Build a graph",
      items: [
        { desc: "Adjacency list", code: `List<List<Integer>> adj = new ArrayList<>();\nfor (int i = 0; i < n; i++) adj.add(new ArrayList<>());` },
        { desc: "Add edge (undirected)", code: `adj.get(u).add(v);\nadj.get(v).add(u);` },
        { desc: "Weighted edge {to, w}", code: `adj.get(u).add(new int[]{v, w});` },
        { desc: "Grid neighbors", code: `int[] dx = {1, -1, 0, 0};\nint[] dy = {0, 0, 1, -1};\nfor (int d = 0; d < 4; d++) {\n    int nx = x + dx[d], ny = y + dy[d];\n}` },
      ],
    },
    {
      title: "BFS",
      items: [
        { desc: "Queue + visited", code: `Deque<Integer> q = new ArrayDeque<>();\nboolean[] seen = new boolean[n];\nq.offer(src); seen[src] = true;\nwhile (!q.isEmpty()) {\n    int u = q.poll();\n    for (int v : adj.get(u))\n        if (!seen[v]) { seen[v] = true; q.offer(v); }\n}` },
        { desc: "Level-order (distance)", code: `int steps = 0;\nwhile (!q.isEmpty()) {\n    int sz = q.size();\n    for (int i = 0; i < sz; i++) { /* pop, expand */ }\n    steps++;\n}` },
      ],
    },
    {
      title: "DFS",
      items: [
        { desc: "Recursive", code: `void dfs(int u, boolean[] seen) {\n    seen[u] = true;\n    for (int v : adj.get(u))\n        if (!seen[v]) dfs(v, seen);\n}` },
        { desc: "Iterative (stack)", code: `Deque<Integer> st = new ArrayDeque<>();\nst.push(src);\nwhile (!st.isEmpty()) {\n    int u = st.pop();\n    if (seen[u]) continue;\n    seen[u] = true;\n    for (int v : adj.get(u)) if (!seen[v]) st.push(v);\n}` },
      ],
    },
    {
      title: "Dijkstra",
      items: [
        { desc: "PQ of {dist, node}", code: `int[] dist = new int[n];\nArrays.fill(dist, Integer.MAX_VALUE);\nPriorityQueue<int[]> pq =\n    new PriorityQueue<>((a, b) -> a[0] - b[0]);\ndist[src] = 0; pq.offer(new int[]{0, src});\nwhile (!pq.isEmpty()) {\n    int[] cur = pq.poll();\n    int d = cur[0], u = cur[1];\n    if (d > dist[u]) continue;\n    for (int[] e : adj.get(u)) {\n        int v = e[0], w = e[1];\n        if (d + w < dist[v]) {\n            dist[v] = d + w;\n            pq.offer(new int[]{dist[v], v});\n        }\n    }\n}` },
      ],
    },
    {
      title: "Topological sort (Kahn)",
      items: [
        { desc: "Indegree BFS", code: `int[] indeg = new int[n];\nfor (int u = 0; u < n; u++)\n    for (int v : adj.get(u)) indeg[v]++;\nDeque<Integer> q = new ArrayDeque<>();\nfor (int i = 0; i < n; i++) if (indeg[i] == 0) q.offer(i);\nList<Integer> order = new ArrayList<>();\nwhile (!q.isEmpty()) {\n    int u = q.poll(); order.add(u);\n    for (int v : adj.get(u))\n        if (--indeg[v] == 0) q.offer(v);\n}\n// order.size() < n  =>  cycle` },
      ],
    },
    {
      title: "Binary tree",
      items: [
        { desc: "Node class", code: `class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int v) { val = v; }\n}` },
        { desc: "Inorder (recursive)", code: `void inorder(TreeNode r, List<Integer> out) {\n    if (r == null) return;\n    inorder(r.left, out);\n    out.add(r.val);\n    inorder(r.right, out);\n}` },
        { desc: "Level order (BFS)", code: `Deque<TreeNode> q = new ArrayDeque<>();\nif (root != null) q.offer(root);\nwhile (!q.isEmpty()) {\n    TreeNode n = q.poll();\n    if (n.left != null) q.offer(n.left);\n    if (n.right != null) q.offer(n.right);\n}` },
      ],
    },
  ],
};
