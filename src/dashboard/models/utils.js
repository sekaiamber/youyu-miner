import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import message from '../../utils/message';
import fetch from '../../utils/fetch';
import QUERYS from '../querys';

const sendSms = data => fetch.post(QUERYS.SEND_SMS, data);
const sendResetSms = data => fetch.post(QUERYS.SEND_FORGET_SMS, data);
const signup = data => fetch.post(QUERYS.SIGNUP, data);
const resetPassword = data => fetch.post(QUERYS.RESET_PASSWORD, data);
const queryBanners = () => fetch.get(QUERYS.QUERY_BANNERS);

const pathConfigs = {
  '/': {
    header: {
      hide: true,
    },
    footer: {
      activeNav: 0,
    },
    refresh: [{
      type: 'account/queryMy',
    }, {
      type: 'account/queryAccount',
    }, {
      type: 'market/queryMarket',
    }, {
      type: 'queryBanners',
    }, {
      type: 'notice/queryNotices',
    }],
  },
  '/power': {
    header: {
      title: '我的邀请',
    },
    footer: {
      activeNav: 1,
    },
    refresh: [{
      type: 'account/queryMy',
    }, {
      type: 'account/queryAccount',
    }, {
      type: 'account/queryAcitiviesInvite',
    }, {
      type: 'account/querySubUser',
    }],
  },
  '/buy': {
    header: {
      title: '购买算力',
      icon: {
        left: 'back',
      },
    },
    refresh: [{
      type: 'product/queryProducts',
    }, {
      type: 'account/queryAccount',
    }],
  },
  '/wallet': {
    header: {
      title: '钱包',
    },
    footer: {
      activeNav: 3,
    },
    refresh: [{
      type: 'account/queryMy',
    }, {
      type: 'account/queryAccount',
    }, {
      type: 'market/queryMarket',
    }, {
      type: 'market/queryHome',
    }],
  },
  '/me': {
    header: {
      hide: true,
    },
    footer: {
      activeNav: 4,
    },
    refresh: [{
      type: 'account/queryMy',
    }],
  },
  '/notice': {
    header: {
      title: '公告',
      icon: {
        left: 'back',
      },
    },
    refresh: [{
      type: 'notice/queryNotices',
    }],
  },
  '/activities': {
    header: {
      title: '领取记录',
      icon: {
        left: 'back',
      },
    },
    refresh: [{
      type: 'account/queryAcitiviesDone',
      payload: 1,
    }],
  },
  '/invite': {
    header: {
      title: '邀请好友',
      icon: {
        left: 'back',
      },
    },
    refresh: [{
      type: 'account/queryMy',
    }],
  },
  '/miners': {
    header: {
      title: '矿工管理',
      icon: {
        left: 'back',
      },
    },
    refresh: [{
      type: 'account/queryAcitiviesAll',
    }, {
      type: 'account/queryAcitiviesTotal',
    }],
  },
  '/subuser': {
    header: {
      title: '我的矿工',
      icon: {
        left: 'back',
      },
    },
    refresh: [{
      type: 'account/querySubUser',
    }],
  },
  '/deposit/:currency': {
    header: {
      title: '充值',
      icon: {
        left: 'back',
      },
    },
    refresh: [{
      type: 'account/queryMy',
    }],
  },
  '/withdraw/:currency': {
    header: {
      title: '提现',
      icon: {
        left: 'back',
      },
    },
    refresh: [{
      type: 'account/queryAccount',
    }, {
      type: 'market/queryHome',
    }],
  },
  '/transfer/:currency': {
    header: {
      title: '转账',
      icon: {
        left: 'back',
      },
    },
    refresh: [{
      type: 'account/queryAccount',
    }, {
      type: 'market/queryHome',
    }],
  },
  '/signup': {
    header: {
      title: '注册',
      icon: {
        left: 'back',
      },
    },
  },
  '/login': {
    header: {
      title: '登录账户',
    },
  },
  '/forgetPassword': {
    header: {
      title: '重置密码',
      icon: {
        left: 'back',
      },
    },
  },
  '/post/:id': {
    header: {
      title: '__COVER__',
      icon: {
        left: 'back',
      },
    },
  },
  '/orders': {
    header: {
      title: '我的订单',
      icon: {
        left: 'back',
      },
    },
    refresh: [{
      type: 'account/queryOrders',
    }],
  },
  '/changePassword': {
    header: {
      title: '修改密码',
      icon: {
        left: 'back',
      },
    },
  },
  '/changeWithdrawPassword': {
    header: {
      title: '修改提现密码',
      icon: {
        left: 'back',
      },
    },
  },
  '/about': {
    header: {
      title: '',
    },
  },
};

