// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  'GET /api/demo/list': [
    {
      id: 1,
      key: '1',
      name: 'John Brown1',
      desc: 'New York No. 1 Lake Park',
    },
    {
      id: 2,
      key: '2',
      name: 'John Brown2',
      desc: 'New York No. 2 Lake Park',
    },
  ],
  'GET /api/demo/detail': {
    basic: {
      id: 1,
      name: 'Joe Black',
      desc: 'Sidney No. 1 Lake Park',
    },
    extra: [
      {
        key1: 'haha',
        key2: 'heihei',
        key3: 'hoho',
      },
      {
        key1: 'haha1',
        key2: 'heihei2',
        key3: 'hoho3',
      },
    ],
  },
  'POST /api/demo/saveExtra': {
    success: true,
  },
  'POST /api/demo/saveBasic': {
    success: true,
  },
};
