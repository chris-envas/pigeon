/*
 * tablist
 */
import React from 'react'
import PropTypes from 'prop-types'


import { Tabs } from 'antd';

const { Tabfile } = Tabs;

class TabList extends React.Component {
  constructor(props) {
    super(props);
    this.newTabIndex = 0;

    this.state = {
      activeKey: this.props.files[0].key,
      files: this.props.files,
    };
  }

  onChange = activeKey => {
    this.setState({ activeKey });
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {
    const { files } = this.state;
    const activeKey = `newTab${this.newTabIndex++}`;
    files.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey });
    this.setState({ files, activeKey });
  };

  remove = targetKey => {
    let { activeKey } = this.state;
    let lastIndex;
    this.state.files.forEach((file, i) => {
      if (file.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const files = this.state.files.filter(file => file.key !== targetKey);
    if (files.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = files[lastIndex].key;
      } else {
        activeKey = files[0].key;
      }
    }
    this.setState({ files, activeKey });
  };

  render() {
    return (
      <Tabs
        onChange={this.onChange}
        activeKey={this.state.activeKey}
        type="editable-card"
        onEdit={this.onEdit}
      >
        {this.state.files.map(file => (
          <Tabfile tab={file.title} key={file.key} closable={file.closable}>
            {file.content}
          </Tabfile>
        ))}
      </Tabs>
    );
  }
}

TabList.propTypes = {
    files: PropTypes.array,
    activeId: PropTypes.string,
    unsaveIds: PropTypes.array,
    onTabClick: PropTypes.func,
    onCloseTab: PropTypes.func
}
export default TabList
