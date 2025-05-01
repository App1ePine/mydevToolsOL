<script setup>
import { ref, watch, computed } from 'vue';

const regex = ref('');
const regexOptions = ref('g');
const testText = ref('');
const replaceText = ref('');
const result = ref('');
const replaceResult = ref('');
const showCommonPatterns = ref(true); // 默认显示常用正则

// 常用正则表达式模板
const commonPatterns = [
	{
		category: '数字校验',
		patterns: [
			{ name: '整数', pattern: '^\\d+$', example: '123' },
			{ name: '小数', pattern: '^\\d+\\.\\d+$', example: '123.45' },
			{ name: '正整数', pattern: '^[1-9]\\d*$', example: '123' },
			{ name: '负整数', pattern: '^-[1-9]\\d*$', example: '-123' },
			{ name: '非负整数', pattern: '^(0|[1-9]\\d*)$', example: '0, 123' },
			{ name: '非正整数', pattern: '^(0|-[1-9]\\d*)$', example: '0, -123' },
			{
				name: '正小数',
				pattern: '^[1-9]\\d*\\.\\d+$|^0\\.\\d*[1-9]\\d*$',
				example: '123.45',
			},
			{
				name: '负小数',
				pattern: '^-([1-9]\\d*\\.\\d+|0\\.\\d*[1-9])$',
				example: '-123.45',
			},
		],
	},
	{
		category: '字符校验',
		patterns: [
			{ name: '英文字母', pattern: '^[A-Za-z]+$', example: 'abc' },
			{ name: '大写字母', pattern: '^[A-Z]+$', example: 'ABC' },
			{ name: '小写字母', pattern: '^[a-z]+$', example: 'abc' },
			{ name: '英文和数字', pattern: '^[A-Za-z0-9]+$', example: 'abc123' },
			{
				name: '中文字符',
				pattern: '^[\\u4e00-\\u9fa5]+$',
				example: '中文字符',
			},
			{
				name: '双字节字符',
				pattern: '[^\\x00-\\xff]',
				example: '中文，日文，韩文等',
			},
		],
	},
	{
		category: '特殊需求',
		patterns: [
			{
				name: 'Email地址',
				pattern: '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$',
				example: 'test@example.com',
			},
			{
				name: 'URL地址',
				pattern: '^(https?|ftp)://[^\\s/$.?#].[^\\s]*$',
				example: 'https://example.com',
			},
			{ name: '手机号码', pattern: '^1[3-9]\\d{9}$', example: '13800138000' },
			{
				name: '身份证号',
				pattern:
					'^[1-9]\\d{5}(19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[0-9Xx]$',
				example: '110101199001011234',
			},
			{
				name: 'IP地址',
				pattern:
					'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
				example: '192.168.1.1',
			},
			{ name: '邮政编码', pattern: '^[1-9]\\d{5}$', example: '100000' },
			{
				name: '日期格式',
				pattern: '^\\d{4}-\\d{1,2}-\\d{1,2}$',
				example: '2023-01-01',
			},
			{
				name: '时间格式',
				pattern: '^([01]\\d|2[0-3]):([0-5]\\d):([0-5]\\d)$',
				example: '23:59:59',
			},
		],
	},
];

// 工具函数
function testRegex(pattern, options, text) {
	if (!pattern) return '请输入正则表达式';
	if (!text) return '请输入测试文本';

	try {
		const regexObj = new RegExp(pattern, options);
		const matches = [];
		let match;

		// 重置lastIndex以确保多次调用时从头开始匹配
		regexObj.lastIndex = 0;

		while ((match = regexObj.exec(text)) !== null) {
			// 避免无限循环
			if (match.index === regexObj.lastIndex) {
				regexObj.lastIndex++;
			}

			const groups = match.groups || {};
			const groupEntries = Object.entries(groups);

			matches.push({
				index: match.index,
				match: match[0],
				...(groupEntries.length > 0 ? { groups } : {}),
			});

			// 如果不是全局模式，只匹配一次
			if (!options.includes('g')) break;
		}

		if (matches.length === 0) {
			return '没有找到匹配项';
		}

		return JSON.stringify(matches, null, 2);
	} catch (error) {
		return `正则表达式错误: ${error.message}`;
	}
}

function replaceWithRegex(pattern, options, text, replacement) {
	if (!pattern || !text) return '';

	try {
		const regexObj = new RegExp(pattern, options);
		return text.replace(regexObj, replacement);
	} catch (error) {
		return `替换错误: ${error.message}`;
	}
}

