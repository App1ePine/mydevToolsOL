<script setup>
import { useToolStore } from '@/stores/toolStore'
const store = useToolStore()
</script>

<template>
  <header class="header">
    <div class="logo">
      <i class="fas fa-code"></i>
      <span>DevTools - 程序员编程工具集</span>
    </div>
    <div class="header-actions">
      <el-input
        class="search-input"
        placeholder="搜索工具..."
        prefix-icon="el-icon-search"
        v-model="store.searchQuery"
        clearable />
    </div>
  </header>
</template>
