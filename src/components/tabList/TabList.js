/*
 * tablist
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Tabs } from 'antd';
const { TabPane } = Tabs;

class TabList extends React.Component {
    constructor(props) {
      super(props);
      this.newTabIndex = 0;
      const panes = [
        { title: 'Tab 1', content: 'Content of Tab 1', key: '1',unsave: false },
        { title: 'Tab 2', content: 'Content of Tab 2', key: '2',unsave: false },
        {
          title: 'Tab 3',
          content: 'Content of Tab 3',
          key: '3',
          closable: false,
          unsave: false
        },
      ];
      this.state = {
        activeKey: panes[0].key,
        panes,
      };
    }
  
    onChange = activeKey => {
      this.setState({ activeKey });
    };
  
    onEdit = (targetKey, action) => {
      this[action](targetKey);
    };
  
    add = () => {
      const { panes } = this.state;
      const activeKey = `newTab${this.newTabIndex++}`;
      panes.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey });
      this.setState({ panes, activeKey });
    };
  
    remove = targetKey => {
      let { activeKey } = this.state;
      let lastIndex;
      this.state.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      const panes = this.state.panes.filter(pane => pane.key !== targetKey);
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].key;
        } else {
          activeKey = panes[0].key;
        }
      }
      this.setState({ panes, activeKey });
    };
  
    render() {
      return (
        <Tabs
          onChange={this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={this.onEdit}
        >
          {this.state.panes.map(pane => (
            <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
              {pane.content}
            </TabPane>
          ))}
        </Tabs>
      );
    }
  }
  

// TabList.propTypes = {
//     files: PropTypes.array,
//     activeId: PropTypes.string,
//     unsaveIds: PropTypes.array,
//     onTabClick: PropTypes.func,
//     onCloseTab: PropTypes.func
// }
export default TabList
