const optionsA = [{ code: 'male', mean: 'male' }, { code: 'female', mean: 'female' }, { code: 'any', mean: 'any' }]
const optionsB = [{ code: 0, mean: 'no' }, { code: 1, mean: 'yes' }]

const config = {
  search: {
    fields: [
      { title: '性别', dataKey: 'sex', type: 'select', defaultValue: 'any', options: optionsA, required: true },
      { title: '年龄', dataKey: 'age', type: 'number' },
      { title: '单身', dataKey: 'single', type: 'select', options: optionsB },
      { title: '时间', dataKey: 'ccc', type: 'time' }
    ],
    url: 'https://pandora.derekz.cn/ekko'
  },
  table: {
    columns: [
      { title: '姓名', dataKey: 'name' },
      { title: '年龄', dataKey: 'age' },
      { title: '性别', dataKey: 'sex' },
      { title: '单身', dataKey: 'single' }
    ],
    actions: [
      { title: '删除', type: 'button', url: 'https://pandora.derekz.cn/ekko/delete' },
      { title: '启停', type: 'switch', related: 'single', url: 'https://pandora.derekz.cn/ekko/close' }
    ]
  }
}

export default config
