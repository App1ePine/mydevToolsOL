import Prism from 'prismjs';
import { nextTick } from 'vue';

import 'prismjs/themes/prism.css';

// 导入常用语言支持
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';

export default {
	install(app) {
		// 将Prism挂载到全局属性上，使所有组件都能访问
		app.config.globalProperties.$prism = Prism;

		// 通过provide/inject使用
		app.provide('prism', Prism);

		// 提供一个帮助方法用于代码高亮
		app.config.globalProperties.$highlightCode = () => {
			// 使用 nextTick 确保DOM已更新
			nextTick(() => {
				Prism.highlightAll();
			});
		};
		// 添加全局混入，在适当的生命周期自动调用高亮
		app.mixin({
			mounted() {
				Prism.highlightAll();
			},
			updated() {
				Prism.highlightAll();
			},
		});
	},
};
