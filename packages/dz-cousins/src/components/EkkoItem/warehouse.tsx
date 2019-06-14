import * as React from 'react';
import { Select, Input, DatePicker, InputNumber, Radio, Checkbox } from 'antd';

const { TextArea } = Input;
const RadioGroup = Radio.Group;

const changeValue = (value, props) => {
  const { ekkotag, dispatch, onChange, inStore } = props;

  if (onChange) {
    onChange(value);
  }
  if (inStore) {
    dispatch({
      type: 'global/setData',
      payload: {
        ekkotag,
        value,
      },
    });
  }
};

const renderInputNumber = (props: any) => (
  <InputNumber {...props} onChange={e => changeValue(e, props)} />
);
const renderTextArea = (props: any) => (
  <TextArea
    {...props}
    onChange={e => changeValue(props.mode !== 'form' ? e.target.value : e, props)}
  />
);
const renderInput = (props: any) => (
  <Input
    {...props}
    onChange={e => changeValue(props.mode !== 'form' ? e.target.value : e, props)}
  />
);
const renderDate = (props: any) => (
  <DatePicker {...props} onChange={(e, de) => changeValue(props.mode !== 'form' ? de : e, props)} />
);
const renderSelect = (props: any) => (
  <Select style={{ width: '100%' }} {...props} onChange={e => changeValue(e, props)}>
    {(props.options || []).map((item: any) => (
      <Select.Option key={item.value} value={item.value}>
        {item.mean}
      </Select.Option>
    ))}
  </Select>
);
const renderRadio = (props: any) => (
  <RadioGroup
    {...props}
    onChange={e => changeValue(props.mode !== 'form' ? e.target.value : e, props)}
  >
    {(props.options || []).map((item: any) => (
      <Radio key={item.value} value={item.value}>
        {item.mean}
      </Radio>
    ))}
  </RadioGroup>
);
const renderCheckBox = (props: any) => (
  <Checkbox
    {...props}
    onChange={e => changeValue(props.mode !== 'form' ? e.target.checked : e, props)}
  />
);

const warehouse = {
  input: {
    initialValue: undefined,
    renderFn: renderInput,
  },
  inputnumber: {
    initialValue: undefined,
    renderFn: renderInputNumber,
  },
  date: {
    initialValue: undefined,
    renderFn: renderDate,
  },
  select: {
    initialValue: undefined,
    renderFn: renderSelect,
  },
  radio: {
    initialValue: undefined,
    renderFn: renderRadio,
  },
  textarea: {
    initialValue: undefined,
    renderFn: renderTextArea,
  },
  checkbox: {
    initialValue: undefined,
    renderFn: renderCheckBox,
  },
};

export default warehouse;
