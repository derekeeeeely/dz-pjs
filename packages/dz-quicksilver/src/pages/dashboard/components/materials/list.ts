export default [{
  options: [{
    key: 'fields',
    value: '内容',
    children: [{
      key: 'key',
      value: '键名'
    }, {
      key: 'title',
      value: '标签名'
    }]
  }, {
    key: 'layout',
    value: '样式',
    children: [{
      key: 'labelCol',
      value: '标签比例'
    }, {
      key: 'wrapperCol',
      value: '内容比例'
    }]
  }],
  key: 'form',
  component: require('../../../../components/bullets/form')
}, {
  options: [{
    key: 'title',
    value: '标题'
  }, {
    key: 'content',
    value: '内容'
  }],
  key: 'card',
  component: require('../../../../components/bullets/card')
}, {
  options: [{
    key: 'url',
    value: '图片地址'
  }, {
    key: 'link',
    value: '跳转链接'
  }, {
    key: 'blank',
    value: '是否当前页'
  }],
  key: 'image',
  component: require('../../../../components/bullets/image')
}]