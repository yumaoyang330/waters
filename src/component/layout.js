import React from 'react';
import {  Icon,Tabs,Menu} from 'antd';
import { Link } from 'react-router-dom';


const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;


class Layouts extends React.Component{
  state = {
    display1:'',
    display2:'',
    display3:'',
    display4:'',
    display5:'',
    display6:'',
    display7:'',
    display8:'',
    display9:'',
    process:'',
  }; 

render() {
    alert(666)
    return(
      <div>
      <div className="homepage" ><a href="https://datav.aliyun.com/share/d7d63263d774de3d38697367e3fbbdf7" style={{background: '#1890ff', color: 'white',display:"block",width:"100%",borderRadius:'5px'}}>总体信息预览</a></div>
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
      </div>
    )
    }
}

export default Layouts;