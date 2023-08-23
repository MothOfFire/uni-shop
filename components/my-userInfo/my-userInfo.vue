<template>
	<view class="my-userinfo-container">
		<!-- 头像昵称区域 -->
		<view class="top-box">
			<image :src="userinfo.avatarUrl" class="avatar"></image>
			<view class="nickname">{{userinfo.nickName}}</view>
		</view>
		<!-- 面板区域 -->
		<view class="panel-list">
			<!-- 第一个面板 -->
			<view class="panel">
				<view class="panel-body">
					<!-- panel的item项 -->
					<view class="panel-item" v-for="(item, index) in panrlOneList" :key="index">
						<text>{{item.number}}</text>
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
			<!-- 第二个面板 -->
			<view class="panel">
				<view class="panel-title">
					我的订单
				</view>
				<view class="panel-body">
					<!-- panel的item项 -->
					<view class="panel-item" v-for="(item, index) in panrlTwoList" :key="index">
						<image :src="item.icon" class="icon"></image>
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
			<!-- 第三个面板 -->
			<view class="panel">
				<view class="panel-list-item">
					<text>{{panrlTextList[0]}}</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</view>
				<view class="panel-list-item">
					<text>{{panrlTextList[1]}}</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</view>
				<view class="panel-list-item" @click="ligonOut">
					<text>{{panrlTextList[2]}}</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import { mapState,mapMutations } from 'vuex';
	export default {
		name:"my-userInfo",
		computed: {
			...mapState('m_user', ['userinfo']),
		},
		data() {
			return {
				panrlOneList: [
					{
						number: 8,
						name: '收藏的店铺'
					},
					{
						number: 12,
						name: '收藏的商品'
					},
					{
						number: 18,
						name: '关注的商品'
					},
					{
						number: 84,
						name: '足迹'
					},
				],
				panrlTwoList: [
					{
						icon: '/static/my-icons/icon1.png',
						name: '待付款'
					},
					{
						icon: '/static/my-icons/icon2.png',
						name: '待收货'
					},
					{
						icon: '/static/my-icons/icon3.png',
						name: '退款/退货'
					},
					{
						icon: '/static/my-icons/icon4.png',
						name: '全部订单'
					},
				],
				panrlTextList: ['收货地址', '联系客服', '退出登入'],
			};
		},
		methods: {
			...mapMutations('m_user', ['updateAddress', 'updateUserInfo', 'updateToken']),
			async ligonOut() {
				//询问用户是否退出登入
				const [err, succ] = await uni.showModal({
					title: '提示',
					content: '确认退出吗？'
				}).catch(err => err);
				if(succ && succ.confirm) {
					this.updateAddress({});
					this.updateToken('');
					this.updateUserInfo({});
				}
			}
		},
	}
</script>

<style lang="scss">
	.my-userinfo-container {
		height: 100%;
		background-color: #F4F4F4;
		
		.top-box {
			height: 400rpx;
			background-color: #c00000;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			.avatar {
				width: 90px;
				height: 90px;
				border-radius: 45px;
				border: 2px solid #FFF;
				box-shadow: 0 1px 5px black;
			}
			.nickname {
				font-size: 16px;
				color: white;
				font-weight: bold;
				margin-top: 10px;
			}
		}
	}
	.panel-list {
		padding: 0 10px;
		position: relative;
		top: -10px;
		.panel {
			background-color: white;
			border-radius: 3px;
			margin-bottom: 8px;
			.panel-title {
				line-height: 45px;
				padding-left: 10px;
				font-size: 15px;
				border-bottom: 1px solid #F4F4F4;
			}
			.panel-body {
				display: flex;
				justify-content: space-around;
				.panel-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-around;
					padding: 10px 0;
					font-size: 13px;
					.icon {
						width: 35px;
						height: 35px;
					}
				}
			}
			.panel-list-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 15px;
				padding: 0 10px;
				line-height: 45px;
				border-bottom: 1px solid #F4F4F4;
			}
		}
	}
</style>