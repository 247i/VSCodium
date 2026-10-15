# json-format

在编辑器中解析并格式化 JSON/类 JSON 文本。[vscode插件地址](https://marketplace.visualstudio.com/items?itemName=saltcoreyan.json-format-sortcore)

示例：
- 格式化json字符串，可以识别“{”与“}”之间的内容
![](https://github.com/SaltcoreYan/vscode-json-format/raw/HEAD/images/format_json.gif)

- 将php打印出的数组字符串，格式化为json字符串，可以识别“array(”与“)”之间的内容
![](https://github.com/SaltcoreYan/vscode-json-format/raw/HEAD/images/format_array.gif)

功能：
- 灵活解析：原始 JSON、被转义包裹的 JSON、多层转义。
- 大整数保真：超过 JavaScript 安全整数范围的整数在格式化后保持原始数字文本和 JSON 数字类型。
- 片段原地格式化：日志/文本中包含一个或多个原始 JSON/JSONC 片段时，会保留前后的非 JSON 文本，并将各 JSON 片段换到独立行后原地格式化。
- Unicode 还原：支持 \uXXXX、代理对、十六进制和常见控制字符转义，同时保留字符串中的引号、斜杠和反斜杠。
- 可容错（可选）：支持注释与尾逗号（JSONC）。
- PHP array 解析不会修改字符串内部的 `NULL`、`array(` 等文本，并支持大小写关键字、指数数字和 `(object) array`。
- 小输入走主线程快速路径，大输入用 worker 分流。
- 遵循编辑器缩进与换行。
- 输入大小限制，避免阻塞（可配置）。

命令：
- json-format: 格式化 JSON（默认快捷键：Ctrl+Alt+J）

设置：
- json-format.maxInputSizeMB（number，默认 2）：最大解析输入大小（MB），支持小数；0 表示不限制。
- json-format.decodeUnicode（boolean，默认 true）：是否还原 Unicode 转义。

使用方式：
- 选中文本或直接对整文件运行命令，扩展会解析、还原并格式化输出。
