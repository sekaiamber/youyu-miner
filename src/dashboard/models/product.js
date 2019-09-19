import pathToRegexp from 'path-to-regexp';
import fetch from '../../utils/fetch';
import QUERYS from '../querys';
import cleanStateModel from '../../utils/cleanState';

const queryProducts = () => fetch.get(QUERYS.QUERY_PRODUCTS);
const buy = data => fetch.private.post(QUERYS.QUERY_ORDERS, data);
const continueOrder = id => fetch.private.post(QUERYS.CONTINUE(id));

export default cleanStateModel({
  namespace: 'product',
  state: {
    products: {},
  },
  subscriptions: {},
  effects: {
    * queryProducts(_, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          products: 'LOADING',
        },
      });
      const data = yield call(queryProducts);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            products: data.data,
          },
        });
      }
    },
    * buy({ payload, onSuccess, onFail }, { call, put }) {
      const data = yield call(buy, payload);
      if (data.success) {
        if (onSuccess) onSuccess();
        yield put({
          type: 'account/queryAccount',
        });
      } else if (onFail) {
        onFail();
      }
    },
    * continueOrder({ payload, onSuccess, onFail }, { call, put }) {
      const data = yield call(continueOrder, payload);
      if (data.success) {
        if (onSuccess) onSuccess();
        yield put({
          type: 'account/queryOrders',
        });
      } else if (onFail) {
        onFail();
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
