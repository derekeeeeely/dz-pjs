// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  'GET /api/interfaces/list': [
    {
      key: '1',
      name: 'John Brown',
      businessversion: '1.0',
      devversion: '0.5',
      des: 'hahaha',
      extend: '0.6',
      status: 'prod',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      businessversion: '1.0',
      devversion: '0.5',
      des: 'hahaha',
      extend: '0.6',
      status: 'prod',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      businessversion: '1.0',
      devversion: '0.5',
      des: 'hahaha',
      extend: '0.6',
      status: 'prod',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'GET /api/interfaces/version/list': [
    {
      id: 1,
    },
    {
      id: 2,
    },
  ],
};
