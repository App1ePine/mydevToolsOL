<script setup>
	const currentYear = new Date().getFullYear();
</script>

<template>
	<footer class="footer">
		<div class="footer-content">
			<div>
				<p><i class="fas fa-code"></i> DevTools - 程序员必备在线工具集</p>
			</div>
			<div class="footer-links">
				<a href="https://github.com/App1ePine"><i class="fab fa-github"></i></a>
				<a href="#"><i class="fas fa-blog"></i></a>
				<a href="mailto:djl@applepine.cn"><i class="fas fa-envelope"></i></a>
			</div>
		</div>
		<div class="footer-content">
			<p>© {{ currentYear }} <a href="https://github.com/App1ePine" style="text-decoration: none;">App1ePine</a>.
				All rights reserved.</p>
		</div>
	</footer>
</template>

<style scoped>
	.footer {
		background-color: var(--footer-bg, #ffffff);
		border-top: 1px solid var(--border-color, #e4e7ed);
		padding: 15px 0;
		margin-top: auto;
	}

	.footer-content {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.footer-content p {
		margin: 0;
	}

	.footer-links {
		display: flex;
		gap: 20px;
	}

	.footer-links a {
		color: var(--info-color, #909399);
		font-size: 16px;
		text-decoration: none;
		transition: color 0.3s;
	}

	.footer-links a:hover {
		color: var(--primary-color, #409eff);
	}

	.footer-copyright {
		color: var(--text-color, #303133);
		font-size: 14px;
	}
</style>
