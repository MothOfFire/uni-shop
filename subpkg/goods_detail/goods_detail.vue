<template>
	<view v-if="goods_info.goods_name" class="goods-detail-container">
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item, index) in goods_info.pics" :key="index">
				<image :src="item.pics_big" @click="preview(index)"></image>
			</swiper-item>
		</swiper>
		<!-- 商品信息区域 -->
		<view class="goods-info-box">
			<!-- 商品价格 -->
			<view class="price">￥{{goods_info.goods_price}}</view>
			<!-- 信息主体区域 -->
			<view class="goods-info-body">
				<!-- 商品名称 -->
				<view class="goods-info-name">{{goods_info.goods_name}}</view>
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费 -->
			<view class="yf">快递:免运费</view>
		</view>
		<!-- 商品详情信息 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		<!-- 商品导航组件 -->
		<view class="goods-nav">
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup"
				@click="onClick" @buttonClick="buttonClick"></uni-goods-nav>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations, mapGetters} from 'vuex'
	export default {
		computed: {
			...mapState('m_car', []),
			//映射到当前页面
			...mapGetters('m_car', ['total']),
		},
		//监听器
		watch: {
			total: {
				//使用handler属性来定义监听器的function处理函数
				handler(newValue) {
					const findResult = this.options.find(x => x.text === '购物车');
					if(findResult) {
						findResult.info = newValue;
					}
				},
				//immediate属性用来声明此监听器，是否在页面初次加载完毕后立即调用
				immediate: true
			}
		},
		data() {
			return {
				goods_info:{},
				// 左侧按钮组的配置对象
				options: [
					{
						icon: 'shop',
						text: '店铺'
					},
					{
						icon: 'cart',
						text: '购物车',
						info: 0
					}
				],
				//右侧按钮组的配置对象
				buttonGroup: [
					{
						text: '加入购物车',
						backgroundColor: "#FF0000",
						color: "#FFF"
					},
					{
						text: '立即购买',
						backgroundColor: "#FFA200",
						color: "#FFF"
					}
				]
			};
		},
		onLoad(options) {
			// 获取商品id
			const goods_id = options.goods_id;
			//调用请求商品详情数据的方法
			this.getGoodsDetail(goods_id);
		},
		methods: {
			...mapMutations('m_car', ['addToCar']),
			async getGoodsDetail(goods_id) {
				const {data: res} = await uni.$http.get('/api/public/v1/goods/detail',{goods_id});
				if(res.meta.status !== 200) {
					return uni.$showMsg();
				}
				
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display: block;" ')
															.replace(/webp /g, 'jpg');
				
				this.goods_info = res.message;
			},
			preview(index) {
				//预览图片方法
				uni.previewImage({
					//预览时默认显示的索引
					current: index,
					//所有图片的url地址的数组
					urls: this.goods_info.pics.map(x => x.pics_big)
				});	
			},
			//左侧按钮的点击事件
			onClick(e) {
				// console.log(e);
				if(e.content.text === '购物车') {
					uni.switchTab({
						url: '/pages/car/car'
					});
				}
			},
			buttonClick(e) {
				if(e.content.text === '加入购物车') {
					const goods = {
						//商品id
						goods_id: this.goods_info.goods_id,
						//商品名称
						goods_name: this.goods_info.goods_name,
						//商品价格
						goods_price: this.goods_info.goods_price,
						//商品数量
						goods_count: 1,
						//商品图片
						goods_small_logo: this.goods_info.goods_small_logo,
						//商品勾选状态
						goods_state: true
					};
					//通过this调用映射过来的addToCar方法
					this.addToCar(goods);
				}
			}
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 750rpx;
		
		image {
			width: 100%;
			height: 100%;
		}
	}
	.goods-info-box {
		padding: 10px;
		padding-right: 0;
		
		.price {
			color: #c00000;
			font-size: 18px;
			margin: 10px 0;
		}
		
		.goods-info-body {
			display: flex;
			justify-content: space-between;
			
			.goods-info-name {
				font-size: 13px;
				margin-right: 10px;
			}
			
			.favi {
				width: 120px;
				font-size: 12px;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				border-left: 1px solid #efefef;
				color: gray;	
			}
		}
		
		.yf {
			font-size: 12px;
			color: gray;
			margin: 10px 0;
		}
	}
	.goods-detail-container {
		padding-bottom: 50px;
	}
	.goods-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		
	}
</style>
