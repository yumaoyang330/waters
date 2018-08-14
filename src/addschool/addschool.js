import React, { Component } from 'react';
import {  Icon, Button,Select,Table,Menu,Input,Layout,Cascader } from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import {schooladd} from '../axios';
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


const position = { longitude:120.29998693261706, latitude:30.25921745309445}


const mapEvents = 
  {
  created: (mapInstance) => {
    console.log(mapInstance);
  },
  click: (longitude) => {
    position.longitude=longitude.lnglat.Q;
    position.latitude=longitude.lnglat.N;
    document.getElementById('longitudetext').innerHTML=position.latitude;
   document.getElementById('latitudetext').innerHTML=position.longitude;
  },
}

const randomPosition = () => ({
  longitude:120.29998693261706*1,
  latitude:30.25921745309445*1,
});



class journal extends Component {
  constructor() {
    super();
    // Good Practice   
    this.mapCenter = { longitude: 120.201405, latitude: 30.231809 };
    this.markerPosition = { longitude: 120.201405, latitude: 30.231809  };
    this.markerPosition1 = {longitude: 120.180313, latitude: 30.24814 };
    }
  state = {
    collapsed: false,
    size: 'small',
    selectedRowKeys: [],
    longitude:position.longitude,
    latitude:position.latitude,
    mapCenter: randomPosition(),
    province:'浙江省',
    city:'杭州市',
    area:'西湖区',
    }

  componentWillMount = () => {
    document.title = "添加学校";
    function showTime(){
      let nowtime=new Date();
      let year=nowtime.getFullYear();
      let month=nowtime.getMonth()+1;
      let date=nowtime.getDate();
      document.getElementById("mytime").innerText=year+"年"+month+"月"+date+" "+nowtime.toLocaleTimeString();
    }
    
    setInterval(showTime,1000);


    if(localStorage.getItem('type')=== '1'){
      this.setState({
        display2:'none',
        display3:'none',
        display4:'none',
        display5:'none',
        display6:'none',
        display7:'none',
        display8:'none',
        display9:'none',
        disabled:true,
      });    
    }
    if(localStorage.getItem('type')=== '2'){
      this.setState({
        display2:'none',
        display6:'none',
        display9:'none',
        disabled:true,
      });    
    }
    if(localStorage.getItem('type')=== '3'){
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
    if(localStorage.getItem('type')=== '4'){
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
    if(localStorage.getItem('type')=== '8'){
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
  onChange=(date, dateString) =>{
    let arr=[];
    for(var i in dateString){  
     arr.push(dateString[i].label);
    }
    this.setState({
      province: arr[0],
      city:arr[1],
      area:arr[2],
      school:arr[3],
    });
  }
  addschool = () => {
    let schoolname=document.getElementById('schoolname').value;
    let contactname=document.getElementById('contactname').value;
    let contacttel=document.getElementById('contacttel').value;
    let address=document.getElementById('address').value;
    let longitudetext=document.getElementById('longitudetext').innerHTML;
    let latitudetext=document.getElementById('latitudetext').innerHTML;
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        schooladd([
          this.state.province,
          this.state.city,
          this.state.area,
          schoolname,
          contactname,
          contacttel,
          address,
          longitudetext,
          latitudetext,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
             alert("提交信息成功");
              setTimeout(() => {
                this.setState({
                  btn_disabled:false,
                });                  
              }, 2000);
          } else {
            alert("提交信息失败");
            this.setState({
              btn_disabled:false,
            });               
          }
        });
      } else {
        alert("请填好所有选项");
        this.setState({
          btn_disabled:false,
        });           
      }
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
            <div className="homepage"><Link to="/homepage" style={{color:'white'}}>总体信息预览</Link></div>
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
            <span  id="mytime" style={{height:"100%",borderRadius:'5px',color:'#333',marginLeft:'20px'}}></span>
            <div className="Administrator">
              <Icon type="search" />
                <Icon type="bell" />
                <span></span>{localStorage.getItem('realname')}
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
                <span className="locationtext"> 位置选择:</span> <Cascader defaultValue={['zhejiang', 'hangzhou', 'xihu']}  changeOnSelect options={options} onChange={this.onChange} 
                 style={{marginLeft:'20px',width:'40%'}}/>
                </div>
                <div className="clearfix">
                  <div style={{width: 560, height:400, float:'left'}}>
                  <Map 
                    amapkey={YOUR_AMAP_KEY}
                    events={mapEvents}
                    center={this.mapCenter}
                    zoom={20}
                    >
                    <Marker position={this.markerPosition} />
                    <Marker position={this.markerPosition1} />
                </Map>
                  </div>
                  <div className="explain">
                  <p><span>学校名称：</span> <Input placeholder="请输入学校名称"  style={{width:'60%'}} id="schoolname"/></p>
                    <p><span>联系人姓名：</span>  <Input placeholder="请输入联系人姓名"  style={{width:'60%'}} id="contactname"/></p>
                    <p><span>联系人电话：</span> <Input placeholder="请输入联系人电话"  style={{width:'60%'}} id="contacttel"/></p>
                    <p><span>详细地址：</span> <Input placeholder="请输入详细地址"  style={{width:'60%'}} id="address"/></p>
                    <p><span> 经度：</span> <span id="longitudetext">{this.state.longitude}</span> </p>
                    <p><span>纬度：</span> <span id="latitudetext">{this.state.latitude}</span></p>
                  </div>
                </div>
                <div className="bottom">
                <Button type="primary" style={{marginRight:'20px'}} size='large' onClick={this.addschool}>添加</Button>  
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

