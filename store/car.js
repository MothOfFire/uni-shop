export default {
	//为当前模块开启命名空间
	namespaced: true,
	//模块的state数据
	state: () => ({
		//购物车的数组，用于存放购物车中的每个商品的信息对象
		//商品信息对象的属性:
		//{goods_id,goods_name,goods_price,goods_count,goods_small_logo,goods_state}
		car: JSON.parse(uni.getStorageSync('car') || '[]')
	}),
	
	//模块的mutations方法
	mutations: {
		//加入购物车方法
		addToCar(state, goods) {
			const findResult = state.car.find((x) => x.goods_id === goods.goods_id);
			// console.log(findResult);		
			if(!findResult) {
				//购物车中没有这件商品，直接push
				state.car.push(goods);
			} else {
				//购物车有这件商品，更新数量
				findResult.goods_count ++;
			}
			// console.log(state.car);
			//通过commit方法调用m_car命名空间下的saveToStorage方法
			this.commit('m_car/saveToStorage');
		},
		//将购物车的数据持久化存储到本地中
		saveToStorage(state) {
			uni.setStorageSync('car', JSON.stringify(state.car));
		},
		//更新购物车勾选状态的方法
		updateGoodsState(state, goods) {
			// 根据id查询对应商品的信息对象
			const findResult = state.car.find((x) => x.goods_id === goods.goods_id);
			if(findResult) {
				findResult.goods_state = goods.goods_state;
				this.commit('m_car/saveToStorage');
			}
		},
		//修改购物车中商品的数量的方法
		updateGoodsCount(state, goods) {
			const findResult = state.car.find((x) => x.goods_id === goods.goods_id);
			if(findResult) {
				findResult.goods_count = goods.goods_count;
				this.commit('m_car/saveToStorage');
			}
		},
		//根据id删除对应商品信息
		removeGoodsById(state, goods_id) {
			//调用filter进行过滤
			state.car = state.car.filter(x => x.goods_id !== goods_id);
			this.commit('m_car/saveToStorage');
		},
		//更新所有商品的勾选状态
		updateAllGoodsState(state, newState) {
			//循环更新购物车中的每件商品的勾选状态
			state.car.forEach(x => x.goods_state = newState);
			this.commit('m_car/saveToStorage');
		}
	},
	
	//模块的getters方法
	getters: {
		//统计购物车中商品的总数量
		total(state) {
			// let count = 0;
			// //循环统计商品的数量，累加到count中
			// state.car.forEach(goods => count += goods.goods_count);
			// return count;
			
			return state.car.reduce((total, item) => total += item.goods_count, 0);
			
		},
		//勾选商品的总数量
		checkedCount(state) {
			return state.car.filter(x => x.goods_state)
							.reduce((total, item) => total += item.goods_count, 0);
		},
		//勾选商品的总价格
		checkedGoodsAmount(state) {
			return state.car.filter(x => x.goods_state)
							.reduce((total, item) => total += (item.goods_price * item.goods_count), 0)
							.toFixed(2);
		}
	},
	
}