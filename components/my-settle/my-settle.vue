<template>
	<view class="my-settle-container">
		<!-- 全选 -->
		<label class="radio" @click="changeAllState">
			<radio color="#c00000" :checked="isFullCheck"/><text>全选</text>
		</label>
		<!-- 合计 -->
		<view class="amount-box">
			合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>
		<!-- 结算按钮 -->
		<view class="btn-settle" @click="settlement">
			结算({{checkedCount}})
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapMutations, mapState } from 'vuex';
	export default {
		name:"my-settle",
		computed: {
			...mapGetters('m_car', ['checkedCount', 'total', 'checkedGoodsAmount']),
			...mapGetters('m_user', ['addressStr']),
			...mapState('m_user', ['token']),
			...mapState('m_car', ['car']),
			isFullCheck() {
				return this.total === this.checkedCount;
			}
		},
		data() {
			return {
				//倒计时秒数
				secound: 3,
				timer: null
			};
		},
		methods: {
			...mapMutations('m_car', ['updateAllGoodsState']),
			...mapMutations('m_user', ['updateRedirectInfo']),
			changeAllState() {
				this.updateAllGoodsState(!this.isFullCheck);
			},
			settlement() {
				// 判断是否勾选了要结算的商品
				if(!this.checkedCount) {
					return uni.$showMsg('请选择要结算的商品');
				}
				// 判断用户是否选择了收货地址
				if(!this.addressStr) {
					return uni.$showMsg('请选择收货地址');
				}
				//判断用户是否登入
				if(!this.token) {
					return this.delayNavigate();
				}
				//实现微信支付
				this.payOrder();
			},
			showTips(n) {
				uni.showToast({
					icon: 'none',
					title: '请登入后再结算！' + n + '秒后自动跳转到登入页',
					//为页面添加透明遮罩，防止点击穿透
					mask: true,
					//1.5秒后消失
					duration: 1500
				});
			},
			//延迟导航到my页面
			delayNavigate() {
				this.secound = 3;
				this.timer = null;
				this.showTips(this.secound);
				//创建定时器
				this.timer = setInterval(() => {
					this.secound--;
					if(this.secound <= 0) {
						//情况定时器
						clearInterval(this.timer);
						//跳转到my页面
						uni.switchTab({
							url: '/pages/my/my',
							success: () => {
								this.updateRedirectInfo({
									//跳转方式
									openType: 'switchTab',
									//从哪个页面跳转过去
									from: '/pages/car/car'
								});
							}
						});
						//终止代码
						return;
					}
					this.showTips(this.secound);
				}, 1000);
			},
			async payOrder() {
				//创建订单
				const orderInfo = {
					//order_price: this.checkedGoodsAmount
					//测试时写死为1分
					order_price: 0.01,
					consignee_addr: this.addressStr,
					goods: this.car.filter(x => x.goods_state).map(x => ({
						goods_id: x.goods_id,
						goods_number: x.goods_count,
						goods_price: x.goods_price,
					}))
				}
				//发起创建订单请求
				const { data: res } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo);
				if(res.meta.status !== 200) {
					return uni.$showMsg('订单创建失败');
				}
				const orderNumber = res.message.order_number;
				console.log(orderNumber);
				//订单预支付
				//发起请求获得订单信息
				const {data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {order_number: orderNumber});
				if(res2.meta.status !== 200) {
					return uni.$showMsg('预付订单生产失败');
				}
				const payInfo = res2.message.pay;
				console.log(payInfo);
				//调用uni.requestPayment发起微信支付
				const [err, succ] = await uni.requestPayment(payInfo);
				if(err) {
					return uni.$showMsg('订单未支付');
				}
				const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder',{order_number: orderNumber});
				if(res3.meta.status !== 200) {
					return uni.$showMsg('订单未支付');
				}
				uni.showToast({
					title: '订单支付完成',
					icon: 'success'
				});
			},
		}
	}
</script>

<style lang="scss">
	.my-settle-container {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		z-index: 999;
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
		padding-left: 5px;
		.radio {
			display: flex;
			align-items: center;
		}
		.amount-box {
			.amount {
				color: #c00000;
				font-weight: bold;
			}
		}
		.btn-settle {
			background-color: #c00000;
			height: 50px;
			color: #fff;
			line-height: 50px;
			padding: 0 10px;
			min-width: 100px;
			text-align: center;
		}
	}
</style>