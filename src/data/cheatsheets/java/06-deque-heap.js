export default {
  lang: "java",
  id: "java-deque-heap",
  title: "Deque, Stack, Queue & PriorityQueue",
  icon: "🥞",
  group: "Collections",
  order: 5,
  description: "ArrayDeque for stack/queue/deque, PriorityQueue for heaps.",
  cards: [
    {
      title: "ArrayDeque as stack",
      items: [
        { desc: "Create (prefer over Stack)", code: `Deque<Integer> st = new ArrayDeque<>();` },
        { desc: "Push / pop / peek", code: `st.push(1);       // add to head\nint x = st.pop(); // remove head\nint t = st.peek();` },
        { desc: "Empty check", code: `while (!st.isEmpty()) { }` },
      ],
    },
    {
      title: "ArrayDeque as queue",
      items: [
        { desc: "Create", code: `Deque<Integer> q = new ArrayDeque<>();` },
        { desc: "Enqueue / dequeue", code: `q.offer(1);        // add to tail\nint x = q.poll();  // remove head` },
        { desc: "Peek head", code: `int front = q.peek();` },
      ],
    },
    {
      title: "Deque (both ends)",
      items: [
        { desc: "Add", code: `d.offerFirst(1);\nd.offerLast(2);` },
        { desc: "Remove", code: `d.pollFirst();\nd.pollLast();` },
        { desc: "Peek", code: `d.peekFirst();\nd.peekLast();` },
        { desc: "Monotonic deque (sliding max)", code: `while (!d.isEmpty() && a[d.peekLast()] <= a[i]) d.pollLast();\nd.offerLast(i);` },
      ],
    },
    {
      title: "PriorityQueue (heap)",
      items: [
        { desc: "Min-heap (default)", code: `PriorityQueue<Integer> pq = new PriorityQueue<>();` },
        { desc: "Max-heap", code: `PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());` },
        { desc: "Offer / poll / peek", code: `pq.offer(5);\nint top = pq.poll(); // smallest (or largest)\nint p = pq.peek();` },
        { desc: "Size", code: `int n = pq.size();` },
      ],
    },
    {
      title: "PQ with comparator",
      items: [
        { desc: "Max-heap via lambda", code: `PriorityQueue<Integer> pq =\n    new PriorityQueue<>((a, b) -> b - a);` },
        { desc: "PQ of int[] (Dijkstra: {dist, node})", code: `PriorityQueue<int[]> pq =\n    new PriorityQueue<>((a, b) -> a[0] - b[0]);\npq.offer(new int[]{0, src});` },
        { desc: "By field, comparingInt", code: `PriorityQueue<int[]> pq =\n    new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));` },
        { desc: "Build from list (heapify)", code: `PriorityQueue<Integer> pq = new PriorityQueue<>(list);` },
      ],
    },
  ],
};
