export default {
  lang: "python",
  id: "py-graphs",
  title: "Graphs & Trees",
  icon: "network",
  group: "Algorithms",
  order: 9,
  description: "Adjacency lists, BFS/DFS, Dijkstra, topo sort, tree traversal.",
  cards: [
    {
      title: "Build a graph",
      items: [
        { desc: "Adjacency list", code: `from collections import defaultdict\ng = defaultdict(list)\nfor u, v in edges:\n    g[u].append(v)\n    g[v].append(u)  # undirected` },
        { desc: "Weighted", code: `g[u].append((v, w))` },
        { desc: "Grid neighbors (4-dir)", code: `for dr, dc in ((0,1),(0,-1),(1,0),(-1,0)):\n    nr, nc = r + dr, c + dc\n    if 0 <= nr < R and 0 <= nc < C:\n        ...` },
        { desc: "8-dir", code: `dirs = [(-1,-1),(-1,0),(-1,1),(0,-1),\n        (0,1),(1,-1),(1,0),(1,1)]` },
      ],
    },
    {
      title: "BFS (shortest hops)",
      items: [
        { desc: "Template", code: `from collections import deque\nq = deque([src])\nseen = {src}\nwhile q:\n    u = q.popleft()\n    for v in g[u]:\n        if v not in seen:\n            seen.add(v)\n            q.append(v)` },
        { desc: "Level by level", code: `dist = 0\nwhile q:\n    for _ in range(len(q)):\n        u = q.popleft()\n        ...\n    dist += 1` },
      ],
    },
    {
      title: "DFS",
      items: [
        { desc: "Recursive", code: `seen = set()\ndef dfs(u):\n    seen.add(u)\n    for v in g[u]:\n        if v not in seen:\n            dfs(v)` },
        { desc: "Iterative (stack)", code: `stack = [src]\nseen = {src}\nwhile stack:\n    u = stack.pop()\n    for v in g[u]:\n        if v not in seen:\n            seen.add(v)\n            stack.append(v)` },
      ],
    },
    {
      title: "Dijkstra & topo sort",
      items: [
        { desc: "Dijkstra (heapq)", code: `import heapq\ndist = {src: 0}\npq = [(0, src)]\nwhile pq:\n    d, u = heapq.heappop(pq)\n    if d > dist.get(u, INF): continue\n    for v, w in g[u]:\n        nd = d + w\n        if nd < dist.get(v, INF):\n            dist[v] = nd\n            heapq.heappush(pq, (nd, v))` },
        { desc: "Topo sort (Kahn)", code: `indeg = [0] * n\nfor u in range(n):\n    for v in g[u]: indeg[v] += 1\nq = deque(u for u in range(n) if indeg[u] == 0)\norder = []\nwhile q:\n    u = q.popleft(); order.append(u)\n    for v in g[u]:\n        indeg[v] -= 1\n        if indeg[v] == 0: q.append(v)` },
      ],
    },
    {
      title: "Binary tree",
      items: [
        { desc: "Node class", code: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right` },
        { desc: "Inorder (recursive)", code: `def inorder(node):\n    if not node: return\n    inorder(node.left)\n    visit(node.val)\n    inorder(node.right)` },
        { desc: "Level order (BFS)", code: `q = deque([root])\nwhile q:\n    node = q.popleft()\n    if node.left: q.append(node.left)\n    if node.right: q.append(node.right)` },
        { desc: "Iterative inorder", code: `stack, cur = [], root\nwhile stack or cur:\n    while cur:\n        stack.append(cur); cur = cur.left\n    cur = stack.pop()\n    visit(cur.val)\n    cur = cur.right` },
      ],
    },
  ],
};
