import React, { PureComponent } from 'react';
import { FormattedMessage } from 'umi/locale';
import { Tag, Menu, Icon, Dropdown, Avatar } from 'antd';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import jntm from '../../assets/jntm.jpeg';
import styles from './index.less';

const getUsername = () => {
  try {
    const token = document.cookie
      .split(';')
      .find(c => /__jwt=/.test(c))
      .replace(' __jwt=', '');
    const user = jwtDecode(token) || {};
    return user.username;
  } catch (error) {
    return null;
  }
};
export default class GlobalHeaderRight extends PureComponent {
  username = getUsername();

  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  render() {
    const { onMenuClick, theme } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }

    return (
      <div className={className}>
        <Dropdown overlay={menu}>
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar size="small" className={styles.avatar} src={jntm} alt="avatar" />
            <span className={styles.name}>{this.username || '鸡你太美'}</span>
          </span>
        </Dropdown>
      </div>
    );
  }
}
