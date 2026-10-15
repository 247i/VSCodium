# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目架构

这是一个 VSCode 扩展项目，用于管理 gettext 国际化翻译。项目采用以下技术栈：

- **主要框架**: Vue 3 + TypeScript + Vite
- **扩展开发**: reactive-vscode (VSCode 扩展开发框架)
- **构建工具**: Vite + @tomjs/vite-plugin-vscode
- **样式**: UnoCSS
- **AI 集成**: ai SDK，支持多种 AI 提供商（OpenAI、Anthropic、Deepseek 等）
- **状态管理**: Pinia
- **PO 文件解析**: gettext-parser

## 项目结构

```
src/              # Webview 前端代码（Vue 应用）
├── components/   # Vue 组件
├── views/        # 页面视图
├── store/        # Pinia 状态管理
├── composables/  # Vue 组合式函数
└── main.ts       # 前端入口

extension/        # VSCode 扩展后端代码
├── composables/  # 扩展逻辑组合函数
├── providers/    # TreeView 和其他 VSCode 服务提供者
├── commands/     # VSCode 命令处理
└── index.ts      # 扩展入口

constants/        # 共享常量定义
```

## 常用开发命令

```bash
# 开发构建（监视模式）
npm run dev

# 生产构建
npm run build

# 类型检查
npm run typecheck

# 代码检查
npm run lint

# 修复 lint 问题
npm run lint:fix

# 本地化
npm run l10n:export    # 导出本地化字符串
npm run l10n:sync      # 同步本地化文件

# 打包扩展
npm run package

# 发布
npm run release
```

## 核心架构模式

### 双端架构
- **扩展端**: 运行在 VSCode 扩展主机中，处理文件系统、配置、AI 翻译等
- **Webview 端**: Vue 应用，提供翻译编辑界面

### 消息通信
扩展端和 Webview 端通过消息系统通信：
- `extension/composables/message/` - 扩展端消息处理
- `src/composables/useMessageListener.ts` - Webview 端消息监听

### Provider 模式
使用多个 TreeView 提供者管理不同的视图：
- `FileTranslationProvider` - 当前文件翻译视图
- `ProgressProvider` - 翻译进度视图
- `EntryListProvider` - 翻译条目列表
- `WorkspaceProvider` - 工作区选择器

### 配置管理
- `useLocale` - 本地化配置（文件路径模式等）
- `useAIConfig` - AI 翻译配置
- `useVscodeConfig` - VSCode 设置集成

### PO 文件处理
- `usePoLoader` - PO 文件加载和解析
- `usePoWatcher` - 文件变更监视
- `usePoData` - PO 数据管理和缓存
- `useFileLock` - 文件锁定机制

## AI 翻译系统

支持多种 AI 提供商，配置通过 VSCode 设置或 `.i18n-gettext.secret` 文件：
- 批量翻译功能
- 翻译质量审查
- 可配置的附加提示词

## 开发注意事项

- 所有注释使用英文
- Commit 消息使用英文
- 遵循 @antfu/eslint-config 代码规范
- TypeScript 严格模式，但允许 `@ts-ignore` 用于特定场景
- 使用 reactive-vscode 框架的组合式 API 模式
- Webview CSP 策略需考虑安全性

## 本地化

- 使用 VSCode l10n 系统
- 支持中英双语
- 所有用户可见字符串都需要本地化处理
