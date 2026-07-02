export default {
  lang: "lua",
  id: "lua-graphs",
  title: "Graphs & Trees",
  icon: "🕸️",
  group: "Algorithms",
  order: 9,
  description: "Adjacency lists and traversals with tables.",
  cards: [
    {
      title: "Build adjacency list",
      items: [
        { desc: "Unweighted", code: `local adj = {}\nfor i = 1, n do adj[i] = {} end\nlocal function addEdge(u, v)\n    adj[u][#adj[u]+1] = v\n    adj[v][#adj[v]+1] = u  -- undirected\nend` },
        { desc: "Weighted (store pairs)", code: `adj[u][#adj[u]+1] = {v, w}` },
        { desc: "Grid neighbors", code: `local dr = {1, -1, 0, 0}\nlocal dc = {0, 0, 1, -1}\nfor d = 1, 4 do\n    local nr, nc = r + dr[d], c + dc[d]\n    if nr >= 1 and nr <= m and nc >= 1 and nc <= n then end\nend` },
      ],
    },
    {
      title: "BFS (shortest hops)",
      items: [
        { desc: "Queue with head/tail", code: `local dist = {}\nlocal q, head = {s}, 1\ndist[s] = 0\nwhile head <= #q do\n    local u = q[head]; head = head + 1\n    for _, v in ipairs(adj[u]) do\n        if dist[v] == nil then\n            dist[v] = dist[u] + 1\n            q[#q+1] = v\n        end\n    end\nend` },
      ],
    },
    {
      title: "DFS",
      items: [
        { desc: "Recursive", code: `local vis = {}\nlocal function dfs(u)\n    vis[u] = true\n    for _, v in ipairs(adj[u]) do\n        if not vis[v] then dfs(v) end\n    end\nend` },
        { desc: "Iterative (stack)", code: `local st, vis = {s}, {}\nwhile #st > 0 do\n    local u = st[#st]; st[#st] = nil\n    if not vis[u] then\n        vis[u] = true\n        for _, v in ipairs(adj[u]) do\n            if not vis[v] then st[#st+1] = v end\n        end\n    end\nend` },
      ],
    },
    {
      title: "Dijkstra (with the heap)",
      items: [
        { desc: "Min-heap of {dist, node}", code: `-- heap comparing by [1]; see DSA Patterns for Heap\nlocal dist = {}; dist[s] = 0\npq:push({0, s})\nwhile not pq:empty() do\n    local d, u = table.unpack(pq:pop())\n    if d == dist[u] then\n        for _, e in ipairs(adj[u]) do\n            local v, w = e[1], e[2]\n            if dist[v] == nil or d + w < dist[v] then\n                dist[v] = d + w\n                pq:push({dist[v], v})\n            end\n        end\n    end\nend` },
      ],
    },
    {
      title: "Binary tree",
      items: [
        { desc: "Node as table", code: `local function node(v)\n    return {val = v, left = nil, right = nil}\nend` },
        { desc: "Inorder traversal", code: `local function inorder(t, out)\n    if not t then return end\n    inorder(t.left, out)\n    out[#out+1] = t.val\n    inorder(t.right, out)\nend` },
      ],
    },
  ],
};
