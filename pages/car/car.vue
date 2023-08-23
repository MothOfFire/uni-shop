<template>
	<view class="car-container" v-if="car.length !== 0">
		<!-- 收货地址 -->
		<my-address></my-address>
		<!-- 购物车商品列表的标题区域 -->
		<view class="car-title">
			<!-- 左侧图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 描述文本 -->
			<text class="car-title-text">购物车</text>
		</view>
		<!-- 商品列表区域 -->
		<uni-swipe-action>
			<block v-for="(item, index) in car" :key="index">
				<uni-swipe-action-item :right-options="options" @click="swipeClickHandler(item)">
					<my-goods :goods="item" :show-radio="true" :show-number="true"
						@radio-change="radioChangeHandler" @number-change="numberChangeHandler"></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		<!-- 结算组件 -->
		<my-settle></my-settle>
	</view>
	<!-- 空白购物车区域 -->
	<view class="empty-car" v-else>
		<image src="/static/cart_empty@2x.png" class="empty-img"></image>
		<text class="empty-text">空空如也~~</text>
	</view>
</template>

<script>
	import badgeMixins from '@/mixins/tabbar-badge.js';
	import {mapState, mapMutations} from 'vuex'
	export default {
		computed: {
			...mapState('m_car', ['car']),
		},
		data() {
			return {
				options: [
					{
						text: '删除',
						style: {
							backgroundColor: '#c00000'
						}
					}
				]
			};
		},
		mixins: [badgeMixins],
		methods: {
			...mapMutations('m_car', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
			//商品的勾选状态发生变化
			radioChangeHandler(e) {
				// console.log(e);
				this.updateGoodsState(e);
			},
			numberChangeHandler(e) {
				// console.log(e);
				this.updateGoodsCount(e);
			},
			swipeClickHandler(goods) {
				// console.log(goods);
				this.removeGoodsById(goods.goods_id);
			}
		},
	}
</script>

<style lang="scss">
	.car-container {
		padding-bottom: 50px;
	}
	.car-title {
		height: 40px;
		display: flex;
		align-items: center;
		padding-left: 5px;
		border-bottom: 1px solid #efefef;
		
		.car-title-text {
			font-size: 14px;
			margin-left: 10px;
		}
	}
	.empty-car {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 150px;
		.empty-img {
			width: 90px;
			height: 90px;
		}
		.empty-text {
			font-size: 12px;
			color: gray;
			margin-top: 15px;
		}
	}
</style>
