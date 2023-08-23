<template>
	<view class="login-container">
		<!-- 提示登入的图标 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登入按钮 -->
		<button type="primary" class="btn-login" @click="getUserProfile">一键登入</button>
		<!-- 登入提示 -->
		<view class="tips-text">登入后尽享更多权益</view>
	</view>
</template>

<script>
	import { mapMutations,mapState } from 'vuex';
	export default {
		name:"my-login",
		computed: {
			...mapState('m_user', ['redirectInfo']),
		},
		data() {
			return {
				
			};
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			//获取用户的基本信息
			async getUserProfile() {
				const res = await uni.getUserProfile({
					desc: '你的授权信息',
					success: (res) => {
						// 将信息存到 vuex 中
						console.log(res);
						this.updateUserInfo(res.userInfo);
						this.getToken(res);
					 },
					fail: (res) => {
					    return uni.$showMsg('您取消了登录授权');
					}
				});
			},
			async getToken(info) {
				const fadeToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo';
				const [err, res] = await uni.login().catch(err => err);
				console.log(res)
				if(err || res.errMsg !== 'login:ok') {
					return uni.$showMsg('登入失败!');
				}
				const query = {
					code: res.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					eawData: info.rawData,
					signature: info.signature
				}
				//换取token
				const {data: loginResult} = await uni.$http.post('/api/public/v1/users/wxlogin', query);
				this.updateToken(fadeToken);	//在判断登录之前设置假token
				// console.log(loginResult);
				// if(loginResult.meta.status !== 200) {
				// 	return uni.$showMsg('登入失败');
				// }
				uni.$showMsg('登入成功');
				this.navigateBack();
			},
			navigateBack() {
				if(this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
					uni.switchTab({
						url: this.redirectInfo.from,
						complete: () => {
							this.updateRedirectInfo(null);
						}
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.login-container {
		height: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: white;
		position: relative;
		overflow: hidden;
		
		&::after {
			content: ' ';
			display: block;
			width: 100%;
			height: 40px;
			background-color: #F8F8F8;
			position: absolute;
			bottom: 0;
			left: 0;
			border-radius: 100%;
			transform: translateY(50%);
		}
		
		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 10px 0;
			background-color: #c00000;
			color: white;
		}
		.tips-text {
			font-size: 12px;
			color: gray;	
		}
	}
</style>