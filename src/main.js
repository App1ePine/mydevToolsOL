import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 导入 Font Awesome 图标库
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App.vue';
import prismPlugin from './plugins/prism';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(ElementPlus);
app.use(prismPlugin);
app.mount('#app');