export default {
  namespace: 'utils',
  state: {
    history: null,
    currentPath: '',
    currentPathConfig: {},
    loading: null,
    needUpgrade: null,
    coverHeaderTitle: null,
    banners: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      dispatch({
        type: 'updateState',
        payload: {
          history,
        },
      });
      history.listen(({ pathname }) => {
        const c = Object.keys(pathConfigs).find(key => pathToRegexp(key).exec(pathname));
        dispatch({
          type: 'updateState',
          payload: {
            currentPath: pathname,
            currentPathConfig: pathConfigs[c] || {},
            coverHeaderTitle: null,
          },
        });
        dispatch({
          type: 'refreshPage',
          pathname,
        });
        // const test = pathToRegexp(router.test).exec(pathname);
        // if (test) {
        //   dispatch({
        //     type: 'updateState',
        //   });
        // }
      });
    },
  },
  effects: {
    * goBack(_, { select }) {
      const history = yield select(({ utils }) => utils.history);
      history.goBack();
    },
    * goto({ goto }, { select, put }) {
      const history = yield select(({ utils }) => utils.history);
      if (history.location.pathname === goto) return;
      yield put(routerRedux.push(goto));
    },
    * loading({ loading }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          loading,
        },
      });
    },
    * sendSms({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'utils/loading',
        loading: {
          text: '发送中',
        },
      });
      const data = yield call(sendSms, payload);
      if (data.success) {
        message.success('已发送，请查看手机');
        if (onSuccess) onSuccess();
      }
      yield put({
        type: 'utils/loading',
        loading: null,
      });
    },
    * sendResetSms({ payload, onSuccess }, { call, put }) {
      yield put({
        type: 'utils/loading',
        loading: {
          text: '发送中',
        },
      });
      const data = yield call(sendResetSms, payload);
      if (data.success) {
        message.success('已发送，请查看手机');
        if (onSuccess) onSuccess();
      }
      yield put({
        type: 'utils/loading',
        loading: null,
      });
    },
    * signup({ payload }, { call, put }) {
      yield put({
        type: 'utils/loading',
        loading: {
          text: '注册中',
        },
      });
      const data = yield call(signup, payload);
      if (data.success) {
        message.success('注册成功，请登录');
        yield put({
          type: 'utils/goto',
          goto: '/login',
        });
      }
      yield put({
        type: 'utils/loading',
        loading: null,
      });
    },
    * resetPassword({ payload }, { call, put }) {
      const data = yield call(resetPassword, payload);
      if (data.success) {
        message.success('重置密码成功，请登录');
        yield put({
          type: 'utils/goto',
          goto: '/login',
        });
      }
    },
    * refreshPage({ pathname, onSuccess }, { select, put }) {
      let p = pathname;
      if (!p) {
        p = yield select(({ utils }) => utils.currentPath);
      }
      const pathes = Object.keys(pathConfigs);
      for (let i = 0; i < pathes.length; i += 1) {
        const path = pathes[i];
        const test = pathToRegexp(path).exec(p);
        if (test) {
          const config = pathConfigs[path];
          if (!config) return;
          const { refresh } = config;
          if (refresh) {
            for (let j = 0; j < refresh.length; j += 1) {
              const params = refresh[j];
              yield put(params);
            }
          }
        }
      }
      if (onSuccess) onSuccess();
    },
    * queryBanners(_, { call, put }) {
      const data = yield call(queryBanners);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            banners: data.data,
          },
        });
      }
    },
  },
  reducers: {
    updateCurrentPathName(state, { pathname, history }) {
      return { ...state, pathname, history };
    },
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
