<template>
	<view>
		<!-- 使用自定义的搜索组件 -->
		<my-search @myclick="gotoSearch"></my-search>
		
		<view class="scroll-view-container">
			<!-- 左侧滑块 -->
			<scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh + 'px'}">
				<block v-for="(item, key) in cateList" :key="key">
					<view :class="['left-scroll-view-item', key === active ? 'active' : '']" 
						@click="activeChange(key)">{{item.cat_name}}</view>
				</block>
			</scroll-view>
			<!-- 右侧滑块 -->
			<scroll-view scroll-y="true" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2, key2) in cateLevel2" :key="key2">
					<view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
					<!-- 动态渲染3级分类的列表 -->
					<view class="cate-lv3-list">
						<!-- 3级分类的item项 -->
						<view class="cate-lv3-item" v-for="(item3, key3) in item2.children" :key="key3" 
							@click="gotoGoodsList(item3)">
							<image :src="item3.cat_icon.replace('api-ugo-dev', 'api-hmugo-web')"></image>
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import badgeMixins from '@/mixins/tabbar-badge.js';
	export default {
		mixins: [badgeMixins],
		data() {
			return {
				//当前设备的可用高度
				wh: 0,
				cateList: [],
				active: 0,
				//2级分类的列表
				cateLevel2: [],
				scrollTop:0
			};
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync();
			this.wh = systemInfo.windowHeight - 50;
			this.getCateList();
		},
		methods: {
			//获取分类列表的数据
			async getCateList() {
				const {data: res} = await uni.$http.get('/api/public/v1/categories');
				if(res.meta.status !== 200) {
					return uni.$showMsg();
				}
				this.cateList = res.message;
				this.cateLevel2 = res.message[0].children;
			},
			activeChange(key) {
				this.active = key;
				//重新为2级分类赋值
				this.cateLevel2 = this.cateList[key].children;
				
				this.scrollTop = this.scrollTop === 0 ? 1 : 0;
			},
			gotoGoodsList(item3) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
				});
			},
			gotoSearch() {
				// console.log('ok');
				uni.navigateTo({
					url:'/subpkg/search/search'
				});
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;
		
		
		.left-scroll-view {
			width: 120px;
		}
		
		.left-scroll-view-item {
			background-color: #f7f7f7;
			line-height: 60px;
			text-align: center;
			font-size: 12px;
			
			&.active {
				background-color: #FFFFFF;
				position: relative;
				
				&::before {
					content: '';
					display: block;
					width: 3px;
					height: 30px;
					background-color: #F00000;
					position: absolute;
					top: 25%;
					left: 0;
				}
			}
		}
	}
	.cate-lv2-title {
		font-size: 12px;
		font-weight: bold;
		text-align: center;
		padding: 15px 0;
	}
	.cate-lv3-list {
		display: flex;
		flex-wrap: wrap;
		
		.cate-lv3-item {
			width: 33.33%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-bottom: 10px;
			
			image {
				width: 60px;
				height: 60px;
			}
			
			text {
				font-size: 12px;
			}
		}
	}
	
</style>
