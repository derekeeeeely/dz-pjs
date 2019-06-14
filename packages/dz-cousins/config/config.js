// ref: https://umijs.org/config/
import { primaryColor } from '../src/defaultSettings';

export default {
  history: 'hash',
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        targets: {
          ie: 11,
        },
        locale: {
          enable: true, // default false
          default: 'zh-CN', // default zh-CN
          baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
        },
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
        },
      },
    ],
    [
      'umi-plugin-pro-block',
      {
        moveMock: false,
        moveService: false,
        modifyRequest: true,
        autoAddMenu: true,
      },
    ],
  ],
  targets: {
    ie: 11,
  },

  /**
   * 路由相关配置
   */
  routes: [
    {
      path: '/',
      component: '../layouts/BasicLayout',
      routes: [
        { path: '/', redirect: '/interfaces' },
        // dashboard
        {
          path: '/gateway',
          name: '网关协议',
          icon: 'setting',
          component: './gateway/list',
        },
        {
          path: '/gateway/:id',
          component: './gateway/version',
        },
        {
          path: '/gateway/version/:id',
          component: './gateway/detail',
        },
        {
          path: '/interfaces',
          name: '接口管理',
          icon: 'fork',
          component: './interfaces/list',
        },
        {
          path: '/interfaces/:id',
          component: './interfaces/version',
        },
        {
          path: '/interfaces/version/basic/:id',
          component: './interfaces/detail/index',
        },
        {
          path: '/interfaces/version/rr/:id',
          component: './interfaces/detail/rr',
        },
        {
          path: '/interfaces/version/transit/:id',
          component: './interfaces/detail/transit',
        },
        {
          path: '/interfaces/version/data/:id',
          component: './interfaces/detail/data',
        },
        {
          path: '/interfaces/version/env/:id',
          component: './interfaces/detail/env',
        },
        {
          path: '/transit',
          name: '转发协议',
          icon: 'setting',
          component: './transit/list',
        },
        {
          path: '/transit/:id',
          component: './transit/version',
        },
        {
          path: '/transit/version/:id',
          component: './transit/detail',
        },
        {
          path: '/demo',
          component: './demo',
          name: 'demo',
          icon: 'fork',
        },
        {
          path: '/demo/:id',
          component: './demo/detail',
        },
      ],
    },
  ],
  disableRedirectHoist: true,

  /**
   * webpack 相关配置
   */
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  publicPath: `//assets.dianwoda.cn/ekko/cousins/`,
};
