import React, { Component } from 'react';
import { Icon, Button, Select, Table, Menu, Input, Layout, Cascader ,message} from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import { schooladd, gets } from '../axios';
import { Map, Marker } from 'react-amap';
import './addschool.css';
import adminTypeConst from '../config/adminTypeConst';



import typetext from './../type'
import typenum from './../types'

const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const YOUR_AMAP_KEY = '076cb00b4c9014e47f9b19e1da93daca';

function onChange(date, dateString) {
  console.log(date, dateString);
}


const position = { longitude: 120.29998693261706, latitude: 30.25921745309445 }


const mapEvents =
{
  created: (mapInstance) => {
    console.log(mapInstance);
  },
  click: (longitude) => {
    position.longitude = longitude.lnglat.Q;
    position.latitude = longitude.lnglat.N;
    document.getElementById('longitudetext').innerHTML = position.latitude;
    document.getElementById('latitudetext').innerHTML = position.longitude;
  },
}

const randomPosition = () => ({
  longitude: 120.29998693261706 * 1,
  latitude: 30.25921745309445 * 1,
});



class journal extends Component {
  constructor() {
    super();
    // Good Practice   
    this.mapCenter = { longitude: 120.201405, latitude: 30.231809 };
    this.markerPosition = { longitude: 120.201405, latitude: 30.231809 };
    this.markerPosition1 = { longitude: 120.180313, latitude: 30.24814 };
  }
  state = {
    collapsed: false,
    size: 'small',
    selectedRowKeys: [],
    longitude: position.longitude,
    latitude: position.latitude,
    mapCenter: randomPosition(),
    province: '浙江',
    city: '杭州',
    area: '',
    super: 'none',
  }

