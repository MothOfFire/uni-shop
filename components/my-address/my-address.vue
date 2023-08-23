<template>
	<view>
		<!-- 选择收货地址的盒子 -->
		<view class="address-choose-box" v-if="JSON.stringify(address) ==='{}'">
			<button type="primary" size="mini" class="btnChooseAddress" 
				@click="chooseAddress">请选择收货地址+</button>
		</view>
		<!-- 渲染收货信息的盒子 -->
		<view class="address-info-box" v-else @click="chooseAddress">
			<view class="row1">
				<view class="row1-left">
					<view class="username">收货人:{{address.userName}}</view>
				</view>
				<view class="row1-right">
					<view class="phone">电话:{{address.telNumber}}</view>
					<uni-icons type="arrowright" size="16"></uni-icons>
				</view>
			</view>
			<view class="row2">
				<view class="row2-left">收货地址:</view>
				<view class="row2-right">{{addressStr}}</view>
			</view>
		</view>
		<!-- 底部的边框线 -->
		<image src="/static/cart_border@2x.png" class="address-border"></image>
	</view>
</template>

<script>
	import { mapMutations, mapState, mapGetters} from 'vuex';
	export default {
		name:"my-address",
		data() {
			return {
				// address: {}
			};
		},
		methods: {
			...mapMutations('m_user', ['updateAddress']),
			async chooseAddress() {
				const [err, succ] = await uni.chooseAddress().catch(err => err);
				console.log(succ);
				if(err === null && succ.errMsg === 'chooseAddress:ok') {
					// console.log(succ);
					// this.address = succ;
					this.updateAddress(succ);
				}
				//用户没有授权
				if(err && (err.errMsg === 'chooseAddress:fail auth deny' || 
					err.errMsg === 'chooseAddress:fail authorize no response') ) {
					//重新向用户发起授权申请
					this.reAuth();
				}
			},
			async reAuth() {
				const [err2, confirmResult] = await uni.showModal({
					content: '检测到您没有打开地址权限，是否区设置打开?',
					confirmText: "确认",
					cancelText: "取消",
				});
				//如果弹窗异常则直接退出
				if(err2) {
					return;
				}
				//点击取消，提示用户"您取消了地址授权"
				if(confirmResult.cancel) {
					return uni.$showMsg('您取消了地址授权');
				}
				//点击确认，调用uni.openSetting()方法进入授权页面
				if(confirmResult.confirm) {
					return uni.openSetting({
						//授权结束，对授权结构进行进一步的判断
						success: (settingResult) => {
							if(settingResult.authSetting['scope.address']) {
								return uni.$showMsg('授权成功，请选择地址');
							}
							if(!settingResult.authSetting['scope.address']) {
								return uni.$showMsg('您取消了地址授权');
							}
						}
					});
				}
			}
		},
		computed: {
			...mapState('m_user', ['address']),
			...mapGetters('m_user',['addressStr']),
		}
	}
</script>

<style lang="scss">
	.address-choose-box {
		height: 90px;
		display: flex;
		justify-content: center;
		align-items: center;
		.btnChooseAddress {
			
		}
	}
	.address-info-box {
		font-size: 12px;
		height: 90px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 5px;
		.row1 {
			display: flex;
			justify-content: space-between;
			.row1-right {
				display: flex;
				justify-content: space-between;
			}
		}
		.row2 {
			display: flex;
			align-items: center;
			margin-top: 10px;
			.row2-left {
				white-space: nowrap;
			}
			.row2-right {
				
			}
		}
	}
	.address-border {
		display: block;
		width: 100%;
		height: 5px;
	}
</style>