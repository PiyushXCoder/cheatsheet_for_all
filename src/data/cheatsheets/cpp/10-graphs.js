export default {
  lang: "cpp",
  id: "cpp-graphs",
  title: "Graphs & Trees",
  icon: "network",
  group: "Algorithms",
  order: 9,
  description: "Adjacency lists, traversals, shortest paths.",
  cards: [
    {
      title: "Build adjacency list",
      items: [
        { desc: "Unweighted", code: `vector<vector<int>> adj(n);\nadj[u].push_back(v);\nadj[v].push_back(u); // undirected` },
        { desc: "Weighted", code: `vector<vector<pii>> adj(n); // {neighbor, weight}\nadj[u].push_back({v, w});` },
        { desc: "Grid neighbors", code: `int dx[] = {1,-1,0,0}, dy[] = {0,0,1,-1};\nfor (int d = 0; d < 4; ++d) {\n    int nx = x+dx[d], ny = y+dy[d];\n    if (nx>=0 && nx<m && ny>=0 && ny<n) { }\n}` },
      ],
    },
    {
      title: "BFS (shortest hops)",
      items: [
        { desc: "From a source", code: `vector<int> dist(n, -1);\nqueue<int> q; q.push(s); dist[s] = 0;\nwhile (!q.empty()) {\n    int u = q.front(); q.pop();\n    for (int v : adj[u])\n        if (dist[v] == -1) {\n            dist[v] = dist[u] + 1;\n            q.push(v);\n        }\n}` },
      ],
    },
    {
      title: "DFS",
      items: [
        { desc: "Recursive", code: `vector<bool> vis(n, false);\nfunction<void(int)> dfs = [&](int u) {\n    vis[u] = true;\n    for (int v : adj[u]) if (!vis[v]) dfs(v);\n};` },
        { desc: "Iterative (stack)", code: `stack<int> st; st.push(s);\nwhile (!st.empty()) {\n    int u = st.top(); st.pop();\n    if (vis[u]) continue;\n    vis[u] = true;\n    for (int v : adj[u]) if (!vis[v]) st.push(v);\n}` },
      ],
    },
    {
      title: "Dijkstra (weighted, ≥0)",
      items: [
        { desc: "Min-heap", code: `vector<ll> dist(n, LINF);\npriority_queue<pair<ll,int>, vector<pair<ll,int>>, greater<>> pq;\ndist[s] = 0; pq.push({0, s});\nwhile (!pq.empty()) {\n    auto [d, u] = pq.top(); pq.pop();\n    if (d > dist[u]) continue;\n    for (auto [v, w] : adj[u])\n        if (dist[u] + w < dist[v]) {\n            dist[v] = dist[u] + w;\n            pq.push({dist[v], v});\n        }\n}` },
      ],
    },
    {
      title: "Topological sort (Kahn)",
      items: [
        { desc: "BFS on indegrees", code: `vector<int> indeg(n, 0), order;\nfor (int u = 0; u < n; ++u)\n    for (int v : adj[u]) indeg[v]++;\nqueue<int> q;\nfor (int u = 0; u < n; ++u) if (!indeg[u]) q.push(u);\nwhile (!q.empty()) {\n    int u = q.front(); q.pop(); order.push_back(u);\n    for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);\n}\n// cycle if order.size() != n` },
      ],
    },
    {
      title: "Binary tree node",
      items: [
        { desc: "Definition", code: `struct TreeNode {\n    int val;\n    TreeNode *left, *right;\n    TreeNode(int x): val(x), left(nullptr), right(nullptr) {}\n};` },
        { desc: "Recursive traversal", code: `void inorder(TreeNode* t) {\n    if (!t) return;\n    inorder(t->left);\n    visit(t->val);\n    inorder(t->right);\n}` },
      ],
    },
  ],
};