// 高亮显示匹配结果
const highlightedText = computed(() => {
	if (!regex.value || !testText.value) return testText.value;

	try {
		const regexObj = new RegExp(regex.value, regexOptions.value);
		return testText.value.replace(
			regexObj,
			(match) => `<mark class="highlight">${match}</mark>`
		);
	} catch (error) {
		return testText.value;
	}
});

// 显示替换结果区域
const showReplaceResult = computed(() => {
	return replaceText.value.trim() !== '';
});

// 使用watch进行实时匹配
watch(
	[regex, testText, regexOptions],
	() => {
		if (regex.value && testText.value) {
			result.value = testRegex(regex.value, regexOptions.value, testText.value);
			if (replaceText.value) {
				replaceResult.value = replaceWithRegex(
					regex.value,
					regexOptions.value,
					testText.value,
					replaceText.value
				);
			}
		} else {
			result.value = '';
		}
	},
	{ immediate: true }
);

// 监听替换文本的变化
watch(replaceText, () => {
	if (regex.value && testText.value && replaceText.value) {
		replaceResult.value = replaceWithRegex(
			regex.value,
			regexOptions.value,
			testText.value,
			replaceText.value
		);
	} else {
		replaceResult.value = '';
	}
});

// 应用常用正则表达式
const applyPattern = (pattern, example) => {
	regex.value = pattern;
	if (!testText.value) {
		testText.value = example;
	}
};

// 修改：使用独立的复选框控制，而不是checkbox-group
const hasGlobalFlag = computed({
	get: () => regexOptions.value.includes('g'),
	set: (value) => toggleOption('g', value),
});

const hasIgnoreCaseFlag = computed({
	get: () => regexOptions.value.includes('i'),
	set: (value) => toggleOption('i', value),
});

const hasMultilineFlag = computed({
	get: () => regexOptions.value.includes('m'),
	set: (value) => toggleOption('m', value),
});

// 修改：更新切换选项的方法，添加value参数
const toggleOption = (option, value) => {
	if (value && !regexOptions.value.includes(option)) {
		regexOptions.value += option;
	} else if (!value && regexOptions.value.includes(option)) {
		regexOptions.value = regexOptions.value.replace(option, '');
	}
};
</script>

