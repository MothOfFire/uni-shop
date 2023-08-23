import {mapGetters} from 'vuex';

export default {
	computed: {
		...mapGetters('m_car', ['total']),
	},
	//页面显示的时候被调用
	onShow() {
		//在页面刚展示的时候，设置数字徽标
		this.setBadge();
	},
	methods: {
		setBadge() {
			//调用uni.setTabBarBadge方法，为购物车添加徽标
			uni.setTabBarBadge({
				index: 2,
				//text的值必须是字符串
				text: this.total + ''
			});
		},
	},
	watch: {
		//监听total的变化
		total() {
			this.setBadge()
		},
	},
}