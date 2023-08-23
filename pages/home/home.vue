<template>
	<view>
		<!-- 使用自定义搜索组件 -->
		<view class="search-box">
			<my-search @myclick="gotoSearch"></my-search>
		</view>
		
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item, key) in swiperList" :key="key">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		
		<!-- 分类导航栏 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item, key) in navList" :key="key" @click="navClickHandler(item)">
				<image :src="item.image_src" class="nav-img"></image>
			</view>
		</view>
		
		<!-- 楼层 -->
		<view class="floor-list">
			<!-- 楼层item项 -->
			<view class="floor-item" v-for="(item, key) in floorList" :key="key">
				<!-- 楼层标题 -->
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层图片 -->
				<view class="floor-img-box">
					<!-- 左侧大图片的盒子 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<!-- 高度要自适应可以添加属性mode="widthFix" -->
						<image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
					</navigator>
					<!-- 右侧4个小图片的盒子 -->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(item2, key2) in item.product_list" :key="key2" v-if="key2 !== 0" :url="item2.url">
							<image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import badgeMixins from '@/mixins/tabbar-badge.js';
	export default {
		mixins: [badgeMixins],
		data() {
			return {
				//轮播图的数据列表
				swiperList: [],
				//分类导航的数据列表
				navList: [],
				//楼层数据列表
				floorList: []
			};
		},
		onLoad() {
			//调用方法获取轮播图的数据
			this.getSwiperList();
			//调用分类导航的数据
			this.getNavList();
			this.getFloorList();
			
		},
		methods: {
			async getSwiperList() {
				const {data : res} = await uni.$http.get('/api/public/v1/home/swiperdata');
			
				//请求失败
				if(res.meta.status !== 200) {
					return uni.$showMsg();
				}
				this.swiperList = res.message;
			},
			async getNavList() {
				const {data: res} = await uni.$http.get('/api/public/v1/home/catitems');
				if(res.meta.status !== 200) {
					return uni.$showMsg();
				}
				this.navList = res.message;
			},
			navClickHandler(item) {
				if(item.name === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					});
				}
			},
			async getFloorList() {
				const {data: res} = await uni.$http.get('/api/public/v1/home/floordata');
				if(res.meta.status !== 200) {
					return uni.$showMsg();
				}
				//对数据进行处理
				res.message.forEach(floor => {
					floor.product_list.forEach(prod => {
						prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1];
					});
				});
				this.floorList = res.message;
			},
			gotoSearch() {
				uni.navigateTo({
					url:'/subpkg/search/search'
				});
			}
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 330rpx;
		.swiper-item,
		image {
			height: 100%;
			width: 100%;
		}
	}
	
	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;
		
		.nav-img {
			width: 128rpx;
			height: 140rpx;
		}
	}
	
	.floor-title {
		height: 60rpx;
		width: 100%;
		display: flex;
	}
	
	.right-img-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
	
	.floor-img-box {
		display: flex;
		padding-left: 10rpx;
		
	}
	
	.search-box {
		// 设置吸顶效果
		position: sticky;
		//吸顶位置
		top: 0;
		// 提高层级，防止轮播图覆盖
		z-index: 999;
	}
	
</style>