<template>
	<div class="regex-tester">
		<div class="tool-header">
			<el-button
				type="primary"
				link
				@click="showCommonPatterns = !showCommonPatterns">
				{{ showCommonPatterns ? '隐藏常用正则' : '显示常用正则' }}
			</el-button>
		</div>

		<!-- 常用正则表达式模板 -->
		<div
			v-if="showCommonPatterns"
			class="common-patterns">
			<el-tabs type="border-card">
				<el-tab-pane
					v-for="category in commonPatterns"
					:key="category.category"
					:label="category.category">
					<el-table
						:data="category.patterns"
						style="width: 100%"
						size="small">
						<el-table-column
							prop="name"
							label="名称"
							width="180" />
						<el-table-column
							prop="pattern"
							label="表达式" />
						<el-table-column
							prop="example"
							label="示例" />
						<el-table-column
							label="操作"
							width="100">
							<template #default="scope">
								<el-button
									type="primary"
									link
									@click="applyPattern(scope.row.pattern, scope.row.example)">
									应用
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</div>

		<!-- 正则表达式输入 -->
		<div class="input-section">
			<div class="regex-input-container">
				<el-form-item label="正则表达式">
					<div class="regex-with-options">
						<el-input
							v-model="regex"
							placeholder="输入正则表达式 (不需要/.../ 包围)"
							class="input-field"
							clearable />
						<div class="regex-options">
							<!-- 修改：使用独立的复选框，并且正确绑定值 -->
							<el-checkbox
								v-model="hasGlobalFlag"
								border>
								全局匹配 (g)
							</el-checkbox>
							<el-checkbox
								v-model="hasIgnoreCaseFlag"
								border>
								忽略大小写 (i)
							</el-checkbox>
							<el-checkbox
								v-model="hasMultilineFlag"
								border>
								多行匹配 (m)
							</el-checkbox>
						</div>
					</div>
				</el-form-item>
			</div>
		</div>

		<el-divider content-position="center">输入与输出</el-divider>

		<el-row :gutter="20">
			<!-- 左侧：输入区 -->
			<el-col :span="12">
				<div class="input-output-section">
					<el-form-item label="测试文本">
						<el-input
							v-model="testText"
							type="textarea"
							:rows="8"
							placeholder="输入要测试的文本"
							class="input-field" />
					</el-form-item>

					<el-form-item label="替换文本">
						<el-input
							v-model="replaceText"
							placeholder="输入替换文本（可使用$1, $2引用捕获组）"
							class="input-field"
							clearable />
					</el-form-item>

					<!-- 移动替换结果到这里 -->
					<div
						v-if="showReplaceResult"
						class="replace-result">
						<h4 class="section-label">替换结果</h4>
						<el-card
							class="result-card"
							shadow="never">
							<pre>{{ replaceResult || '无替换结果' }}</pre>
						</el-card>
					</div>
				</div>
			</el-col>

			<!-- 右侧：结果区 -->
			<el-col :span="12">
				<div class="results-section">
					<h4 class="section-label">匹配结果</h4>
					<el-card
						class="result-card"
						shadow="never">
						<div
							v-if="regex && testText"
							v-html="highlightedText"
							class="highlighted-text"></div>
						<pre>{{ result || '输入正则表达式和测试文本查看匹配结果' }}</pre>
					</el-card>
				</div>
			</el-col>
		</el-row>

		<el-divider content-position="center">正则表达式帮助</el-divider>

		<div class="regex-help">
			<el-collapse>
				<el-collapse-item
					title="正则表达式基础"
					name="1">
					<div class="help-content">
						<p><b>元字符：</b> ^ $ . * + ? | \ ( ) [ ] { }</p>
						<p>
							<b>字符类：</b> [abc] 匹配'a'或'b'或'c'， [^abc]
							匹配除了'a'、'b'、'c'之外的字符
						</p>
						<p>
							<b>预定义类：</b> \d 数字， \w 字母数字下划线， \s 空白符， \D
							非数字， \W 非字母数字下划线， \S 非空白符
						</p>
						<p>
							<b>重复：</b> * 零或多次， + 一或多次， ? 零或一次， {n} 恰好n次，
							{n,} 至少n次， {n,m} n到m次
						</p>
						<p><b>捕获组：</b> (pattern) 捕获匹配的子串</p>
						<p class="code-example">
							例如: <code>(\d{3})-(\d{4})</code> 能匹配 "123-4567" 并捕获 "123"
							和 "4567" 作为组1和组2
						</p>
						<p><b>非捕获组：</b> (?:pattern) 匹配但不捕获</p>
						<p>
							<b>命名捕获组：</b> (?&lt;name&gt;pattern)
							给捕获组起名，可以通过名称引用
						</p>
						<p class="code-example">
							例如:
							<code
								>(?&lt;year&gt;\d{4})-(?&lt;month&gt;\d{2})-(?&lt;day&gt;\d{2})</code
							>
							匹配日期并命名捕获组
						</p>
						<p><b>边界：</b> ^ 行首， $ 行尾， \b 单词边界， \B 非单词边界</p>
					</div>
				</el-collapse-item>
				<el-collapse-item
					title="常用正则表达式技巧"
					name="2">
					<div class="help-content">
						<p><b>转义：</b> 特殊字符前需加反斜杠\来转义，例如 \. 匹配点号</p>
						<p><b>贪婪与懒惰：</b> *?, +?, ?? 懒惰匹配（尽可能少的匹配字符）</p>
						<p class="code-example">
							例如: <code>&lt;.+&gt;</code> 贪婪匹配
							"&lt;div&gt;content&lt;/div&gt;" 整体，而
							<code>&lt;.+?&gt;</code> 懒惰匹配只匹配 "&lt;div&gt;"
						</p>
						<p><b>替换引用：</b> 在替换文本中使用 $1, $2... 引用捕获组</p>
						<p class="code-example">
							例如: 将 "John Smith" 替换为 "Smith, John" 可使用正则
							<code>(\w+)\s+(\w+)</code> 和替换文本 <code>$2, $1</code>
						</p>
						<p><b>前瞻与后顾：</b></p>
						<ul>
							<li>(?=pattern) 正前瞻：匹配位置之后的字符必须匹配pattern</li>
							<li>(?!pattern) 负前瞻：匹配位置之后的字符不能匹配pattern</li>
							<li>(?&lt;=pattern) 正后顾：匹配位置之前的字符必须匹配pattern</li>
							<li>(?&lt;!pattern) 负后顾：匹配位置之前的字符不能匹配pattern</li>
						</ul>
						<p class="code-example">
							例如: <code>\w+(?=@)</code> 匹配邮箱地址中@之前的用户名
						</p>
						<p><b>条件匹配：</b> (?(条件)是|否) 根据条件匹配不同的模式</p>
						<p><b>常见匹配模式：</b></p>
						<ul>
							<li>
								电话号码: <code>\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}</code>
							</li>
							<li>
								强密码:
								<code
									>^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$</code
								>
							</li>
							<li>
								日期验证:
								<code
									>^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$</code
								>
							</li>
						</ul>
					</div>
				</el-collapse-item>
				<el-collapse-item
					title="实用示例"
					name="3">
					<div class="help-content">
						<p>
							<b>匹配HTML标签：</b>
							<code
								>&lt;([a-z]+)(?:\s+[a-z]+=".*?")*\s*&gt;.*?&lt;\/\1&gt;</code
							>
						</p>
						<p><b>提取URL参数：</b> <code>[?&]([^=&]+)=([^&]*)</code></p>
						<p>
							<b>校验十六进制颜色：</b>
							<code>^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$</code>
						</p>
						<p><b>匹配中国大陆手机号：</b> <code>^1[3-9]\d{9}$</code></p>
						<p>
							<b>匹配IPv4地址：</b>
							<code>^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$</code>
						</p>
						<p><b>匹配双字节字符(包括汉字)：</b> <code>[^\x00-\xff]</code></p>
						<p><b>匹配中文和数字：</b> <code>^[\u4e00-\u9fa5\d]+$</code></p>
					</div>
				</el-collapse-item>
			</el-collapse>
		</div>
	</div>
