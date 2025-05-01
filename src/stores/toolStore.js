import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useToolStore = defineStore('tool', () => {
	const tools = [
		{
			id: 'regex',
			name: '正则表达式测试',
			icon: 'fas fa-not-equal',
			category: 'code',
			categoryName: '代码相关',
			description: '在线测试和调试正则表达式',
		},
		{
			id: 'base64',
			name: 'Base64编码/解码',
			icon: 'fas fa-lock',
			category: 'text',
			categoryName: '文本处理',
			description: 'Base64编码和解码工具',
		},
		{
			id: 'json',
			name: 'JSON格式化',
			icon: 'fas fa-indent',
			category: 'data',
			categoryName: '数据格式',
			description: '格式化、压缩和验证JSON数据',
		},
	];

	const categories = [
		{ id: 'all', name: '全部', icon: 'fas fa-th', count: tools.length },
		{
			id: 'code',
			name: '代码相关',
			icon: 'fas fa-code',
			count: tools.filter((t) => t.category === 'code').length,
		},
		{
			id: 'text',
			name: '文本处理',
			icon: 'fas fa-font',
			count: tools.filter((t) => t.category === 'text').length,
		},
		{
			id: 'data',
			name: '数据格式',
			icon: 'fas fa-database',
			count: tools.filter((t) => t.category === 'data').length,
		},
	];

	const currentTool = ref(null);
	const selectedCategory = ref('all');
	const searchQuery = ref('');

	const filteredTools = computed(() => {
		let result =
			selectedCategory.value === 'all'
				? tools
				: tools.filter((tool) => tool.category === selectedCategory.value);

		if (searchQuery.value) {
			const query = searchQuery.value.toLowerCase();
			result = result.filter(
				(tool) =>
					tool.name.toLowerCase().includes(query) ||
					tool.description.toLowerCase().includes(query)
			);
		}
		return result;
	});

	const recentTools = computed(() => tools.slice(0, 3));
	const popularTools = computed(() => tools.slice(0, 4));

	function getCategoryName(categoryId) {
		const category = categories.find((c) => c.id === categoryId);
		return category ? category.name : '全部工具';
	}

	function getCategoryIcon(categoryId) {
		const category = categories.find((c) => c.id === categoryId);
		return category ? category.icon : 'fas fa-th';
	}

	function openTool(toolId) {
		currentTool.value = tools.find((tool) => tool.id === toolId);
	}

	function closeTool() {
		currentTool.value = null;
	}

	return {
		tools,
		categories,
		currentTool,
		selectedCategory,
		searchQuery,
		filteredTools,
		recentTools,
		popularTools,
		getCategoryName,
		getCategoryIcon,
		openTool,
		closeTool,
	};
});
