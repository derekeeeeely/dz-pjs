// import safeObj from 'safe-dot';
import { set } from 'lodash';
import request from '@/utils/request';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
  },

  effects: {
    *getData({ payload, api, ekkotag, translation }, { call, put }) {
      const fetchData = params => request(api, { params });
      let response = yield call(fetchData, payload);
      if (translation) {
        response = translation(response);
      }
      yield put({
        type: 'setData',
        payload: { value: response, ekkotag },
      });
    },
    *postData({ payload, api }, { call, put }) {
      const fetchData = data => request.post(api, { data });
      const response = yield call(fetchData, payload);
      try {
        yield put({
          type: 'postDataSuccess',
          payload: response,
        });
      } catch (e) {
        yield put({
          type: 'postDataError',
          message: e.message,
        });
      }
    },
  },

  reducers: {
    setData(state, { payload }) {
      const { ekkotag, value } = payload;
      const newState = Object.assign({}, state);
      set(newState, ekkotag, value);
      return newState;
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    resetData(state) {
      const { collapsed } = state;
      return {
        collapsed,
      };
    },
    postDataSuccess(state) {
      return state;
    },
    postDataError(state) {
      return state;
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
        // 路由变化清空store
        dispatch({ type: 'resetData' });
      });
    },
  },
};
