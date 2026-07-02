export default {
  lang: "cpp",
  id: "cpp-stack-queue",
  title: "stack, queue, deque & heap",
  icon: "🥞",
  group: "Collections",
  order: 5,
  description: "Adapters for LIFO, FIFO, double-ended, and priority order.",
  cards: [
    {
      title: "stack (LIFO)",
      items: [
        { desc: "Declare", code: `stack<int> st;` },
        { desc: "Push / pop / top", code: `st.push(x);\nint t = st.top();\nst.pop(); // returns void!` },
        { desc: "Size / empty", code: `st.size(); st.empty();` },
        { desc: "Pop pattern", code: `while (!st.empty()) {\n    int x = st.top(); st.pop();\n}` },
      ],
    },
    {
      title: "queue (FIFO)",
      items: [
        { desc: "Declare", code: `queue<int> q;` },
        { desc: "Push / pop / front", code: `q.push(x);\nint f = q.front();\nq.pop();` },
        { desc: "Back / size / empty", code: `q.back(); q.size(); q.empty();` },
        { desc: "BFS loop", code: `while (!q.empty()) {\n    int u = q.front(); q.pop();\n}` },
      ],
    },
    {
      title: "deque (double-ended)",
      items: [
        { desc: "Declare", code: `deque<int> dq;` },
        { desc: "Push / pop both ends", code: `dq.push_back(x);  dq.push_front(x);\ndq.pop_back();    dq.pop_front();` },
        { desc: "Random access", code: `dq[i]; dq.front(); dq.back();` },
        { desc: "Monotonic deque (window max)", code: `while (!dq.empty() && a[dq.back()] <= a[i]) dq.pop_back();\ndq.push_back(i);` },
      ],
    },
    {
      title: "priority_queue (heap)",
      items: [
        { desc: "Max-heap (default)", code: `priority_queue<int> pq;\npq.push(x); int mx = pq.top(); pq.pop();` },
        { desc: "Min-heap", code: `priority_queue<int, vector<int>, greater<int>> pq;` },
        { desc: "Min-heap of pairs (Dijkstra)", code: `priority_queue<pii, vector<pii>, greater<pii>> pq;\npq.push({dist, node});` },
        { desc: "Custom comparator", code: `auto cmp = [](int a, int b){ return a > b; };\npriority_queue<int, vector<int>, decltype(cmp)> pq(cmp);` },
      ],
    },
  ],
};