</template>

<style scoped>
.regex-tester {
	padding: 20px;
	max-width: 100%;
	overflow: hidden; /* 防止内容溢出 */
	box-sizing: border-box; /* 确保内边距计入总宽度 */
}

.tool-header {
	display: flex;
	justify-content: flex-end; /* 修改对齐方式 */
	align-items: center;
	margin-bottom: 15px;
}

/* 删除 tool-section-title 样式，因为已经移除了该元素 */

.common-patterns {
	margin-bottom: 20px;
}

.input-section {
	margin-bottom: 20px;
}

.regex-with-options {
	display: flex;
	gap: 15px;
	flex-wrap: wrap;
	align-items: flex-start;
}

.regex-options {
	display: flex;
	gap: 8px;
}

.input-output-section {
	display: flex;
	flex-direction: column;
	gap: 15px;
}

.input-field {
	width: 100%;
}

.input-field :deep(.el-input__wrapper) {
	box-shadow: 0 0 0 1px #dcdfe6 inset;
}

.input-field :deep(.el-textarea__inner) {
	resize: none; /* 禁止手动调整大小 */
	overflow-y: auto; /* 内容溢出时显示滚动条 */
}

.input-field :deep(.el-input__wrapper:hover) {
	box-shadow: 0 0 0 1px #c0c4cc inset;
}

.input-field :deep(.el-input__wrapper.is-focus) {
	box-shadow: 0 0 0 1px #409eff inset;
}

.results-section {
	display: flex;
	flex-direction: column;
	gap: 15px;
}

.section-label {
	margin: 0 0 8px 0;
	color: #303133;
	font-size: 15px;
	font-weight: 600;
}

.result-card {
	background-color: #f5f7fa;
	border: none;
	box-shadow: none;
	margin-bottom: 15px;
}

.result-card pre {
	margin: 0;
	white-space: pre-wrap; /* 允许文本换行 */
	word-wrap: break-word; /* 允许在单词中换行 */
	font-family: monospace;
	font-size: 14px;
	line-height: 1.5;
	color: #606266;
	overflow: auto; /* 内容溢出时显示滚动条 */
	max-height: 300px; /* 限制最大高度 */
}

.replace-result {
	margin-top: 15px;
}

.highlighted-text {
	padding: 10px;
	background-color: #ffffff;
	border-radius: 4px;
	border: 1px solid #ebeef5;
	margin-bottom: 10px;
	font-family: monospace;
	white-space: pre-wrap;
	word-wrap: break-word;
	overflow: auto; /* 内容溢出时显示滚动条 */
	max-height: 200px; /* 限制最大高度 */
}

.regex-help {
	margin-top: 20px;
}

.help-content {
	line-height: 1.6;
	color: #606266;
}

.help-content p {
	margin: 8px 0;
}

.help-content ul {
	padding-left: 20px;
	margin: 8px 0;
}

.help-content li {
	margin-bottom: 5px;
}

.code-example {
	background-color: #f5f7fa;
	padding: 8px 12px;
	border-left: 3px solid #409eff;
	margin: 10px 0;
	border-radius: 0 4px 4px 0;
}

.code-example code {
	font-family: monospace;
	color: #c41d7f;
	background-color: rgba(0, 0, 0, 0.04);
	padding: 2px 4px;
	border-radius: 3px;
}

:deep(.el-tabs__header) {
	margin-bottom: 0;
}

:deep(.el-checkbox.is-bordered) {
	margin-right: 8px;
	padding: 6px 12px;
}

:deep(.el-divider__text) {
	color: #909399;
	font-size: 14px;
}
</style>
