const menu = [{
  name: '基本类型',
  key: 'basic',
  icon: 'team',
  children: [{
    name: '查询类',
    url: '/search',
  }, {
    name: '表单类',
    url: '/form',
  }, {
    name: '弹窗类',
    url: '/drawer'
  }]
}, {
  name: '高级类型',
  key: 'senior',
  icon: 'database',
  children: [{
    name: '高级1',
    url: '/seniordemo',
  }]
}, {
  name: '外层菜单',
  key: 'outside',
  icon: 'message',
  url: '/outside'
}]

const logo = 'Ekko Demo'

export {
  menu,
  logo
}