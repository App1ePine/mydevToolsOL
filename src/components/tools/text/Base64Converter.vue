<script setup>
import { ref, watch, onMounted, inject, getCurrentInstance } from 'vue'

// 从全局获取Prism实例
const { proxy } = getCurrentInstance()
const prism = inject('prism') // 或者直接使用 proxy.$prism

// 工具函数
function encodeBase64(text) {
  if (!text) return ''
  try {
    return btoa(encodeURIComponent(text))
  } catch (error) {
    return '编码错误: ' + error.message
  }
}

function decodeBase64(text) {
  if (!text) return ''
  try {
    return decodeURIComponent(atob(text))
  } catch (error) {
    return '解码错误: ' + error.message
  }
}

// 编码相关状态
const originalText = ref('')
const encodedText = ref('')

// 解码相关状态
const base64Text = ref('')
const decodedText = ref('')

// 监听原始文本变化，实时编码
watch(originalText, (newValue) => {
  encodedText.value = encodeBase64(newValue)
})

// 监听Base64文本变化，实时解码
watch(base64Text, (newValue) => {
  decodedText.value = decodeBase64(newValue)
})

// 高亮代码
const highlightCode = () => {
  if (proxy.$highlightCode) {
    proxy.$highlightCode()
  } else if (prism) {
    setTimeout(() => {
      prism.highlightAll()
    }, 0)
  }
}

// 监听结果变化，触发代码高亮
watch([encodedText, decodedText], () => {
  highlightCode()
})

onMounted(() => {
  highlightCode()
})

// 复制内容到剪贴板
const copyToClipboard = (text, type) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      if (proxy.$message) {
        proxy.$message.success(`已复制${type}到剪贴板`)
      }
    })
    .catch(() => {
      if (proxy.$message) {
        proxy.$message.error('复制失败，请手动复制')
      }
    })
}
</script>

<template>
  <div class="base64-converter">
    <el-divider content-position="left">编码</el-divider>
    <el-form class="base64-form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="原始文本">
            <el-input
              v-model="originalText"
              type="textarea"
              :rows="6"
              placeholder="输入要 Base64 编码的文本"
              class="input-field" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="编码结果">
            <div class="code-container">
              <div class="toolbar">
                <el-button
                  type="primary"
                  size="small"
                  icon="document-copy"
                  text
                  @click="copyToClipboard(encodedText, '编码结果')"
                  :disabled="!encodedText">
                  复制
                </el-button>
              </div>
              <pre
                v-if="encodedText"
                class="language-text code-block"><code>{{ encodedText }}</code></pre>
              <div v-else class="empty-result">等待输入文本...</div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-divider content-position="left">解码</el-divider>
    <el-form class="base64-form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Base64 文本">
            <el-input
              v-model="base64Text"
              type="textarea"
              :rows="6"
              placeholder="输入要解码的 Base64 文本"
              class="input-field" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="解码结果">
            <div class="code-container">
              <div class="toolbar">
                <el-button
                  type="primary"
                  size="small"
                  icon="document-copy"
                  text
                  @click="copyToClipboard(decodedText, '解码结果')"
                  :disabled="!decodedText">
                  复制
                </el-button>
              </div>
              <pre
                v-if="decodedText"
                class="language-text code-block"><code>{{ decodedText }}</code></pre>
              <div v-else class="empty-result">等待输入 Base64 文本...</div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped>
.base64-converter {
  padding: 20px;
  width: 100%;
  overflow: hidden; /* 防止内容溢出 */
  box-sizing: border-box; /* 确保内边距计入总宽度 */
}

.base64-form {
  width: 100%;
}

.input-field {
  width: 100%;
}

.input-field :deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.3s ease;
  resize: none; /* 禁止手动调整大小 */
  overflow-y: auto; /* 内容溢出时显示滚动条 */
  padding: 10px;
}

.input-field :deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

.input-field :deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px #409eff inset;
}

.code-container {
  background-color: #f5f7fa;
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  overflow: hidden;
  width: 100%;
  height: 100%;
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
  overflow: auto;
  max-height: 150px;
  width: 100%;
  white-space: pre-wrap; /* 允许文本换行 */
  word-break: break-word; /* 允许在单词中换行 */
}

.code-block {
  min-height: 100px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
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

.el-divider {
  margin: 24px 0;
}

.el-divider__text {
  font-size: 16px;
  color: #606266;
}

/* 覆盖el-row和el-col样式，防止容器变窄 */
:deep(.el-row) {
  width: 100%;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

:deep(.el-col-12) {
  padding-left: 10px !important;
  padding-right: 10px !important;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}
</style>
