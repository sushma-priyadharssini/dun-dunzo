import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import GroceryList from './views/GroceryList.vue'
import ProductList from './views/ProductList.vue'
import QuickBuy from './views/QuickBuy.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/groceries',
      name: 'groceryList',
      component: GroceryList
    },
    {
      path: '/groceries/products/:id',
      name: 'productList',
      component: ProductList
    },
    {
      path: '/quickBuy',
      name: 'quickBuy',
      component: QuickBuy
    },
  ]
})
