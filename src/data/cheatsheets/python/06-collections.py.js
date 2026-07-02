export default {
  lang: "python",
  id: "py-collections",
  title: "deque, heapq & Counter",
  icon: "🥞",
  group: "Collections",
  order: 5,
  description: "Queues, priority queues, and specialized containers.",
  cards: [
    {
      title: "deque (double-ended queue)",
      items: [
        { desc: "Import & create", code: `from collections import deque\nq = deque()\nq = deque([1, 2, 3])` },
        { desc: "Push both ends", code: `q.append(x)       # right\nq.appendleft(x)   # left` },
        { desc: "Pop both ends O(1)", code: `q.pop()           # right\nq.popleft()       # left` },
        { desc: "Peek", code: `q[0]   # front\nq[-1]  # back` },
        { desc: "Fixed window (maxlen)", code: `q = deque(maxlen=k)  # auto-drops oldest` },
        { desc: "rotate", code: `q.rotate(1)   # right\nq.rotate(-1)  # left` },
      ],
    },
    {
      title: "heapq (min-heap)",
      items: [
        { desc: "Import", code: `import heapq` },
        { desc: "Push / pop min", code: `h = []\nheapq.heappush(h, x)\nsmallest = heapq.heappop(h)` },
        { desc: "Peek min", code: `h[0]` },
        { desc: "Heapify in place O(n)", code: `heapq.heapify(a)  # a is now a heap` },
        { desc: "Push-pop combos", code: `heapq.heappushpop(h, x)\nheapq.heapreplace(h, x)` },
        { desc: "Tuples (priority, item)", code: `heapq.heappush(h, (dist, node))` },
      ],
    },
    {
      title: "Max-heap & top-k",
      items: [
        { desc: "Max-heap via negation", code: `heapq.heappush(h, -x)\nlargest = -heapq.heappop(h)` },
        { desc: "n largest / smallest", code: `heapq.nlargest(3, a)\nheapq.nsmallest(3, a)` },
        { desc: "With key", code: `heapq.nlargest(3, pts, key=lambda p: p[1])` },
        { desc: "K smallest (size-k max-heap)", code: `for x in a:\n    heapq.heappush(h, -x)\n    if len(h) > k: heapq.heappop(h)` },
      ],
    },
    {
      title: "Counter",
      items: [
        { desc: "Import & build", code: `from collections import Counter\nc = Counter(a)` },
        { desc: "Most common", code: `c.most_common(2)  # [(val, cnt), ...]` },
        { desc: "Arithmetic", code: `c1 + c2\nc1 - c2   # keeps positive only\nc1 & c2   # min\nc1 | c2   # max` },
        { desc: "Elements / total", code: `list(c.elements())\nsum(c.values())` },
        { desc: "Anagram check", code: `Counter(s) == Counter(t)` },
      ],
    },
    {
      title: "defaultdict",
      items: [
        { desc: "Import", code: `from collections import defaultdict` },
        { desc: "Auto-default int / list", code: `d = defaultdict(int)\ng = defaultdict(list)` },
        { desc: "Nested", code: `d = defaultdict(lambda: defaultdict(int))` },
        { desc: "Grouping (anagrams)", code: `for word in words:\n    key = "".join(sorted(word))\n    groups[key].append(word)` },
      ],
    },
  ],
};
