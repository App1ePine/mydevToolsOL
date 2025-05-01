<script setup>
import AppHeader from '@/components/layout/AppHeader.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
import ToolList from '@/components/layout/ToolList.vue';
import ToolModal from '@/components/layout/ToolModal.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import '@/assets/css/app.css';
</script>

<template>
	<div
		id="app"
		class="app-container">
		<AppHeader />

		<div class="main-container">
			<Sidebar />
			<ToolList />
		</div>

		<AppFooter />
		<ToolModal />
	</div>
</template>
