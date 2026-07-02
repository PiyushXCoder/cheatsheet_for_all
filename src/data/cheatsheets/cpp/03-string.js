export default {
  lang: "cpp",
  id: "cpp-string",
  title: "string",
  icon: "🔤",
  group: "Collections",
  order: 2,
  description: "std::string operations for parsing and text problems.",
  cards: [
    {
      title: "Create & convert",
      items: [
        { desc: "Literal", code: `string s = "hello";` },
        { desc: "N copies of a char", code: `string s(n, 'a'); // "aaaa..."` },
        { desc: "Number ↔ string", code: `string s = to_string(42);\nint n = stoi(s);\nll m = stoll(s);` },
        { desc: "char ↔ int digit", code: `int d = c - '0';\nchar c = '0' + d;` },
        { desc: "To C-string", code: `const char* p = s.c_str();` },
      ],
    },
    {
      title: "Build & mutate",
      items: [
        { desc: "Append", code: `s += "x";\ns.push_back('y');\ns.append(3, '!');` },
        { desc: "Insert / erase", code: `s.insert(2, "ab");\ns.erase(2, 3); // pos, len` },
        { desc: "Substring", code: `string sub = s.substr(1, 3); // pos, len` },
        { desc: "Replace", code: `s.replace(0, 2, "XY");` },
        { desc: "Reverse", code: `reverse(s.begin(), s.end());` },
      ],
    },
    {
      title: "Access & inspect",
      items: [
        { desc: "Index", code: `char c = s[0];\ns[0] = 'H';` },
        { desc: "Length / empty", code: `s.size(); s.empty();` },
        { desc: "Front / back", code: `s.front(); s.back();` },
        { desc: "Find substring", code: `size_t p = s.find("lo");\nif (p != string::npos) { }` },
        { desc: "Compare", code: `if (a == b) { }\nint c = a.compare(b);` },
      ],
    },
    {
      title: "Char classification",
      items: [
        { desc: "Predicates", code: `isdigit(c); isalpha(c); isalnum(c);\nisspace(c); isupper(c); islower(c);` },
        { desc: "Case convert", code: `char u = toupper(c);\nchar l = tolower(c);` },
        { desc: "Lowercase whole string", code: `for (char& c : s) c = tolower(c);` },
      ],
    },
    {
      title: "Split, trim, parse",
      items: [
        { desc: "Split by space (stringstream)", code: `stringstream ss(s);\nstring tok;\nwhile (ss >> tok) words.push_back(tok);` },
        { desc: "Split by delimiter", code: `while (getline(ss, tok, ',')) parts.push_back(tok);` },
        { desc: "Count occurrences", code: `int cnt = count(s.begin(), s.end(), 'a');` },
        { desc: "Sort chars (anagram key)", code: `sort(s.begin(), s.end());` },
      ],
    },
  ],
};
