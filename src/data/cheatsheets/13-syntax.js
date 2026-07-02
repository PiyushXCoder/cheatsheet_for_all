export default {
  id: "syntax",
  title: "Syntax Basics",
  icon: "🦀",
  group: "Language",
  order: 0,
  description: "Bindings, control flow, functions, structs, enums, closures.",
  cards: [
    {
      title: "Variables & functions",
      items: [
        { desc: "Immutable / mutable / const", code: `let x = 5;\nlet mut y = 5;\nconst MAX: usize = 100;` },
        { desc: "Function", code: `fn add(a: i32, b: i32) -> i32 { a + b } // no semicolon = return` },
        { desc: "Shadowing", code: `let x = "5";\nlet x: i32 = x.parse().unwrap();` },
        { desc: "Tuple destructure", code: `let (a, b) = (1, 2);` },
      ],
    },
    {
      title: "Control flow",
      items: [
        { desc: "if is an expression", code: `let s = if x > 0 { "pos" } else { "neg" };` },
        { desc: "loop with break value", code: `let r = loop { break 42; };` },
        { desc: "while / for", code: `while cond { }\nfor i in 0..n { }` },
        { desc: "match", code: `match x {\n    0 => "zero",\n    1 | 2 => "small",\n    3..=9 => "mid",\n    _ => "big",\n}` },
        { desc: "labeled break", code: `'outer: for i in 0..n {\n    for j in 0..n { if done { break 'outer; } }\n}` },
      ],
    },
    {
      title: "Structs & enums",
      items: [
        { desc: "Struct + impl", code: `#[derive(Debug, Clone)]\nstruct P { x: i32, y: i32 }\nimpl P {\n    fn new(x: i32, y: i32) -> Self { Self { x, y } }\n    fn norm(&self) -> i32 { self.x * self.x + self.y * self.y }\n}` },
        { desc: "Enum + match", code: `enum Op { Add, Sub }\nmatch op { Op::Add => a + b, Op::Sub => a - b }` },
        { desc: "Common derives", code: `#[derive(Debug, Clone, PartialEq, Eq, Hash, PartialOrd, Ord)]` },
      ],
    },
    {
      title: "Closures & printing",
      items: [
        { desc: "Closures", code: `let sq = |x: i32| x * x;\nlet add = move |a, b| a + b;` },
        { desc: "Print / debug / format", code: `println!("{}", x);\nprintln!("{x} and {y}");\nprintln!("{:?}", v);   // Debug\nprintln!("{:#?}", v);  // pretty` },
        { desc: "Assertions (great for tests)", code: `assert_eq!(add(2, 3), 5);\ndebug_assert!(i < n);` },
      ],
    },
  ],
};
