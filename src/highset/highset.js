import React, { Component } from 'react';
import {  Icon, Button,Select,Table,Menu,Input,Layout,Row, Col,message } from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import { changeplatformaddress} from '../axios';
import './highset.css';
import adminTypeConst from '../config/adminTypeConst';




const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;

class journal extends Component {
  state = {
    collapsed: false,
    size: 'small',
    selectedRowKeys: [],
    }

  componentWillMount = () => {
    document.title = "高级设置";
    function showTime(){
      let nowtime=new Date();
      let year=nowtime.getFullYear();
      let month=nowtime.getMonth()+1;
      let date=nowtime.getDate();
      document.getElementById("mytime").innerText=year+"年"+month+"月"+date+" "+nowtime.toLocaleTimeString();
    }
    
    setInterval(showTime,1000);

    if(localStorage.getItem('type')=== adminTypeConst.ADMIN_TYPE_SCHOOL_MANAGER){
      this.setState({
        display2:'none',
        display6:'none',
        display9:'none',
        disabled:true,
      });    
    }
    if(localStorage.getItem('type')=== adminTypeConst.ADMIN_TYPE_SCHOOL_MANTAINER){
      this.setState({
        display2:'none',
        display3:'none',
        display4:'none',
        display6:'none',
        display7:'none',
        display8:'none',
        display9:'none',
        disabled:true,
      });    
    }

    if(localStorage.getItem('type')=== adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER){
      this.setState({
        disabled:false,
        display3:'none',
        display4:'none',
        display9:'none',
        shpower:true,
        spower:true,
        qpower:true,
      });    
    }
    if(localStorage.getItem('type')=== adminTypeConst.ADMIN_TYPE_EDU_MANAGER){
      this.setState({
        disabled:false,
        display1:'none',
        display2:'none',
        display6:'none',
        display9:'none',
        shpower:true,
        spower:true,
        qpower:true,
      });    
    }
    if(localStorage.getItem('type')=== adminTypeConst.ADMIN_TYPE_SUPER_MANAGER){
      this.setState({
        disabled:false,
      });    
    }
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
  out = () => {
    localStorage.clear()
    window.location.href = "/login";
  }
  addresschange = (key) => {
    var address=document.getElementById('address').value;
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        if(address===""){
          message.error("请输入要修改的地址"); 
        }else{
          changeplatformaddress([
            address,
           ]).then(res => {
             if (res.data && res.data.status === 1) {
                console.log("身份验证成功");
               if(res.data && res.data.updateResult === 1){
                 message.success('地址修改成功')
               }
             } else if (res.data && res.data.status === 0){
               message.error("鉴权失败，需要用户重新登录");            
             }else if(res.data && res.data.status === 2){
               message.error("参数提取失败");   
             }else if(res.data && res.data.status === 3){
               message.error("服务器故障，请刷新再试"); 
             }
           });          
        }
      } else {
        message.error("获取接口失败");        
      }
    });
  }  

  render() {
    return (   

      <div id="highsetbody" >
      <Layout>
      <Sider 
        trigger={null}
        collapsible
        collapsed={this.state.collapsed}
      >
        <div className="logo" />
         <div className="Lowalar-left">
         <Menu
            defaultSelectedKeys={['9']}
            defaultOpenKeys={['sub4']}
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
            >   
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
                <Menu.Item key="6" style={{display:this.state.display6}}><Link to="/school">单位管理</Link></Menu.Item>
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
            <span  id="mytime" style={{height:"100%",lineHeight:"64px",display:"inline-block",float:"left",borderRadius:'5px',color:'#333',marginLeft:'20px'}}></span>
            <span style={{display:"inline-block",marginLeft:'20%', height:"100%",borderRadius:'5px',fontSize:'25px',fontWeight:'bold'}}>中小学直饮水机卫生监管平台</span>
            <span style={{float:'right',height:'50px',lineHeight:"50px",marginRight:"2%",color:'red',cursor:'pointer'}} onClick={this.out}>退出</span>   
            <div className="Administrator">
                <span></span>{localStorage.getItem('realname')}
            </div>        
        </Header>
        <div className="nav">
          账号管理 / 高级设置
          </div>
          <div className="tit">
          高级设置
          </div>
        <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280,marginTop:'10px' }}>
        <div className="current">
                <div className="current_text">
                  <div className='addinput'>  
                  修改平台通讯地址:        
                     <Input placeholder="请输入您要修改的地址" style={{marginTop:'15px'}}  id="address"/>
                  </div>   
                  <div className="btn">
                        <Button type="primary" onClick={this.addresschange}>确认</Button>  
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

