// 环境变量配置
const Environment = [
  { value: 'DEVELOP', mean: '开发环境' },
  { value: 'SANDBOX', mean: '沙箱环境' },
  { value: 'TEST', mean: '测试环境' },
  { value: 'PRE', mean: '预发环境' },
  { value: 'PRODUCT', mean: '生产环境' },
];

// 参数来源
const ForwardParameterSource = [
  { value: 'data', mean: '请求体' },
  { value: 'invokerInfo', mean: '调用者信息' },
  { value: 'authorizationInfo', mean: '授权信息' },
  { value: 'struct', mean: '自定义结构体' },
  { value: 'constant', mean: '固定值' },
];

// 参数类型
const ParameterType = [
  { value: 'STRING', mean: 'String' },
  { value: 'NUMERIC', mean: 'Numeric' },
  { value: 'DOUBLE', mean: 'Double' },
  { value: 'BOOLEAN', mean: 'Boolean' },
  { value: 'DATE', mean: 'Date' },
  { value: 'DATETIME', mean: 'Datetime' },
  { value: 'STRUCT', mean: 'Struct' },
  { value: 'STRING_ARRAY', mean: 'String[]' },
  { value: 'NUMERIC_ARRAY', mean: 'Numeric[]' },
  { value: 'DOUBLE_ARRAY', mean: 'Double[]' },
  { value: 'STRUCT_ARRAY', mean: 'Struct[]' },
];

export { Environment, ForwardParameterSource, ParameterType };
