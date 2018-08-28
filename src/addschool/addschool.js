import React, { Component } from 'react';
import { Icon, Button, Select, Table, Menu, Input, Layout, Cascader, message } from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import { schooladd, gets } from '../axios';
import './addschool.css';
import adminTypeConst from '../config/adminTypeConst';
import Heads from '../component/head'
import Layouts from '../component/layout'



import typetext from './../type'
import typenum from './../types'


const AMap = window.AMap;
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;


function onChange(date, dateString) {
  console.log(date, dateString);
}


const position = { longitude: 120.29998693261706, latitude: 30.25921745309445 }





class journal extends Component {
  constructor() {
    super();
  }
  state = {
    collapsed: false,
    size: 'small',
    selectedRowKeys: [],
    longitude: position.longitude,
    latitude: position.latitude,

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
  out = () => {
    localStorage.clear()
    window.location.href = "/login";
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
  addschool = () => {
    let schoolname = document.getElementById('schoolname').value;
    let contactname = '';
    let contacttel = '';
    let address = document.getElementById('address').value;
    let creatpro = document.getElementById('creatpro').value;
    let creatcity = document.getElementById('creatcity').value;
    let creatarea = document.getElementById('creatarea').value;
    let longitudetext = document.getElementById('longitudetext').innerHTML;
    let latitudetext = document.getElementById('latitudetext').innerHTML;
    this.props.form.validateFields({ force: true }, (error) => {
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
                window.location.href = "/school";
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



    const plugins = [
      {
        name: 'ToolBar',
        options: {
          visible: true,  // 不设置该属性默认就是 true
          onCreated(ins) {
            console.log(ins);
          },
        },
      }
    ]





    var windowsArr = [];
    var marker = [];
    var map = new AMap.Map("mapContainer", {
      resizeEnable: true,
      keyboardEnable: false,
      center: [120.201316, 30.236285],//地图中心点
      zoom: 20,//地图显示的缩放级别
    });
    AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function () {
      var autoOptions = {
        city: "浙江", //城市，默认全国
        input: "facilityLocation"//使用联想输入的input的id
      };
      var autocomplete = new AMap.Autocomplete(autoOptions);
      var clickEventListener = map.on('click', function (e) {
        document.getElementById('longitudetext').innerHTML = e.lnglat.getLng();
        document.getElementById('latitudetext').innerHTML = e.lnglat.getLat();
        // alert(e.lnglat.getLng() + ',' + e.lnglat.getLat())
      });
      var placeSearch = new AMap.PlaceSearch({
        city: '浙江',
        map: map
      })
      AMap.event.addListener(autocomplete, "select", function (e) {
        //TODO 针对选中的poi实现自己的功能
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);
      });
    });


    const judgeRenderDataV = () => {
      return localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER || localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER
    }
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
                {
                  judgeRenderDataV() ? (
                    <div className="homepage" style={{ display: this.state.display10 }}>
                      <a href="https://datav.aliyun.com/share/d7d63263d774de3d38697367e3fbbdf7"
                        style={{ background: '#1890ff', color: 'white', display: "block", width: "100%", borderRadius: '5px' }}>总体信息预览</a>
                    </div>
                  ) : null
                }
                <SubMenu key="sub1" title={<span><Icon type="clock-circle-o" /><span>流程监控</span></span>}>
                  <Menu.Item key="1" style={{ display: this.state.display1 }}><Link to="/lowalarm">流量报警</Link></Menu.Item>
                  <Menu.Item key="2" style={{ display: this.state.display2 }}><Link to="/alarmsetting">流量报警设置</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title={<span><Icon type="edit" /><span>设备管理</span></span>}>
                  <Menu.Item key="3" style={{ display: this.state.display3 }}><Link to="/devInfo">设备在线查询</Link></Menu.Item>
                  <Menu.Item key="4" style={{ display: this.state.display4 }}><Link to="/management">设备管理</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" title={<span><Icon type="calendar" /><span>查询管理</span></span>}>
                  <Menu.Item key="5" style={{ display: this.state.display5 }}><Link to="/process">流程查询</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub4" title={<span><Icon type="warning" /><span>系统管理</span></span>}>
                  <Menu.Item key="6" style={{ display: this.state.display6 }}><Link to="/school">单位管理</Link></Menu.Item>
                  <Menu.Item key="7" style={{ display: this.state.display7 }}><Link to="/contact">区域联系人管理</Link></Menu.Item>
                  <Menu.Item key="8" style={{ display: this.state.display8 }}><Link to="/journal">操作日志查询</Link></Menu.Item>
                  <Menu.Item key="9" style={{ display: this.state.display9 }}><Link to="/highset">高级设置</Link></Menu.Item>
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
              <span id="mytime" style={{ height: "100%", lineHeight: "64px", display: "inline-block", float: "left", borderRadius: '5px', color: '#333', marginLeft: '20px' }}></span>
              <span style={{ display: "inline-block", marginLeft: '20%', height: "100%", borderRadius: '5px', fontSize: '25px', fontWeight: 'bold' }}>中小学直饮水机卫生监管平台</span>
              <span style={{ float: 'right', height: '50px', lineHeight: "50px", marginRight: "2%", color: 'red', cursor: 'pointer' }} onClick={this.out}>退出</span>
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
                  <div className="clearfix" >
                    <div style={{ width: 560, height: 400, float: 'left', position: 'relative' }}>
                      <input type="text" id="facilityLocation" placeholder="请输入关键字" name="facilityLocation" onfocus='this.value=""'
                        style={{
                          position: 'absolute', zIndex: '99', paddingLeft: '10px',
                          paddingRight: '10px',
                          fontSize: '14px', right: '10px', top: '10px', border: '1px solid #999', borderRadius: '10px',
                          outline: 'none', width: '35%',
                        }} />
                      <div id="mapContainer" style={{width: 560, height: 400}}>
                      </div>
                    </div>


                    <div className="explain">
                      <p style={{ display: this.state.super }}><span>添加省份：</span>  <Input placeholder="添加新的省份" style={{ width: '60%' }} id="creatpro" /></p>
                      <p style={{ display: this.state.super }}><span>添加城市：</span>  <Input placeholder="添加新的城市" style={{ width: '60%' }} id="creatcity" /></p>
                      <p style={{ display: this.state.super }}><span>添加区：</span>  <Input placeholder="添加新的区" style={{ width: '60%' }} id="creatarea" /></p>
                      <p><span>单位名称：</span> <Input placeholder="请输入单位名称" style={{ width: '60%' }} id="schoolname" /></p>
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

