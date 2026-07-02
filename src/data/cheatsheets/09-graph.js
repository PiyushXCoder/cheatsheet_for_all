export default {
  id: "graph",
  title: "Graphs & Trees",
  icon: "🕸️",
  group: "Algorithms",
  order: 9,
  description: "Adjacency lists, BFS/DFS, and recursion on grids/trees.",
  cards: [
    {
      title: "Build adjacency list",
      items: [
        { desc: "Unweighted", code: `let mut adj = vec![Vec::new(); n];\nfor &[u, v] in &edges {\n    adj[u].push(v);\n    adj[v].push(u); // undirected\n}` },
        { desc: "Weighted", code: `let mut adj: Vec<Vec<(usize, i64)>> = vec![Vec::new(); n];\nadj[u].push((v, w));` },
      ],
    },
    {
      title: "BFS (shortest hops)",
      items: [
        { desc: "Level order + distance", code: `let mut dist = vec![-1i32; n];\nlet mut q = VecDeque::from([src]);\ndist[src] = 0;\nwhile let Some(u) = q.pop_front() {\n    for &v in &adj[u] {\n        if dist[v] == -1 {\n            dist[v] = dist[u] + 1;\n            q.push_back(v);\n        }\n    }\n}` },
      ],
    },
    {
      title: "DFS",
      items: [
        { desc: "Recursive", code: `fn dfs(u: usize, adj: &Vec<Vec<usize>>, seen: &mut Vec<bool>) {\n    seen[u] = true;\n    for &v in &adj[u] {\n        if !seen[v] { dfs(v, adj, seen); }\n    }\n}` },
        { desc: "Iterative with stack", code: `let mut st = vec![src];\nwhile let Some(u) = st.pop() {\n    if seen[u] { continue; }\n    seen[u] = true;\n    for &v in &adj[u] { if !seen[v] { st.push(v); } }\n}` },
      ],
    },
    {
      title: "Grid traversal",
      items: [
        { desc: "4-directional neighbors", code: `const DIRS: [(i32, i32); 4] = [(0,1),(0,-1),(1,0),(-1,0)];\nfor (dr, dc) in DIRS {\n    let (nr, nc) = (r as i32 + dr, c as i32 + dc);\n    if nr >= 0 && nr < rows && nc >= 0 && nc < cols {\n        let (nr, nc) = (nr as usize, nc as usize);\n        // visit grid[nr][nc]\n    }\n}` },
      ],
    },
    {
      title: "Binary tree (Rc/RefCell)",
      items: [
        { desc: "LeetCode node type", code: `use std::rc::Rc;\nuse std::cell::RefCell;\ntype Link = Option<Rc<RefCell<TreeNode>>>;` },
        { desc: "Recurse on children", code: `fn depth(root: &Link) -> i32 {\n    match root {\n        None => 0,\n        Some(n) => {\n            let n = n.borrow();\n            1 + depth(&n.left).max(depth(&n.right))\n        }\n    }\n}` },
      ],
    },
  ],
};
