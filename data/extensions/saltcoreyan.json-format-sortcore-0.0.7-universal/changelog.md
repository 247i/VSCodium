# Change Log

All notable changes to the "jsonformat" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

## [0.0.6]

- 格式化时原样保留超过 JavaScript 安全范围的整数。
- 单个 JSON/JSONC 片段也会保留前后的非 JSON 文本并原地格式化。
- 修复合法反斜杠字符串和 PHP array 字符串内容被误改的问题。
- 修复 `__proto__` 特殊键丢失、小数输入限制失效以及 worker 资源清理问题。
- 升级开发工具、补充 ESLint 与回归测试，并精简 VSIX 内容。

## [0.0.5]

- Initial release
