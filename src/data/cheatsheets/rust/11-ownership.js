export default {
  id: "ownership",
  title: "Ownership & Borrowing",
  icon: "lock",
  group: "Language",
  order: 11,
  description: "The borrow checker rules that trip up DSA code, and the fixes.",
  cards: [
    {
      title: "Move vs borrow vs clone",
      items: [
        { desc: "Move (ownership transfers)", code: `let a = vec![1, 2];\nlet b = a; // a is now invalid` },
        { desc: "Borrow (shared)", code: `fn len(v: &Vec<i32>) -> usize { v.len() }` },
        { desc: "Mutable borrow (exclusive)", code: `fn push(v: &mut Vec<i32>) { v.push(1); }` },
        { desc: "Clone when you must copy", code: `let b = a.clone();` },
        { desc: "Copy types (implicit)", code: `let x = 5; let y = x; // both valid (i32 is Copy)` },
      ],
    },
    {
      title: "Fighting the borrow checker",
      items: [
        { desc: "Can't borrow &mut twice — split", code: `let (left, right) = v.split_at_mut(mid);` },
        { desc: "Index while mutating — read first", code: `let val = v[i]; // copy out\nv[j] = val;` },
        { desc: "Swap two elements", code: `v.swap(i, j);` },
        { desc: "Take/replace to move out", code: `let old = std::mem::replace(&mut slot, new);\nlet val = std::mem::take(&mut opt); // leaves default` },
      ],
    },
    {
      title: "Option & Result",
      items: [
        { desc: "Unwrap variants", code: `opt.unwrap();       // panic if None\nopt.unwrap_or(0);\nopt.unwrap_or_else(|| f());\nopt.expect("msg");` },
        { desc: "Map / and_then chain", code: `opt.map(|x| x + 1).unwrap_or(0);\nres.and_then(|x| parse(x));` },
        { desc: "? operator (propagate)", code: `let n: i64 = s.parse()?;` },
        { desc: "if let / while let", code: `if let Some(x) = opt { }\nwhile let Some(top) = stack.pop() { }` },
      ],
    },
    {
      title: "Shared mutability",
      items: [
        { desc: "Rc — shared ownership", code: `use std::rc::Rc;\nlet a = Rc::new(5);\nlet b = Rc::clone(&a); // ref count++` },
        { desc: "RefCell — interior mutability", code: `use std::cell::RefCell;\nlet c = RefCell::new(0);\n*c.borrow_mut() += 1;` },
        { desc: "Rc<RefCell<T>> (graph/tree nodes)", code: `let node = Rc::new(RefCell::new(TreeNode::new(1)));` },
      ],
    },
  ],
};
