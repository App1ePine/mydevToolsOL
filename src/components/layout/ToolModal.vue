<script setup>
import { ref, computed } from 'vue'
import { useToolStore } from '@/stores/toolStore'
import RegexTester from '@/components/tools/code/RegexTester.vue'
import Base64Converter from '@/components/tools/text/Base64Converter.vue'
import JsonFormatter from '@/components/tools/data/JsonFormatter.vue'

const store = useToolStore()

// 计算属性转换currentTool为布尔值，解决modelValue警告
const dialogVisible = computed({
  get: () => !!store.currentTool,
  set: (val) => {
    if (!val) store.closeTool()
  },
})
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="store.currentTool?.name"
    width="80%"
    :before-close="store.closeTool"
    class="tool-modal"
    append-to-body>
    <RegexTester v-if="store.currentTool?.id === 'regex'" :key="`regex-${store.currentTool.id}`" />
    <Base64Converter
      v-else-if="store.currentTool?.id === 'base64'"
      :key="`base64-${store.currentTool.id}`" />
    <JsonFormatter
      v-else-if="store.currentTool?.id === 'json'"
      :key="`json-${store.currentTool.id}`" />
    <div v-else>
      <p>工具内容正在开发中...</p>
    </div>
  </el-dialog>
</template>

<style scoped>
/* 添加样式来美化对话框标题 */
:deep(.el-dialog__title) {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  position: relative;
  padding-left: 12px;
}

:deep(.el-dialog__title)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 18px;
  background-color: #409eff;
  border-radius: 2px;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 15px;
  margin-bottom: 5px;
}

:deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-dialog__body) {
  overflow: hidden; /* 防止内容溢出 */
  padding: 0; /* 移除默认内边距，由内部组件控制 */
}
</style>
