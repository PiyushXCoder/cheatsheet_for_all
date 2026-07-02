export default {
  id: "io",
  title: "Competitive I/O",
  icon: "⌨️",
  group: "I/O & Misc",
  order: 12,
  description: "Fast stdin/stdout reading for Codeforces / competitive judges.",
  cards: [
    {
      title: "Read all of stdin",
      items: [
        { desc: "Slurp everything", code: `use std::io::{self, Read};\nlet mut input = String::new();\nio::stdin().read_to_string(&mut input).unwrap();` },
        { desc: "Split into a token stream", code: `let mut it = input.split_whitespace();\nlet n: usize = it.next().unwrap().parse().unwrap();` },
        { desc: "Read n numbers into a Vec", code: `let v: Vec<i64> = (0..n)\n    .map(|_| it.next().unwrap().parse().unwrap())\n    .collect();` },
      ],
    },
    {
      title: "Line-based reading",
      items: [
        { desc: "One line", code: `let mut line = String::new();\nio::stdin().read_line(&mut line).unwrap();\nlet n: i32 = line.trim().parse().unwrap();` },
        { desc: "Parse space-separated on a line", code: `let nums: Vec<i64> = line.trim().split_whitespace()\n    .map(|x| x.parse().unwrap()).collect();` },
      ],
    },
    {
      title: "Fast output",
      items: [
        { desc: "Buffered writer (avoid slow print!)", code: `use std::io::{self, Write, BufWriter};\nlet stdout = io::stdout();\nlet mut out = BufWriter::new(stdout.lock());\nwriteln!(out, "{}", ans).unwrap();` },
        { desc: "Print a Vec space-separated", code: `let line = v.iter().map(|x| x.to_string())\n    .collect::<Vec<_>>().join(" ");\nprintln!("{line}");` },
      ],
    },
    {
      title: "Handy scan macro",
      items: [
        { desc: "Tiny read! helper", code: `macro_rules! read {\n    ($it:expr, $t:ty) => {\n        $it.next().unwrap().parse::<$t>().unwrap()\n    };\n}\n// let x = read!(it, i64);` },
      ],
    },
  ],
};
