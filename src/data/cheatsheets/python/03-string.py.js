export default {
  lang: "python",
  id: "py-string",
  title: "Strings",
  icon: "abc",
  group: "Collections",
  order: 2,
  description: "Immutable text — slicing, methods, and char math.",
  cards: [
    {
      title: "Basics & immutability",
      items: [
        { desc: "Immutable", code: `s = "abc"\n# s[0] = "x"  -> TypeError` },
        { desc: "Edit via list", code: `chars = list(s)\nchars[0] = "x"\ns = "".join(chars)` },
        { desc: "Concatenate", code: `s = a + b\ns += "!"  # O(n), avoid in loops` },
        { desc: "Repeat", code: `"ab" * 3  # 'ababab'` },
        { desc: "Length / iterate", code: `len(s)\nfor c in s:\n    ...` },
      ],
    },
    {
      title: "f-strings & format",
      items: [
        { desc: "Interpolate", code: `f"{name} is {age}"` },
        { desc: "Precision / width", code: `f"{x:.3f}"\nf"{n:04d}"  # zero pad` },
        { desc: "Join list of strs", code: `",".join(["a", "b", "c"])  # 'a,b,c'` },
        { desc: "Join ints", code: `" ".join(map(str, nums))` },
      ],
    },
    {
      title: "Common methods",
      items: [
        { desc: "Split / rsplit", code: `s.split()        # by whitespace\ns.split(",")\ns.split(",", 1)  # max 1 split` },
        { desc: "Strip", code: `s.strip()\ns.lstrip()  s.rstrip()\ns.strip(".,!")` },
        { desc: "Replace", code: `s.replace("a", "b")\ns.replace(" ", "", 1)` },
        { desc: "Find / index", code: `s.find("x")   # -1 if absent\ns.index("x")  # ValueError if absent\ns.startswith("ab")  s.endswith("z")` },
        { desc: "Case", code: `s.lower()  s.upper()\ns.capitalize()  s.title()` },
      ],
    },
    {
      title: "Slicing",
      items: [
        { desc: "Substring", code: `s[l:r]\ns[:k]  s[k:]` },
        { desc: "Reverse", code: `s[::-1]` },
        { desc: "Palindrome check", code: `s == s[::-1]` },
        { desc: "Last char / prefix", code: `s[-1]\ns[:-1]  # drop last` },
      ],
    },
    {
      title: "Char math & tests",
      items: [
        { desc: "char -> code", code: `ord("a")   # 97\nord("A")   # 65` },
        { desc: "code -> char", code: `chr(97)    # 'a'` },
        { desc: "Letter index a..z", code: `ord(c) - ord("a")  # 0..25` },
        { desc: "Predicates", code: `c.isdigit()  c.isalpha()\nc.isalnum()  c.isspace()\nc.islower()  c.isupper()` },
        { desc: "Count", code: `s.count("a")` },
      ],
    },
  ],
};
