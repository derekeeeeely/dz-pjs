export default {
  namespace: 'interfaces',

  state: {
    level: 'list',
  },

  effects: {},

  reducers: {
    changeLevel(state, { payload }) {
      const { level } = payload;
      return {
        ...state,
        level,
      };
    },
  },

  subscriptions: {},
};
