// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import VueCookie from 'vue-cookie'
import Vue2Filters from 'vue2-filters'
import App from './App'
import Home from './page/Main'
import { AjaxPlugin, ToastPlugin, LoadingPlugin } from 'vux'
require('es6-promise').polyfill()

Vue.use(VueRouter)
Vue.use(AjaxPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(VueCookie)
Vue.use(Vue2Filters)
Vue.http.defaults.baseURL = '/higo/open/api'

const routes = [{
  path: '/',
  component: Home,
  children: [
    {
      path: '',
      component: function (resolve) {
        require(['./page/Index.vue'], resolve)
      },
      meta: {
        title: '首页'
      }
    }, {
      path: 'user/center',
      component: function (resolve) {
        require(['./page/UserCenter.vue'], resolve)
      },
      meta: {
        title: '用户中心'
      }
    }, {
      path: 'commodity/search',
      component: function (resolve) {
        require(['./page/CommoditySearch.vue'], resolve)
      },
      meta: {
        title: '商品搜索'
      }
    }, {
      path: 'user/deliveryaddress',
      component: function (resolve) {
        require(['./page/DeliveryAddress.vue'], resolve)
      },
      meta: {
        title: '收货地址'
      }
    }, {
      path: 'user/paypublish',
      component: function (resolve) {
        require(['./page/PayPublish.vue'], resolve)
      },
      meta: {
        title: '支付发布费'
      }
    }, {
      path: 'user/myid',
      component: function (resolve) {
        require(['./page/MyID.vue'], resolve)
      },
      meta: {
        title: '我的ID'
      }
    }, {
      path: 'commodity/detail',
      component: function (resolve) {
        require(['./page/CommodityDetail.vue'], resolve)
      },
      meta: {
        title: '商品详情'
      }
    }, {
      path: 'user/mypublishid',
      component: function (resolve) {
        require(['./page/MyPublishID.vue'], resolve)
      },
      meta: {
        title: '我发布的ID'
      }
    }, {
      path: 'user/address/change/:id',
      name: 'ChangeDeliveryAddress',
      component: function (resolve) {
        require(['./page/ChangeDeliveryAddress.vue'], resolve)
      },
      meta: {
        title: '修改收货地址'
      }
    }, {
      path: 'user/address/add',
      component: function (resolve) {
        require(['./page/AddDeliveryAddress.vue'], resolve)
      },
      meta: {
        title: '增加收货地址'
      }
    }, {
      path: 'user/withdrawcashlist',
      component: function (resolve) {
        require(['./page/WithdrawCashList.vue'], resolve)
      },
      meta: {
        title: '提现历史'
      }
    }, {
      path: 'user/payinfo',
      component: function (resolve) {
        require(['./page/ChangeUserPayInfo.vue'], resolve)
      },
      meta: {
        title: '完善资料'
      }
    }, {
      path: 'user/info',
      component: function (resolve) {
        require(['./page/ChangeUserInfo.vue'], resolve)
      },
      meta: {
        title: '完善资料'
      }
    }, {
      path: 'user/orderlist',
      component: function (resolve) {
        require(['./page/OrderList.vue'], resolve)
      }
    }, {
      path: 'user/cashierdesk/',
      component: function (resolve) {
        require(['./page/CashierDesk.vue'], resolve)
      },
      meta: {
        title: '收银台'
      }
    }, {
      path: 'user/withdrawcash',
      component: function (resolve) {
        require(['./page/WithdrawCash.vue'], resolve)
      },
      meta: {
        title: '收益提现'
      }
    }, {
      path: 'user/upgradecondition',
      component: function (resolve) {
        require(['./page/UpgradeCondition.vue'], resolve)
      },
      meta: {
        title: '升级条件'
      }
    }, {
      path: 'user/storedata',
      component: function (resolve) {
        require(['./page/StoreData.vue'], resolve)
      },
      meta: {
        title: '店铺详情'
      }
    }, {
      path: 'user/waitforreceiving',
      component: function (resolve) {
        require(['./page/WaitForReceiving.vue'], resolve)
      },
      meta: {
        title: '待收货'
      }
    }, {
      path: 'user/waitforsend',
      component: function (resolve) {
        require(['./page/WaitForSend.vue'], resolve)
      },
      meta: {
        title: '待发货'
      }
    }, {
      path: 'user/waitforpayment',
      component: function (resolve) {
        require(['./page/WaitForPayment.vue'], resolve)
      },
      meta: {
        title: '待付款'
      }
    }, {
      path: 'user/finishorderlist',
      component: function (resolve) {
        require(['./page/FinishOrderList.vue'], resolve)
      },
      meta: {
        title: '已完成'
      }
    }, {
      path: 'user/qrcode',
      component: function (resolve) {
        require(['./page/MyQrcode.vue'], resolve)
      },
      meta: {
        title: '推广链接'
      }
    }, {
      path: 'user/teaminfo',
      component: function (resolve) {
        require(['./page/TeamInfo.vue'], resolve)
      },
      meta: {
        title: '团队详情'
      }
    }, {
      path: 'user/frozenidlist',
      component: function (resolve) {
        require(['./page/FrozenIdList.vue'], resolve)
      },
      meta: {
        title: '团队详情'
      }
    }, {
      path: 'user/unactiveidlist',
      component: function (resolve) {
        require(['./page/UnActiveIdList.vue'], resolve)
      },
      meta: {
        title: '团队详情'
      }
    }, {
      path: 'commodity/category',
      component: function (resolve) {
        require(['./page/CommodityCategory.vue'], resolve)
      },
      meta: {
        title: '商品分类'
      }
    }, {
      path: 'shoppingbag',
      component: function (resolve) {
        require(['./page/ShoppingBag.vue'], resolve)
      },
      meta: {
        title: '购物袋'
      }
    }
  ]
}, {
  path: '/registry',
  name: 'Registry',
  component: function (resolve) {
    require(['./page/Registry.vue'], resolve)
  },
  meta: {
    title: '用户注册'
  }
}, {
  path: '/login',
  name: 'Login',
  component: function (resolve) {
    require(['./page/Login.vue'], resolve)
  },
  meta: {
    title: '用户登陆'
  }
}, {
  path: '/forgetpassword',
  name: 'ForgetPassword',
  component: function (resolve) {
    require(['./page/ForgetPassword.vue'], resolve)
  },
  meta: {
    title: '忘记密码'
  }
}, {
  path: '/activateid',
  component: function (resolve) {
    require(['./page/ActivateID.vue'], resolve)
  },
  meta: {
    title: 'ID激活'
  }
}, {
  path: '/frozenaccount',
  component: function (resolve) {
    require(['./page/FrozenAccount.vue'], resolve)
  },
  meta: {
    title: '账户冻结'
  }
}, {
  path: '/user/payunfrozen',
  component: function (resolve) {
    require(['./page/PayUnfrozen.vue'], resolve)
  },
  meta: {
    title: '账户解冻'
  }
}, {
  path: '/iddating',
  component: function (resolve) {
    require(['./page/IDdating.vue'], resolve)
  },
  meta: {
    title: 'ID大厅'
  }
}]
const data = { pageCount: 0, cartCount: 0 }
const router = new VueRouter({
  mode: 'history',
  routes
})
router.beforeEach((to, from, next) => {
  if ((from.path === '/registry' || from.path === '/activateid' || from.path === '/user/payunfrozen') && to.path === '/login') {
    data.pageCount = 1
  } else {
    data.pageCount++
  }
  document.title = to.meta.title ? to.meta.title : 'higo'
  next()
})

Vue.http.interceptors.response.use(function (response) {
  // Do something with response data
  if (response.data.code === -2 || response.data.code === -1) {
    router.push('/login')
    return Promise.reject(response)
  } else {
    Vue.cookie.set('memberId', Vue.cookie.get('memberId'), { expires: '1D' })
    Vue.cookie.set('token', Vue.cookie.get('token'), { expires: '1D' })
    return response
  }
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  data,
  router,
  render: h => h(App)
}).$mount('#app-box')
