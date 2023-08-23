<template>
		<view class="goods-item">
			<!-- 商品左侧图片区域 -->
			<view class="goods-item-left">
				<radio :checked="goods.goods_state" color="#c00000" v-if="showRadio" 
					@click="radioChangeHandler"></radio>
				<image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
			</view>
			<!-- 商品右侧信息区域 -->
			<view class="goods-item-right">
				<!-- 商品标题 -->
				<view class="goods-name">{{goods.goods_name}}</view>
				<view class="goods-info-box">
					<!-- 商品价格 -->
					<view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
					<!-- 商品数量 -->
					<uni-number-box :min="1" :value="goods.goods_count" v-if="showNumber" 
						@change="numChangeHandler"></uni-number-box>
				</view>
			</view>
		</view>
</template>

<script>
	export default {
		name:"my-goods",
		props: {
			goods: {
				type: Object,
				default: {}
			},
			//是否显示图片左侧的radio
			showRadio: {
				type: Boolean,
				default: false
			},
			showNumber: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				//默认图片
				defaultPic: 'https://gitee.com/snow_Sharon/tuchuang/raw/master/imgs/-54411d03f2aaff01.jpg'
			};
		},
		filters: {
			// 把数字处理为小数点后两位的数字
			tofixed(num) {
				return Number(num).toFixed(2);
			}
		},
		methods: {
			radioChangeHandler() {
				this.$emit('radio-change', {
					//商品id
					goods_id: this.goods.goods_id,
					//商品的勾选状态
					goods_state: !this.goods.goods_state
				});
			},
			numChangeHandler(value) {
				console.log(value);
				this.$emit('number-change', {
					goods_id: this.goods.goods_id,
					goods_count: +value
				});
			}
		}
	}
</script>

<style lang="scss">
	.goods-item {
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #efefef;
		
		.goods-item-left {
			margin-right: 5px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}
		
		.goods-item-right {
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: space-between;
			
			.goods-name {
				font-size: 13px;
			}
			
			.goods-info-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				.goods-price {
					color: #c00000;
					font-size: 16px;
				}
			}
		}
	}
</style>