//导入Vue和Vuex
import Vue from 'vue';
import Vuex from 'vuex';
//导入购物车的Vuex模块
import moduleCar from './car.js';
import moduleUser from './user.js';

//将vuex安装为vue的插件
Vue.use(Vuex);

//创建Store的实例对象
const store = new Vuex.Store({
	//挂载store模块
	modules: {
		//挂载购物车的vuex模块，访问路径修改为m_car
		//购物车模块中的car数组的访问路径是m_car/car
		'm_car': moduleCar,
		'm_user': moduleUser,
	},
});

//向外暴露Store的实例对象
export default store;