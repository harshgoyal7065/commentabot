export const LANGUAGE_EXT_TO_COMMENT_MAP = {
  js: "//",
  ts: "//",
  java: "//",
  py: "#",
  rb: "#",
  php: "//",
  c: "//",
  cpp: "//",
  h: "//",
  html: "<!--",
  css: "/*",
  md: null, // Markdown files usually don't have inline comments
  cs: "//", // C#
  go: "//", // Go
  swift: "//", // Swift
  kt: "//", // Kotlin
  rs: "//", // Rust
  sh: "#", // Shell scripts
  pl: "#", // Perl
  r: "#", // R
  yaml: "#", // YAML
  yml: "#", // YAML
  xml: "<!--", // XML
  json: null, // JSON does not support comments
  txt: null, // Plain text does not support comments
  ini: ";", // INI files
  tex: "%", // LaTeX
  lua: "--", // Lua
  vb: "'", // Visual Basic
  sql: "--", // SQL
  asp: "'", // Classic ASP
  jsp: "//", // Java Server Pages
  scala: "//", // Scala
};
