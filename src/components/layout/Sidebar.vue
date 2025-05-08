<script setup>
import { useToolStore } from '@/stores/toolStore'
const store = useToolStore()
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-card">
      <h3 class="sidebar-title">工具分类</h3>
      <div v-for="category in store.categories" :key="category.id">
        <div
          class="category-item"
          :class="{ active: store.selectedCategory === category.id }"
          @click="store.selectedCategory = category.id">
          <i :class="category.icon"></i>
          <span>{{ category.name }}</span>
          <span class="category-count">{{ category.count }}</span>
        </div>
      </div>
    </div>

    <div class="sidebar-card">
      <h3 class="sidebar-title">最近使用</h3>
      <div
        class="category-item"
        v-for="recent in store.recentTools"
        :key="recent.id"
        @click="store.openTool(recent.id)">
        <i :class="recent.icon"></i>
        <span>{{ recent.name }}</span>
      </div>
    </div>
  </aside>
</template>
