import * as React from 'react';
import { Button } from 'antd';

export default function Operation (props: any) : any {
    return (
      [
        <Button key="import">导入模板</Button>,
        <Button key="savet">保存模板</Button>,
        <Button key="savea">保存活动</Button>,
        <Button key="preview">预览</Button>,
        <Button key="publish">发布</Button>
      ]
    );
}
