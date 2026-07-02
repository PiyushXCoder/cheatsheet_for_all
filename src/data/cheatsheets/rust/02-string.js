export default {
  id: "string",
  title: "String & &str",
  icon: "abc",
  group: "Collections",
  order: 2,
  description: "Owned String vs borrowed &str, chars, bytes, parsing.",
  cards: [
    {
      title: "Create & convert",
      items: [
        { desc: "Owned empty / from literal", code: `let mut s = String::new();\nlet s = String::from("abc");\nlet s = "abc".to_string();` },
        { desc: "&str slice from String", code: `let sl: &str = &s;` },
        { desc: "char / bytes -> String", code: `let s: String = vec!['a','b'].iter().collect();\nlet s = String::from_utf8(bytes).unwrap();` },
        { desc: "Repeat", code: `let s = "ab".repeat(3); // "ababab"` },
      ],
    },
    {
      title: "Chars & bytes",
      items: [
        { desc: "Iterate chars (Unicode scalar)", code: `for c in s.chars() { }` },
        { desc: "Iterate bytes (u8)", code: `for b in s.bytes() { }` },
        { desc: "As Vec<char> for random access", code: `let cs: Vec<char> = s.chars().collect();` },
        { desc: "As &[u8] (ASCII DSA)", code: `let b = s.as_bytes(); // b[i] is u8` },
        { desc: "Nth char", code: `let c = s.chars().nth(2);` },
        { desc: "char <-> digit", code: `let d = c.to_digit(10).unwrap();\nlet c = std::char::from_digit(d, 10).unwrap();` },
      ],
    },
    {
      title: "Build & mutate",
      items: [
        { desc: "Push char / str", code: `s.push('x');\ns.push_str("yz");` },
        { desc: "Concatenate", code: `let s = format!("{a}{b}");\nlet s = a + &b; // a owned, b &str` },
        { desc: "Pop last char", code: `let c = s.pop();` },
        { desc: "Clear", code: `s.clear();` },
      ],
    },
    {
      title: "Search & test",
      items: [
        { desc: "Contains / starts / ends", code: `s.contains("ab");\ns.starts_with('a');\ns.ends_with("z");` },
        { desc: "Find index (byte offset)", code: `let i = s.find('b'); // Option<usize>` },
        { desc: "Case", code: `s.to_lowercase();\ns.to_uppercase();` },
        { desc: "Char class checks", code: `c.is_alphabetic(); c.is_numeric();\nc.is_alphanumeric(); c.is_whitespace();` },
      ],
    },
    {
      title: "Split, trim, parse",
      items: [
        { desc: "Split on delimiter", code: `let parts: Vec<&str> = s.split(',').collect();\nfor w in s.split_whitespace() { }` },
        { desc: "Lines", code: `for line in s.lines() { }` },
        { desc: "Trim", code: `let t = s.trim();` },
        { desc: "Parse to number", code: `let n: i64 = s.trim().parse().unwrap();` },
        { desc: "Reverse a string", code: `let r: String = s.chars().rev().collect();` },
        { desc: "Replace", code: `let r = s.replace("a", "x");` },
      ],
    },
  ],
};
