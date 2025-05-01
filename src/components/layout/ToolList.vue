<script setup>
import { useToolStore } from '@/stores/toolStore'
const store = useToolStore()
</script>

<template>
  <div class="content">
    <h2 class="section-title">
      <i :class="store.getCategoryIcon(store.selectedCategory)"></i>
      {{ store.getCategoryName(store.selectedCategory) }}工具
    </h2>

    <div class="tools-grid">
      <div
        class="tool-card"
        v-for="tool in store.filteredTools"
        :key="tool.id"
        @click="store.openTool(tool.id)">
        <div class="tool-header">
          <div class="tool-icon">
            <i :class="tool.icon"></i>
          </div>
          <div>
            <div class="tool-title">{{ tool.name }}</div>
            <div class="tool-category">{{ tool.categoryName }}</div>
          </div>
        </div>
        <div class="tool-desc">{{ tool.description }}</div>
        <el-button type="primary" size="small" @click.stop="store.openTool(tool.id)">
          立即使用</el-button
        >
      </div>
    </div>

    <div v-if="store.selectedCategory === 'all'">
      <h2 class="section-title">
        <i class="fas fa-fire"></i>
        热门工具推荐
      </h2>
      <div class="popular-tools">
        <div
          class="popular-tool"
          v-for="tool in store.popularTools"
          :key="tool.id"
          @click="store.openTool(tool.id)">
          <div class="popular-tool-icon">
            <i :class="tool.icon"></i>
          </div>
          <div>
            <div class="popular-tool-name">{{ tool.name }}</div>
            <div class="popular-tool-category">{{ tool.categoryName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
