<script setup>
import { ref, watch, onMounted, inject, getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus';

// 从全局获取Prism实例
const { proxy } = getCurrentInstance();
const prism = inject('prism'); // 或者直接使用 proxy.$prism

const input = ref('');
const formattedOutput = ref('');
const compressedOutput = ref('');
const validationStatus = ref(''); // 'success', 'error' 或 空字符串
const validationMessage = ref('');

// 工具函数
function formatJson(json) {
	if (!json) return '';
	try {
		const obj = typeof json === 'string' ? JSON.parse(json) : json;
		return JSON.stringify(obj, null, 2);
	} catch (error) {
		throw new Error('JSON 格式化错误: ' + error.message);
	}
}

function compressJson(json) {
	if (!json) return '';
	try {
		const obj = typeof json === 'string' ? JSON.parse(json) : json;
		return JSON.stringify(obj);
	} catch (error) {
		throw new Error('JSON 压缩错误: ' + error.message);
	}
}

function validateJson(json) {
	if (!json) {
		validationStatus.value = '';
		validationMessage.value = '';
		return false;
	}

	try {
		JSON.parse(json);
		validationStatus.value = 'success';
		validationMessage.value = 'JSON 格式正确';
		return true;
	} catch (error) {
		validationStatus.value = 'error';
		validationMessage.value = `JSON 格式错误: ${error.message}`;
		return false;
	}
}

// 复制内容到剪贴板
const copyToClipboard = (text, type) => {
	navigator.clipboard
		.writeText(text)
		.then(() => {
			ElMessage.success(`已复制${type}到剪贴板`);
		})
		.catch(() => {
			ElMessage.error('复制失败，请手动复制');
		});
};

// 监听输入并实时处理
watch(
	input,
	(newValue) => {
		if (!newValue) {
			formattedOutput.value = '';
			compressedOutput.value = '';
			validationStatus.value = '';
			validationMessage.value = '';
			return;
		}

		const isValid = validateJson(newValue);

		if (isValid) {
			try {
				formattedOutput.value = formatJson(newValue);
				compressedOutput.value = compressJson(newValue);
			} catch (e) {
				validationStatus.value = 'error';
				validationMessage.value = e.message;
			}
		} else {
			formattedOutput.value = '';
			compressedOutput.value = '';
		}
	},
	{ immediate: true }
);

// 代码高亮处理函数
const highlightCode = () => {
	if (formattedOutput.value) {
		// 使用全局注册的方法或直接使用Prism
		if (proxy.$highlightCode) {
			proxy.$highlightCode();
		} else {
			setTimeout(() => {
				prism.highlightAll();
			}, 0);
		}
	}
};

// 监听格式化结果变化，触发代码高亮
watch([formattedOutput, compressedOutput], () => {
	highlightCode();
});

onMounted(() => {
	highlightCode();
});
</script>

<template>
	<div class="json-formatter">
		<el-divider content-position="left">JSON 格式化工具</el-divider>

		<el-form class="json-form">
			<!-- JSON 输入框 -->
			<el-form-item class="full-width-form-item">
				<div class="input-container">
					<el-input
						v-model="input"
						type="textarea"
						:rows="10"
						placeholder="输入 JSON 文本，自动格式化和压缩"
						class="input-field full-width"
						:status="validationStatus" />

					<!-- 实时校验状态提示 -->
					<div
						v-if="validationMessage"
						class="validation-message"
						:class="validationStatus">
						<i
							:class="`el-icon-${
								validationStatus === 'success' ? 'check' : 'error'
							}`"></i>
						{{ validationMessage }}
					</div>
				</div>
			</el-form-item>

			<!-- 格式化结果 -->
			<el-divider content-position="left">格式化结果</el-divider>
			<el-form-item class="full-width-form-item">
				<div class="code-container">
					<div class="toolbar">
						<el-button
							type="primary"
							size="small"
							icon="document-copy"
							text
							@click="copyToClipboard(formattedOutput, '格式化结果')"
							:disabled="!formattedOutput">
							复制
						</el-button>
					</div>
					<pre
						v-if="formattedOutput"
						class="language-json code-block"><code>{{ formattedOutput }}</code></pre>
					<div
						v-else
						class="empty-result">
						等待输入有效 JSON...
					</div>
				</div>
			</el-form-item>

			<!-- 压缩结果 -->
			<el-divider content-position="left">压缩结果</el-divider>
			<el-form-item class="full-width-form-item">
				<div class="code-container">
					<div class="toolbar">
						<el-button
							type="primary"
							size="small"
							icon="document-copy"
							text
							@click="copyToClipboard(compressedOutput, '压缩结果')"
							:disabled="!compressedOutput">
							复制
						</el-button>
					</div>
					<pre
						v-if="compressedOutput"
						class="language-json code-block"><code>{{ compressedOutput }}</code></pre>
					<div
						v-else
						class="empty-result">
						等待输入有效 JSON...
					</div>
				</div>
			</el-form-item>
		</el-form>
	</div>
</template>

<style scoped>
.json-formatter {
	padding: 20px;
	width: 100%;
	overflow: hidden; /* 防止内容溢出 */
	box-sizing: border-box; /* 确保内边距计入总宽度 */
}

.json-form {
	width: 100%;
}

.full-width-form-item {
	width: 100%;
	margin-bottom: 20px;
}

.input-container {
	position: relative;
	width: 100%;
}

.input-field {
	font-family: 'Fira Code', 'Consolas', monospace;
}

.full-width {
	width: 100%;
}

.input-field :deep(.el-textarea__inner) {
	box-shadow: 0 0 0 1px #dcdfe6 inset;
	font-size: 14px;
	line-height: 1.5;
	transition: all 0.3s ease;
	padding: 12px;
	width: 100%;
	resize: none; /* 禁止手动调整大小 */
	overflow-y: auto; /* 内容溢出时显示滚动条 */
}

.input-field :deep(.el-textarea__inner:hover) {
	box-shadow: 0 0 0 1px #c0c4cc inset;
}

.input-field :deep(.el-textarea__inner:focus) {
	box-shadow: 0 0 0 1px #409eff inset;
}

.input-field :deep(.el-textarea__inner.is-error) {
	box-shadow: 0 0 0 1px #f56c6c inset;
}

.validation-message {
	margin-top: 5px;
	padding: 5px 10px;
	border-radius: 4px;
	font-size: 12px;
	display: flex;
	align-items: center;
	gap: 5px;
}

.validation-message.success {
	background-color: #f0f9eb;
	color: #67c23a;
}

.validation-message.error {
	background-color: #fef0f0;
	color: #f56c6c;
}

.code-container {
	background-color: #f5f7fa;
	border-radius: 4px;
	box-shadow: 0 0 0 1px #dcdfe6 inset;
	overflow: hidden;
	width: 100%;
	max-width: 100%; /* 限制最大宽度 */
}

.toolbar {
	padding: 6px 12px;
	display: flex;
	justify-content: flex-end;
	background-color: #ebeef5;
	border-bottom: 1px solid #dcdfe6;
}

pre {
	margin: 0;
	padding: 16px;
	overflow: auto; /* 内容溢出时显示滚动条 */
	max-height: 400px;
	width: 100%;
	white-space: pre-wrap; /* 允许文本换行 */
	word-break: break-word; /* 允许在单词中换行 */
}

.code-block {
	min-height: 100px;
}

.empty-result {
	padding: 16px;
	color: #909399;
	font-style: italic;
	text-align: center;
	min-height: 100px;
	display: flex;
	align-items: center;
	justify-content: center;
}

:deep(.el-divider) {
	margin: 16px 0;
}

:deep(.el-divider__text) {
	font-size: 16px;
	color: #606266;
	background-color: #fff;
}

/* 覆盖el-row和el-col样式，防止容器变窄 */
:deep(.el-row) {
	width: 100%;
	margin-left: 0 !important;
	margin-right: 0 !important;
}

:deep(.el-col-24) {
	width: 100%;
	padding-left: 0 !important;
	padding-right: 0 !important;
}
</style>
