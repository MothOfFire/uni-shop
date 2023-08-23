export default {
	namespaced: true,
	state: () => ({
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		//登入后的token字符串
		token: uni.getStorageSync('token') || '',
		//用户的基本信息
		userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
		//重定向的object对象
		redirectInfo: null
	}),
	mutations: {
		updateAddress(state, address) {
			state.address = address;
			this.commit('m_user/saveAddressToStorage');
		},
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address));
		},
		//更新用户信息的方法
		updateUserInfo(state, userinfo) {
			state.userinfo = userinfo;
			this.commit('m_user/saveUserInfoToStorage');
		},
		saveUserInfoToStorage(state) {
			uni.setStorageSync('userinfo', JSON.stringify(state.userinfo));
		},
		updateToken(state, token) {
			state.token = token;
			this.commit('m_user/saveTokeToStorage');
		},
		saveTokeToStorage(state) {
			uni.setStorageSync('token', state.token);
		},
		updateRedirectInfo(state, info) {
			state.redirectInfo = info;
		}
	},
	getters: {
		addressStr(state) {
			if(!state.address.provinceName) {
				return '';
			}
			return state.address.provinceName + state.address.cityName + state.address.countyName +state.address.detailInfo;
		}
	},
}