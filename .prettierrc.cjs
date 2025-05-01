module.exports = {
  // 1. 基本配置
  printWidth: 100, // 每行代码长度（默认80）
  tabWidth: 2, // 每个tab相当于多少个空格（默认2）
  useTabs: false, // 使用tab缩进而不是空格（默认false）
  semi: false, // 在语句末尾添加分号（默认true）

  // 2. 引号相关
  singleQuote: true, // 使用单引号代替双引号（默认false）
  quoteProps: 'as-needed', // 对象属性引号使用 as-needed|consistent|preserve
  jsxSingleQuote: true, // 在JSX中使用单引号代替双引号（默认false）

  // 3. 尾随逗号
  trailingComma: 'es5', // 多行时尽可能打印尾随逗号 none|es5|all

  // 4. 括号相关
  bracketSpacing: true, // 在对象字面量括号之间打印空格（默认true）
  bracketSameLine: true, // 将多行HTML（HTML、JSX、Vue、Angular）元素的 > 放在最后一行的末尾（默认false）
  arrowParens: 'always', // 箭头函数参数周围包含括号 always|avoid

  // 5. 其他格式化选项
  proseWrap: 'preserve', // 散文换行 always|never|preserve
  htmlWhitespaceSensitivity: 'css', // HTML空白敏感性 css|strict|ignore
  endOfLine: 'lf', // 换行符类型 lf|crlf|cr|auto
  embeddedLanguageFormatting: 'auto', // 是否格式化嵌入的代码 auto|off

  // 6. 特定文件格式配置
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200,
      },
    },
    {
      files: '*.html',
      options: {
        parser: 'html',
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
      },
    },
  ],
}
