export default {
  id: "deque-heap",
  title: "VecDeque & BinaryHeap",
  icon: "stack",
  group: "Collections",
  order: 5,
  description: "Queue/deque for BFS, priority queue for Dijkstra/greedy.",
  cards: [
    {
      title: "VecDeque (queue / deque)",
      note: "use std::collections::VecDeque;",
      items: [
        { desc: "Create", code: `let mut q: VecDeque<i32> = VecDeque::new();` },
        { desc: "Push/pop both ends (O(1))", code: `q.push_back(1);\nq.push_front(0);\nq.pop_front();\nq.pop_back();` },
        { desc: "Peek ends", code: `q.front(); q.back(); // Option<&T>` },
        { desc: "BFS skeleton", code: `let mut q = VecDeque::from([start]);\nwhile let Some(node) = q.pop_front() {\n    for nb in adj[node].iter() {\n        if !seen[*nb] { seen[*nb] = true; q.push_back(*nb); }\n    }\n}` },
      ],
    },
    {
      title: "BinaryHeap (max-heap by default)",
      note: "use std::collections::BinaryHeap;",
      items: [
        { desc: "Create & push", code: `let mut h: BinaryHeap<i32> = BinaryHeap::new();\nh.push(5);` },
        { desc: "Pop max / peek max", code: `let mx = h.pop(); // Option<T>\nlet top = h.peek();` },
        { desc: "From vec (heapify O(n))", code: `let mut h = BinaryHeap::from(vec![3, 1, 4]);` },
        { desc: "Drain sorted (descending)", code: `let sorted = h.into_sorted_vec(); // ascending!` },
      ],
    },
    {
      title: "Min-heap via Reverse",
      note: "use std::cmp::Reverse;",
      items: [
        { desc: "Wrap values in Reverse", code: `let mut h = BinaryHeap::new();\nh.push(Reverse(5));\nlet Reverse(min) = h.pop().unwrap();` },
        { desc: "Dijkstra: (Reverse(dist), node)", code: `let mut pq = BinaryHeap::new();\npq.push((Reverse(0), src));\nwhile let Some((Reverse(d), u)) = pq.pop() {\n    if d > dist[u] { continue; }\n    for &(v, w) in &adj[u] {\n        if d + w < dist[v] {\n            dist[v] = d + w;\n            pq.push((Reverse(dist[v]), v));\n        }\n    }\n}` },
      ],
    },
  ],
};
