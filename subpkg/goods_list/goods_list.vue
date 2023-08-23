<template>
	<view>
		<view class="goods-list">
			<view v-for="(item, index) in goodsList" :key="index" @click="gotoDetail(item)">
				<!-- 为my-goods动态绑定goods属性值 -->
				<my-goods :goods="item"></my-goods>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//请求参数对象
				queryObj: {
					//查询关键词
					query: '',
					//商品分类id
					cid: '',
					//页码
					pagenum: 1,
					//每条显示多少数据
					pagesize: 10
				},
				//商品列表数据
				goodsList: [],
				//总数量，用来实现分页
				total: 0,
				//是否在请求数据
				isloading: false
			};
		},
		onLoad(options) {
			//将页面参数转存到this.queryObj对象中
			this.queryObj.query = options.query || '';
			this.queryObj.cid = options.cid || '';
			this.getGoodsList();
		},
		methods: {
			//获取商品列表数据
			async getGoodsList(cb) {
				// 打开节流阀
				this.isloading = true;
				
				const {data: res} = await uni.$http.get('/api/public/v1/goods/search',this.queryObj);
				//关闭节流阀
				this.isloading = false;
				
				//数据请求完毕，立即按需调用cb回调函数
				cb && cb();
				if(res.meta.status !== 200) {
					return uni.$showMsg();
				}
				this.goodsList = [...this.goodsList, ...res.message.goods];
				this.total = res.message.total;
			},
			gotoDetail(item) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				});
			}
		},
		//触底事件
		onReachBottom() {
			// 判断是否还有下一页数据
			if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) {
				return uni.$showMsg('数据加载完毕！！！');
			}
			
			if(this.isloading) {
				return;
			}
			
			// 让页码自增+1
			this.queryObj.pagenum += 1;
			// 重新获取列表数据
			this.getGoodsList();
		},
		//下拉刷新事件
		onPullDownRefresh() {
			// 重置关键数据
			this.queryObj.pagenum = 1;
			this.total = 0;
			this.isloading = false;
			this.goodsList = [];
			
			//重新发起请求
			this.getGoodsList(() => uni.stopPullDownRefresh());
		}
	}
</script>

<style lang="scss">
	
</style>
