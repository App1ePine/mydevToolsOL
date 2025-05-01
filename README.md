# DevTools - 程序员在线工具集

一个基于 Vue 3 和 Element-Plus 的在线工具集合，提供丰富的在线工具。

## 技术栈

- Vue 3 前端框架
- Element Plus UI 组件库
- Pinia 状态管理
- Vite 构建工具
- Font Awesome 图标

## 项目结构

```
src/
├── assets/         # 静态资源
│   └── css/        # 样式文件
├── components/     # Vue 组件
│   ├── layout/           # 布局组件
│   │   ├── AppHeader.vue    # 头部组件 
│   │   ├── AppFooter.vue    # 底部组件
│   │   ├── Sidebar.vue      # 侧边栏组件
│   │   ├── ToolList.vue     # 工具列表
│   │   └── ToolModal.vue    # 工具模态框
│   └── tools/            # 工具组件
│       ├── code/             # 代码相关工具
│       │   └── RegexTester.vue
│       ├── text/             # 文本处理工具 
│       │   └── Base64Converter.vue
│       └── data/             # 数据格式工具
│           └── JsonFormatter.vue
├── stores/         # Pinia 状态管理
│   └── toolStore.js # 工具状态管理
└── App.vue         # 根组件
```

## 功能特性

1. 工具分类管理
   - 代码相关工具
   - 文本处理工具
   - 数据格式工具

2. 内置工具
   - 正则表达式测试
   - JSON 格式化
   - Base64 编解码
   - 更多工具开发中...
