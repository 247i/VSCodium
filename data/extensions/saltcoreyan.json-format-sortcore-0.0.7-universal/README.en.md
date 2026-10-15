# json-format

Format and normalize JSON or JSON-like strings in the editor.

Features:
- Flexible parsing: raw JSON, JSON in escaped strings, multi-layer escapes.
- Lossless large integers: integers outside JavaScript's safe range keep their original digits and JSON number type.
- In-place fragment formatting: when logs or text contain one or more raw JSON/JSONC fragments, surrounding non-JSON text is preserved and each fragment is moved to its own line before formatting.
- Unicode unescaping: restore \uXXXX, surrogate pairs, hexadecimal escapes, and common control characters while preserving literal quotes, slashes, and backslashes.
- JSONC tolerant (optional in parser): comments and trailing commas.
- PHP array parsing preserves keyword-like text inside strings and supports case-insensitive keywords, exponent numbers, and `(object) array`.
- Fast path for small inputs; worker offloading for large/complex cases.
- Honors editor indentation (tabSize/insertSpaces) and EOL.
- Size limit to avoid blocking (configurable).

Command:
- json-format: 格式化 JSON (Default: Ctrl+Alt+J)

Settings:
- json-format.maxInputSizeMB (number, default 2): Max input size in MB; decimals are supported and 0 means unlimited.
- json-format.decodeUnicode (boolean, default true): Whether to unescape Unicode sequences.

Usage:
- Select a region or run the command on the whole file. The extension parses, decodes, and formats the JSON.