  componentWillMount = () => {
    document.title = "添加单位";
    function showTime() {
      let nowtime = new Date();
      let year = nowtime.getFullYear();
      let month = nowtime.getMonth() + 1;
      let date = nowtime.getDate();
      document.getElementById("mytime").innerText = year + "年" + month + "月" + date + " " + nowtime.toLocaleTimeString();
    }
    setInterval(showTime, 1000);




    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        gets([
          localStorage.getItem('token'),
        ]).then(res => {
          if (res.data && res.data.status === 1) {
            localStorage.setItem('cascadedlocation', JSON.stringify(res.data.cascadedlocation)
            ),
              this.setState({
                province: res.data.cascadedlocation[0].value,
                city: res.data.cascadedlocation[0].children[0].value,
                area: res.data.cascadedlocation[0].children[0].children[0].value,
              });
          }
        })
      }
    })
    if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_SCHOOL_MANAGER) {
      this.setState({
        display2: 'none',
        display6: 'none',
        display9: 'none',
        disabled: true,
      });
    }
    if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_SCHOOL_MANTAINER) {
      this.setState({
        display2: 'none',
        display3: 'none',
        display4: 'none',
        display6: 'none',
        display7: 'none',
        display8: 'none',
        display9: 'none',
        disabled: true,
      });
    }

    if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER) {
      this.setState({
        disabled: false,
        display3: 'none',
        display4: 'none',
        display9: 'none',
        shpower: true,
        spower: true,
        qpower: true,
      });
    }
    if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_EDU_MANAGER) {
      this.setState({
        disabled: false,
        display1: 'none',
        display2: 'none',
        display6: 'none',
        display9: 'none',
        shpower: true,
        spower: true,
        qpower: true,
      });
    }
    if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER) {
      this.setState({
        disabled: false,
        super: 'normal',
      });
    }

  }

  onChange = (date, dateString) => {
    let arr = [];
    for (var i in dateString) {
      arr.push(dateString[i].label);
    }
    if (arr[1] === undefined) {
      this.setState({
        province: arr[0],
        city: '',
        area: '',
        school: '',
      })
    } else {
      if (arr[2] === undefined) {
        this.setState({
          province: arr[0],
          city: arr[1],
          area: '',
          school: '',
        })
      } else {
        if (arr[3] === undefined) {
          this.setState({
            province: arr[0],
            city: arr[1],
            area: arr[2],
            school: '',
          });
        } else {
          this.setState({
            province: arr[0],
            city: arr[1],
            area: arr[2],
            school: arr[3],
          });
        };
      }
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
  onChange = (date, dateString) => {
    let arr = [];
    for (var i in dateString) {
      arr.push(dateString[i].label);
    }
    this.setState({
      province: arr[0],
      city: arr[1],
      area: arr[2],
    });
  }
  out = () => {
    localStorage.clear()
    window.location.href = "/login";
  }
  addschool = () => {
    let schoolname = document.getElementById('schoolname').value;
    let contactname = document.getElementById('contactname').value;
    let contacttel = document.getElementById('contacttel').value;
    let address = document.getElementById('address').value;
    let creatpro = document.getElementById('creatpro').value;
    let creatcity = document.getElementById('creatcity').value;
    let creatarea = document.getElementById('creatarea').value;
    let longitudetext = document.getElementById('longitudetext').innerHTML;
    let latitudetext = document.getElementById('latitudetext').innerHTML;
    var telrule = /^[1][3,4,5,7,8][0-9]{9}$/;
    var namerule = /^[\u4E00-\u9FA5A-Za-z]+$/;
    this.props.form.validateFields({ force: true }, (error) => {
      if (!namerule.test(contactname)) {
        message.error('请输入您的真实姓名');
        return;
      }
      if (!telrule.test(contacttel)) {
        message.error('您输入的手机号码不合法');
        return;
      }
      if (!error) {
        if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER) {
          schooladd([
            creatpro,
            creatcity,
            creatarea,
            schoolname,
            contactname,
            contacttel,
            address,
            longitudetext,
            latitudetext,
          ]).then(res => {
            if (res.data && res.data.status === 1) {
              this.props.form.validateFields({ force: true }, (error) => {
                if (!error) {
                  gets([
                    localStorage.getItem('token'),
                  ]).then(res => {
                    if (res.data && res.data.status === 1) {
                      localStorage.setItem('cascadedlocation', JSON.stringify(res.data.cascadedlocation)
                      ),
                        this.setState({
                          province: res.data.cascadedlocation[0].value,
                          city: res.data.cascadedlocation[0].children[0].value,
                          area: res.data.cascadedlocation[0].children[0].children[0].value,
                        });
                    }
                  })
                }
              })
              message.success("创建单位成功");
              setTimeout(() => {
                window.location.href = "/school/school";
              }, 1000);    
              
            } else {
              message.error("创建单位失败");
            }
          });
        } else {
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
              this.props.form.validateFields({ force: true }, (error) => {
                if (!error) {
                  gets([
                    localStorage.getItem('token'),
                  ]).then(res => {
                    if (res.data && res.data.status === 1) {
                      localStorage.setItem('cascadedlocation', JSON.stringify(res.data.cascadedlocation)
                      ),
                        this.setState({
                          province: res.data.cascadedlocation[0].value,
                          city: res.data.cascadedlocation[0].children[0].value,
                          area: res.data.cascadedlocation[0].children[0].children[0].value,
                        });
                    }
                  })
                }
              })
              message.success("创建单位成功");
              window.location.href = "/school";
            } else {
              message.error("创建单位失败");
            }
          });
        }
      } else {
        message.error("请重新登陆");
      }
    });
  }

  render() {
  const ZoomCtrl = (props) => {
    const map = props.__map__;
    map.plugin('AMap.Autocomplete',function(){//回调函数
      var autoOptions = {
        city: '全国',
        input: "facilityLocation"
      }
      var autoComplete = new map.Autocomplete(autoOptions);
      map.event.addListener(autoComplete, "select", function(data){
        [ {
           "type": "select",
           "poi": {
               "id": "B000A80X4B",
               "name": "北京市建设工程专业劳务发包承包交易中心(西城区政协北)",
               "district": "北京市西城区",
               "adcode": "110102",
               "location": {
                   "I": 39.873013,
                   "C": 116.351675,
                   "lng": 116.351675,
                   "lat": 39.873013
               },
               "address": "广安门南街甲68号",
               "typecode": "130100"
           }
       }]
       }); //注册监听，当选中某条记录时会触发
  });
}


    // const ZoomCtrl = (props) => {
    //   const map = props.__map__;
    //   if (!map) {
    //     console.log('组件必须作为 Map 的子组件使用');
    //     return;
    //   }
      // var autoOptions = {
      //   city: '全国',
      //   input: "facilityLocation"
      // }
      // var autoComplete = new map.Autocomplete(autoOptions);
      // map.event.addListener(autoComplete, "select", function(data){
      //  [ {
      //     "type": "select",
      //     "poi": {
      //         "id": "B000A80X4B",
      //         "name": "北京市建设工程专业劳务发包承包交易中心(西城区政协北)",
      //         "district": "北京市西城区",
      //         "adcode": "110102",
      //         "location": {
      //             "I": 39.873013,
      //             "C": 116.351675,
      //             "lng": 116.351675,
      //             "lat": 39.873013
      //         },
      //         "address": "广安门南街甲68号",
      //         "typecode": "130100"
      //     }
      // }]
      // }); //注册监听，当选中某条记录时会触发
      // function select(e) {
      //   if (e.poi && e.poi.location) {
      //     map.setZoom(20);
      //     map.setCenter(e.poi.location);
      //     var marker = new map.Marker({
      //       position: map.getCenter(),
      //       draggable: true,
      //       cursor: 'move',
      //       raiseOnDrag: true
      //     });
      //     marker.setMap(map);
      //   }
      // }


      //为地图注册click事件获取鼠标点击出的经纬度坐标



    //   return (<div>
    //    <Input type="text" id="facilityLocation" />
    //   </div>);
    // };

    const options = JSON.parse(localStorage.getItem('cascadedlocation'));
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
           <div className="homepage" ><a href="https://datav.aliyun.com/share/d7d63263d774de3d38697367e3fbbdf7" style={{background: '#1890ff', color: 'white',display:"block",width:"100%",borderRadius:'5px'}}>总体信息预览</a></div>
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
                  <Menu.Item key="6"><Link to="/school">单位管理</Link></Menu.Item>
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
                <Button type="primary" onClick={this.toggle} style={{ marginLeft: "16px", }}>
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
              账号管理 / 添加单位
          </div>
            <div className="tit">
              添加单位
          </div>
            <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280, marginTop: '10px' }}>
              <div className="current">
                <div className="current_text">
                  <div className="clearfix">
                    <div className="location" style={{ width: '560px', float: 'left' }}>
                      位置选择:<Cascader defaultValue={['zhejiang', 'hangzhou', 'xihu', 'xuejun']}
                        disabled={this.state.disabled} value={[this.state.province, this.state.city, this.state.area, this.state.school,]}
                        options={options} onChange={this.onChange} changeOnSelect style={{ marginLeft: '20px', width: "60%" }} />
                    </div>
                    <div className="supermanager" style={{ display: this.state.super }}>
                      <span style={{ color: '#000000' }}>尊敬的 </span>
                      <span style={{ color: "#1890FF" }}>{typetext[localStorage.getItem('type')]}</span>
                      <span style={{ color: "#000000" }}> 你好，依据平台设定，您具有以下账号管理权限：</span>
                      <p>平台中涉及到的单位都是根据需要而添加，所以请超级管理员根据后期需求，将新增网点的地址添加进来，以方便其他角色进行其他操作！！
                        <span style={{ color: 'red', marginLeft: "10px" }}>注:</span>
                        <span style={{ color: "#1890FF" }}>省市区的格式请做好统一的规范！！</span>
                      </p>
                    </div>
                  </div>
                  <div className="clearfix">
                    <div style={{ width: 560, height: 400, float: 'left',position:'relative' }} id="container">
                      <input type="text" id="facilityLocation"  placeholder="请输入关键字" 
                       style={{position:'absolute',zIndex:'99',paddingLeft:'10px',
                       fontSize:'14px',right:'10px',top:'10px',border:'1px solid #999',borderRadius:'10px',
                       outline:'none',width:'35%'}}/>
                      <Map
                        version={'1.4.4'}
                        plugins={'AMap.Autocomplete'}
                        amapkey={YOUR_AMAP_KEY}
                        events={mapEvents}
                        center={this.mapCenter}
                        zoom={20}
                      >
                        <ZoomCtrl />

                        {/* <Marker position={this.markerPosition} />
                    <Marker position={this.markerPosition1} /> */}
                      </Map>
                    </div>
                    <div className="explain">
                      <p style={{ display: this.state.super }}><span>添加省份：</span>  <Input placeholder="添加新的省份" style={{ width: '60%' }} id="creatpro" /></p>
                      <p style={{ display: this.state.super }}><span>添加城市：</span>  <Input placeholder="添加新的城市" style={{ width: '60%' }} id="creatcity" /></p>
                      <p style={{ display: this.state.super }}><span>添加区：</span>  <Input placeholder="添加新的区" style={{ width: '60%' }} id="creatarea" /></p>
                      <p><span>单位名称：</span> <Input placeholder="请输入单位名称" style={{ width: '60%' }} id="schoolname" /></p>
                      <p><span>联系人姓名：</span>  <Input placeholder="请输入联系人姓名" style={{ width: '60%' }} id="contactname" /></p>
                      <p><span>联系人电话：</span> <Input placeholder="请输入联系人电话" style={{ width: '60%' }} id="contacttel" /></p>
                      <p><span>详细地址：</span> <Input placeholder="请输入详细地址" style={{ width: '60%' }} id="address" /></p>
                      <p><span> 经度：</span> <span id="longitudetext">{this.state.longitude}</span> </p>
                      <p><span>纬度：</span> <span id="latitudetext">{this.state.latitude}</span></p>
                    </div>
                  </div>
                  <div className="bottom">
                    <Button type="primary" style={{ marginRight: '20px' }} size='large' onClick={this.addschool}>添加</Button>
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

