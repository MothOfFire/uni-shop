<template>
	<view class="my-search-container" :style="{'background-color' : bgcolor}"
		@click="searchBoxHandler">
		<!-- 使用view组件模拟input输入框样式 -->
			<view class="my-search-box" :style="{'border-radius' : radius + 'px'}">
				<!-- 使用uni-ui提供的图标组件 -->
			<uni-icons type="search" size="17"></uni-icons>
			<text class="placeholder">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-search",
		props: {
			//背景颜色
			bgcolor: {
				type: String,
				default: '#c00000'
			},
			//圆角尺寸
			radius: {
				type: Number,
				default: 18 //px
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			searchBoxHandler() {
				//通过$emit将子组件的回调函数传递过来
				this.$emit('myclick');
			}
		}
	}
</script>

<style lang="scss">
	.my-search-container {
		// background-color: #c00000;
		height: 50px;
		padding: 0 10px;
		display: flex;
		align-items: center;
	}
	
	.my-search-box {
		height: 36px;
		background-color: #FFFFFF;
		// border-radius: 15px;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		
		.placeholder {
			font-size: 15px;
			margin-left: 5px;
		}
	}
</style>