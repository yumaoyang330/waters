import React, { Component } from 'react';
import {  Icon, Button,Select,Table,Menu,Input,Layout,Cascader } from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import { Map, Marker } from 'react-amap';
import './addschool.css';

const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const YOUR_AMAP_KEY='076cb00b4c9014e47f9b19e1da93daca';
const options = [{
  value: 'zhejiang',
  label: '浙江省',
  children: [{
    value: 'hangzhou',
    label: '杭州市',
    children: [{
      value: 'xihu',
      label: '西湖区',
    },{
      value: 'jianggan',
      label: '江干区',
    },{
      value: 'xiacheng',
      label: '下城区',
    }],
  }],
}, {
  value: 'jiangsu',
  label: '江苏省',
  children: [{
    value: 'nanjing',
    label: '南京市',
    children: [{
      value: 'zhonghuamen',
      label: '中华门',
    }],
  }],
}];
function onChange(date, dateString) {
  console.log(date,dateString);
}
const position = { longitude: 120.113906, latitude:30.24691 }
const mapEvents = 
  {
  created: (mapInstance) => {
    console.log(mapInstance);
  },
  click: (longitude) => {
    position.longitude=longitude.lnglat.Q;
    position.latitude=longitude.lnglat.N;
    console.log(position.longitude);
    console.log(position.latitude);
    console.log('You clicked map');
  },
}
class journal extends Component {
  state = {
    collapsed: false,
    size: 'small',
    selectedRowKeys: [],
    longitude:position.longitude,
    latitude:position.latitude,
    }

  componentWillMount = () => {
    document.title = "添加学校";
  }
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }  
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }


  render() {
    return (   

      <div id="addschoolbody" >
      <Layout>
      <Sider 
        trigger={null}
        collapsible
        collapsed={this.state.collapsed}
      >
        <div className="logo" />
         <div className="Lowalar-left">
         <Menu
            defaultSelectedKeys={['6']}
            defaultOpenKeys={['sub4']}
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
            >   
            <div className="top"><span style={{display:"inline-block",width:'100%',height:"100%",borderRadius:'5px',background:'#1890ff',color:'white'}}>中小学直饮水机卫生监管平台</span></div>
            <SubMenu key="sub1" title={<span><Icon type="clock-circle-o" /><span>流程监控</span></span>}>
                <Menu.Item key="1"><Link to="/Lowalarm">流量报警</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/alarmsetting">流量报警设置</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title={<span><Icon type="edit" /><span>设备管理</span></span>}>
                <Menu.Item key="3"><Link to="/devInfo">设备在线查询</Link></Menu.Item>
                <Menu.Item key="4"><Link to="/management">设备管理</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" title={<span><Icon type="calendar" /><span>查询管理</span></span>}>
                <Menu.Item key="5"><Link to="/process">流程查询</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" title={<span><Icon type="warning" /><span>系统管理</span></span>}>
                <Menu.Item key="6"><Link to="/school">学校管理</Link></Menu.Item>
                <Menu.Item key="7"><Link to="/contact">区域联系人管理</Link></Menu.Item>
                <Menu.Item key="8"><Link to="/journal">操作日志查询</Link></Menu.Item>
                <Menu.Item key="9"><Link to="/highset">高级设置</Link></Menu.Item>
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
            <div className="Administrator">
              <Icon type="search" />
                <Icon type="bell" />
                <span></span>管理员
            </div>        
        </Header>
        <div className="nav">
          账号管理 / 添加学校
          </div>
          <div className="tit">
          添加学校
          </div>
        <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280,marginTop:'10px' }}>
        <div className="current">
                <div className="current_text">
                <div className="location">
                <span className="locationtext"> 位置选择:</span> <Cascader defaultValue={['zhejiang', 'hangzhou', 'xihu']} options={options} onChange={onChange} 
                 style={{marginLeft:'20px',width:'40%'}}/>
                </div>
                <div className="clearfix">
                  <div style={{width: 560, height:400, float:'left'}}>
                    <Map amapkey={YOUR_AMAP_KEY} center={ position }   events={mapEvents}/>
                  </div>
                  <div className="explain">
                  <p><span>学校名称：</span> <Input placeholder="请输入学校名称"  style={{width:'60%'}} id="alertThreshold"/></p>
                    <p><span>联系人姓名：</span>  <Input placeholder="请输入联系人姓名"  style={{width:'60%'}} id="alertThreshold"/></p>
                    <p><span>联系人电话：</span> <Input placeholder="请输入联系人电话"  style={{width:'60%'}} id="alertThreshold"/></p>
                    <p><span>详细地址：</span> <Input placeholder="请输入详细地址"  style={{width:'60%'}} id="alertThreshold"/></p>
                    <p><span> 经度：</span> {this.state.longitude}</p>
                    <p><span>纬度：</span> {this.state.latitude}</p>
                  </div>
                </div>
                <div className="bottom">
                <Button type="primary" style={{marginRight:'20px'}} size='large'>添加</Button>  
                <Button size='large'>重置</Button>
                </div>
                </div>
           </div>                                                     
        </Content>
      </Layout>
    </Layout>   
</div>                
    )
  }
}

export default journal = createForm()(journal);

