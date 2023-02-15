import vue from '@vitejs/plugin-vue'
const path = require('path');

export default {
	base: './',
	plugins: [vue()],
	optimizeDeps: {
		include: ['schart.js']
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		}
	},
	server: {
		proxy: {
			// 使用 proxy 实例
			'^/api': {
				target: 'http://localhost:80/',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '/')
			}
		}
	}
}