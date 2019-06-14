const config = {
  url: 'https://pandora.derekz.cn/ekko/add',
  items: [
    { dataKey: 'name', title: '姓名', type: 'input' },
    { dataKey: 'age', title: '年龄', type: 'number',
      rules: [{
        required: true,
        message: '年龄必填'
      }, {
        validator: (rule, value, callback) => {
          if (!/^\d+(.\d{0})?$/.test(value)) {
            callback('请输入正整数')
          }
          callback()
        }
      }]
    },
    { dataKey: 'sex', title: '性别', type: 'select',
      options: [{ value: 'male', mean: "male" }, { value: 'female', mean: "female"}]
    },
    { dataKey: 'single', title: '单身', type: 'select',
      options: [{ value: 0, mean: "no" }, { value: 1, mean: "yes" }]
    },
  ]
}

export default config
