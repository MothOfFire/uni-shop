<template>
	<view>
		<view class="search-box">
			<!-- 使用uni-ui提供的搜索组件 -->
			<uni-search-bar @input="input" :radius="100" :focus="true" 
				cancelButton="none"></uni-search-bar>
		</view>
		
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchList.length !== 0">
			<view class="sugg-item" v-for="(item, index) in searchList" :key="index" 
				@click="gotoDetail(item)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item, index) in histories" :key="index"
					@click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//延迟器的timerID
				timer: null,
				//搜索关键词
				kw:'',
				//搜索建议列表
				searchList: [],
				//搜索历史列表
				historyList: []
			};
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]');
		},
		methods: {
			input(e) {
				//使用防抖函数
				//清除timer对应延时器
				clearTimeout(this.timer);
				//重新启动一个延时器，并把timerId赋值给this.timer
				this.timer = setTimeout(() => {
					this.kw = e;
					this.getSearchList();
					console.log(this.kw);
				}, 500);
			},
			async getSearchList() {
				if(this.kw.trim() === '') {
					this.searchList = [];
					return;
				}
				//发起请求
				const {data: res} = await uni.$http.get('/api/public/v1/goods/qsearch',{query: this.kw});
				if(res.meta.status !== 200) {
					return uni.$showMsg();
				}
				this.searchList = res.message;
				this.saveSearchHistory();
			},
			gotoDetail(item) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				});
			},
			saveSearchHistory() {
				// this.historyList.push(this.kw);
				const set = new Set(this.historyList);
				//删除set中与kw相同的元素，目的是删除后添加可以让kw的存放位置换到末尾
				set.delete(this.kw);
				//向set中添加元素
				set.add(this.kw);
				//将set元素转化为数组
				this.historyList = Array.from(set);
				//调用uni.setStorageSync(key,value)将搜索历史记录持久化存储到本地
				uni.setStorageSync('kw',JSON.stringify(this.historyList));
			},
			cleanHistory() {
				this.historyList = [];
				uni.removeStorageSync('kw');
			},
			gotoGoodsList(kw) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + kw
				});
			}
		},
		computed: {
			histories() {
				return [...this.historyList].reverse();
			}
		}
	}
</script>

<style lang="scss">
	.search-box {
		// 设置吸顶效果
		position: sticky;
		//吸顶位置
		top: 0;
		// 提高层级，防止轮播图覆盖
		z-index: 999;
		background-color: #c00000;
	}
	
	.sugg-list {
		padding: 0 5px;
		
		.sugg-item {
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.goods-name {
				//文字不允许换行
				white-space: nowrap;
				//溢出部分隐藏
				overflow: hidden;
				//文本溢出后，使用...代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}
	
	.history-box {
		padding: 0 5px;
		
		.history-title {
			display: flex;
			justify-content: space-between;
			height: 40px;
			align-items: center;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}
		
		.history-list {
			display: flex;
			flex-wrap: wrap;
			
			.uni-tag {
				margin-top: 5px;
				margin-right: 5px;
			}
		}
	}
	
</style>
