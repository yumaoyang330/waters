import React, { Component } from 'react';
import {  Icon, Button,Tabs,Select,DatePicker,Table,Menu,Cascader,Modal ,Layout,Row, Col ,Popconfirm,InputNumber,Form,Input,Dropdown} from 'antd';
import { Link } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;


class layout extends Component{

render() {
    return(
        <Layout>
        <Sider 
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
        >
          <div className="logo" />
           <div className="lowalar-left">
           <Menu
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
              theme="dark"
              inlineCollapsed={this.state.collapsed}
              >   
              <div className="top"><span style={{display:"inline-block",width:'100%',height:"100%",borderRadius:'5px',background:'#1890ff',color:'white'}}>中小学直饮水机卫生监管平台</span></div>
              <div className="homepage"><a href="http://datav.aliyun.com/share/d7d63263d774de3d38697367e3fbbdf7" style={{color:'white'}}>总体信息预览</a></div>
              <SubMenu key="sub1" title={<span><Icon type="clock-circle-o" /><span>流程监控</span></span>}>
                  <Menu.Item key="1" className="navbar1" style={{display:this.state.display1}}><Link to="/lowalarm">流量报警</Link></Menu.Item>
                  <Menu.Item key="2" style={{display:this.state.display2}}><Link to="/alarmsetting">流量报警设置</Link></Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" title={<span><Icon type="edit" /><span>设备管理</span></span>}>
                  <Menu.Item key="3" style={{display:this.state.display3}}><Link to="/devInfo">设备在线查询</Link></Menu.Item>
                  <Menu.Item key="4" style={{display:this.state.display4}}><Link to="/management">设备管理</Link></Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" title={<span><Icon type="calendar" /><span>查询管理</span></span>}>
                  <Menu.Item key="5" style={{display:this.state.display5}}><Link to="/process">流程查询</Link></Menu.Item>
              </SubMenu>
              <SubMenu key="sub4" title={<span><Icon type="warning" /><span>系统管理</span></span>}>
                  <Menu.Item key="6" style={{display:this.state.display6}}><Link to="/school">学校管理</Link></Menu.Item>
                  <Menu.Item key="7" style={{display:this.state.display7}}><Link to="/contact">区域联系人管理</Link></Menu.Item>
                  <Menu.Item key="8" style={{display:this.state.display8}}><Link to="/journal">操作日志查询</Link></Menu.Item>
                  <Menu.Item key="9" style={{display:this.state.display9}}><Link to="/highset">高级设置</Link></Menu.Item>
              </SubMenu>
              </Menu>
             </div>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
              <div className="switch-btn">
                  <Button type="primary"  onClick={this.toggle} style={{ marginLeft:"16px",  }}>
                  <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              />
                </Button>
                
              </div>
              <span  id="mytime" style={{height:"100%",borderRadius:'5px',color:'#333',marginLeft:'20px'}}></span>
              <div className="Administrator">
                <Icon type="search" />
                  <Icon type="bell" />
                  <span></span>{localStorage.getItem('realname')}
              </div>        
          </Header>
          <div className="nav">
        流程监控 / 流量报警
          </div>
          <div className="tit">
            报警查询
          </div>
          <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280,marginTop:'10px' }}>
          <div className="current">
                  <div className="curr">
                  <Tabs onChange={this.tabchange} type="card">
                      <TabPane tab="当前" key="1">

                      </TabPane>
                      <TabPane tab="历史" key="2">
 
                      </TabPane>
                  </Tabs>
                  </div>
             </div>      
          </Content>
        </Layout>
      </Layout>   
    )
    }
}

export default layout;