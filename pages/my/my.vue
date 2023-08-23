<template>
	<view class="my-container">
		<!-- 用户未登入时，显示登入组件 -->
		<my-login v-if="!token"></my-login>
		<!-- 用户登入时显示用户信息组件 -->
		<my-userInfo v-else></my-userInfo>
	</view>
</template>

<script>
	import badgeMixins from '@/mixins/tabbar-badge.js';
	import { mapState } from 'vuex';
	export default {
		mixins: [badgeMixins],
		computed: {
			...mapState('m_user', ['token']),
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	page, .my-container {
		height: 100%;
	}
</style>
