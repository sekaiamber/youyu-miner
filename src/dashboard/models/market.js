import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import fetch from '../../utils/fetch';
import QUERYS from '../querys';
import cleanStateModel from '../../utils/cleanState';

const queryMarket = () => fetch.get(QUERYS.QUERY_MARKET);
const queryHome = () => fetch.get(QUERYS.QUERY_BLOCK);

function getPrice(data) {
  return {
    cny: data.ticker.last_cny,
    usdt: data.ticker.last_usdt,
    change: (parseFloat(data.ticker.last) - parseFloat(data.ticker.open)) / parseFloat(data.ticker.open),
  };
}

export default cleanStateModel({
  namespace: 'market',
  state: {
    prices: {
      ltc: {
        cny: 0,
        usdt: 0,
      },
      btc: {
        cny: 0,
        usdt: 0,
      },
      usdt: {
        cny: 0,
        usdt: 0,
      },
    },
    block: {
      height: 0,
      power: 0,
      level: 0,
    },
    fee: {
      btc: '0',
      usdt: '0',
      ltc: '0',
    },
  },
  subscriptions: {},
  effects: {
    * queryMarket(_, { call, put }) {
      const data = yield call(queryMarket);
      if (data.success) {
        const d = data.data;
        const prices = {
          btc: {
            cny: d.btc * d.usdt,
            usdt: d.btc,
          },
          ltc: {
            cny: d.ltc * d.usdt,
            usdt: d.ltc,
          },
          usdt: {
            cny: d.usdt,
            usdt: 1,
          },
        };
        yield put({
          type: 'updateState',
          payload: {
            prices,
          },
        });
      }
    },
    * queryHome(_, { call, put }) {
      const data = yield call(queryHome);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            block: {
              btc: data.data.btc,
              ltc: data.data.ltc,
            },
            fee: {
              btc: data.data.btc_fee,
              usdt: data.data.usdt_fee,
              ltc: data.data.ltc_fee,
            },
          },
        });
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
});
