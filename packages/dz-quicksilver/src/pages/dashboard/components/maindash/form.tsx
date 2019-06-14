import * as React from 'react';
import AltFormItems from 'components/bullets/form/item'

const generateFields = (options: any) => {
  const fields: any[] = []

  const transform = (item: any) => {
    if (item.children) {
      item.children.map((l: any) => transform(l))
    } else {
      fields.push({
        title: item.value,
        key: item.key
      })
    }
  }

  options.map((item: any) => {
    transform(item)
  })

  return fields
}



export default function SettingForm (props: any) {
  const { options } = props;
  return (
    <div>
      <AltFormItems fields={generateFields(options)} />
    </div>
  );
}
