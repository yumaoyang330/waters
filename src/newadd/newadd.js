import React, { Component } from 'react';
import { Icon, Button, Select, Table, Menu, Input, Layout, Row, Col, Popconfirm, Tabs, Cascader, message } from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import { equipmentadd, getrespersoninfo, gets } from '../axios';
import './newadd.css';
import adminTypeConst from '../config/adminTypeConst';


var _val = ""

const TabPane = Tabs.TabPane;

function callback(key) {
  console.log(key);
}
const dataSource = [];
for (let i = 0; i < 1; i++) {
  dataSource.push({
    province: '',
    city: '',
    county: '',
    school: '',
    location: '',
    type: '',
    content: '',
    alertThreshold: '',
    batteryThreshold: '',
    simId: '',
    key: i,
    deviceId: '',
    location: '',
    initFlow: '',
  });
}
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;

class newadd extends Component {
  constructor(props) {
    super(props);
    this.columns = [{
      width: '30%',
      dataIndex: 'deviceId',
      render: (text, record) => {
        return (
          <div className="gutter-box" style={{ fontSize: '16px' }}>
            设备编号:<Input type="text" className="deviceId" placeholder="请输入设备编号" style={{ width: '60%', marginLeft: '10px' }} />
          </div>
        );
      },
    }, {
      dataIndex: 'location',
      width: '30%',
      render: (text, record) => {
        return (
          <div className="gutter-box" style={{ fontSize: '16px' }}>
            安装地址:<Input placeholder="安装地址" style={{ width: '60%', marginLeft: '10px' }} className="locations" />
          </div>
        );
      },
    }, {
      dataIndex: 'flow',
      width: '20%',
      render: (text, record) => {
        return (
          <div className="gutter-box" style={{ fontSize: '16px' }}>
            初始流量:<Input placeholder="0" style={{ width: '40%', marginLeft: '10px' }} className="initFlow"  />
          </div>
        );
      },
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
      align: 'right',
      render: (text, record) => {
        return (
          dataSource.length > 1 ?
            (
              <Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(record.key)}>
                <a href="javascript:;">删除</a>
              </Popconfirm>
            ) : null
        );
      },
    }];
    this.state = {
      num: 15,
      collapsed: false,
      size: 'small',
      selectedRowKeys: [],
      dataSource: dataSource,
      count: 2,
      province: '',
      city: '',
      area: '',
      school: '',
      repairname: "",
      organization: '',
      repairemail: '',
      repairphone: '',
      alertname: "",
      alertorganization: '',
      alertemail: '',
      alertphone: '',
    };
  }

  componentWillMount = () => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        gets([
          localStorage.getItem('token'),
        ]).then(res => {
          if(localStorage.getItem('token')===null){
            window.location.href = "/login";
          }
          if (res.data && res.data.status === 1) {
            this.setState({
              province: res.data.cascadedlocation[0].value,
              city: res.data.cascadedlocation[0].children[0].value,
              area: res.data.cascadedlocation[0].children[0].children[0].value,
              school: res.data.cascadedlocation[0].children[0].children[0].children[0].value,
            });
            //获取维修和报警人员信息接口      
            getrespersoninfo([
              this.state.province,
              this.state.city,
              this.state.area,
              this.state.school,
            ]).then(res => {
              if (res.data && res.data.status === 1) {
                if (res.data.resPerson.repairInfo[0] === undefined) {
                  this.setState({
                    repairname: ' ',
                    repairphone: ' ',
                    repairemail: ' ',
                    organization: ' ',
                  });
                } else {
                  this.setState({
                    repairname: res.data.resPerson.repairInfo[0].name,
                    repairphone: res.data.resPerson.repairInfo[0].phone,
                    repairemail: res.data.resPerson.repairInfo[0].email,
                    organization: res.data.resPerson.repairInfo[0].organization,
                  });
                }
                if (res.data.resPerson.alertInfo[0] === undefined) {
                  this.setState({
                    alertname: ' ',
                    alertphone: ' ',
                    alertemail: ' ',
                    alertorganization: ' ',
                  });
                } else {
                  this.setState({
                    alertname: res.data.resPerson.alertInfo[0].name,
                    alertphone: res.data.resPerson.alertInfo[0].phone,
                    alertemail: res.data.resPerson.alertInfo[0].email,
                    alertorganization: res.data.resPerson.alertInfo[0].organization,
                  });
                }
              } else if (res.data && res.data.status === 0) {
                message.error("鉴权失败，需要用户重新登录");
              } else if (res.data && res.data.status === 2) {
                message.error("参数提取失败");
              } else if (res.data && res.data.status === 3) {
                message.error("服务器故障，请刷新再试");
              }
            });

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
                display10: 'none',
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
              });
            }
          } else {
            message.error("获取信息失败");
          }
        });
      } else {
        message.error("获取接口失败");
      }


    });

    document.title = "新增设备";
    function showTime() {
      let nowtime = new Date();
      let year = nowtime.getFullYear();
      let month = nowtime.getMonth() + 1;
      let date = nowtime.getDate();
      document.getElementById("mytime").innerText = year + "年" + month + "月" + date + " " + nowtime.toLocaleTimeString();
    }

    setInterval(showTime, 1000);
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
  changeVal = (e) => {
    var val = e.target.value;
    if (isNaN(val)) {
      val = _val;
      this.setState({ "info": "只能输入数字!" });
      setTimeout(function () {
        this.setState({ "info": "" });
      }.bind(this), 1000);
    } else {
      _val = val;
    }
    this.setState({ "val": val });
  }
  onDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter(item => item.key !== key)
    });
    dataSource.length--
    console.log(dataSource.length)
  }
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
    };
    this.setState({
      dataSource: [...dataSource, newData],
    });
    dataSource.length++
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
      }, function () {
        this.props.form.validateFields({ force: true }, (error) => {
          if (!error) {
            getrespersoninfo([
              this.state.province,
              this.state.city,
              this.state.area,
              this.state.school,
            ]).then(res => {
              if (res.data && res.data.status === 1) {
                if (res.data.resPerson.repairInfo[0] === undefined) {
                  this.setState({
                    repairname: '',
                    repairphone: '',
                    repairemail: '',
                    organization: '',
                  });
                } else {
                  this.setState({
                    repairname: res.data.resPerson.repairInfo[0].name,
                    repairphone: res.data.resPerson.repairInfo[0].phone,
                    repairemail: res.data.resPerson.repairInfo[0].email,
                    organization: res.data.resPerson.repairInfo[0].organization,
                  });
                }
                if (res.data.resPerson.alertInfo[0] === undefined) {
                  this.setState({
                    alertname: '',
                    alertphone: '',
                    alertemail: '',
                    alertorganization: '',
                  });
                } else {
                  this.setState({
                    alertname: res.data.resPerson.alertInfo[0].name,
                    alertphone: res.data.resPerson.alertInfo[0].phone,
                    alertemail: res.data.resPerson.alertInfo[0].email,
                    alertorganization: res.data.resPerson.alertInfo[0].organization,
                  });
                }
              } else if (res.data && res.data.status === 0) {
                message.error("鉴权失败，需要用户重新登录");
              } else if (res.data && res.data.status === 2) {
                message.error("参数提取失败");
              } else if (res.data && res.data.status === 3) {
                message.error("服务器故障，请刷新再试");
              }
            });
          } else {
          }
        });
      });
    } else {
      if (arr[2] === undefined) {
        this.setState({
          province: arr[0],
          city: arr[1],
          area: '',
          school: '',
        }, function () {
          this.props.form.validateFields({ force: true }, (error) => {
            if (!error) {
              getrespersoninfo([
                this.state.province,
                this.state.city,
                this.state.area,
                this.state.school,
              ]).then(res => {
                if (res.data && res.data.status === 1) {
                  if (res.data.resPerson.repairInfo[0] === undefined) {
                    this.setState({
                      repairname: '',
                      repairphone: '',
                      repairemail: '',
                      organization: '',
                    });
                  } else {
                    this.setState({
                      repairname: res.data.resPerson.repairInfo[0].name,
                      repairphone: res.data.resPerson.repairInfo[0].phone,
                      repairemail: res.data.resPerson.repairInfo[0].email,
                      organization: res.data.resPerson.repairInfo[0].organization,
                    });
                  }
                  if (res.data.resPerson.alertInfo[0] === undefined) {
                    this.setState({
                      alertname: '',
                      alertphone: '',
                      alertemail: '',
                      alertorganization: '',
                    });
                  } else {
                    this.setState({
                      alertname: res.data.resPerson.alertInfo[0].name,
                      alertphone: res.data.resPerson.alertInfo[0].phone,
                      alertemail: res.data.resPerson.alertInfo[0].email,
                      alertorganization: res.data.resPerson.alertInfo[0].organization,
                    });
                  }
                } else if (res.data && res.data.status === 0) {
                  message.error("鉴权失败，需要用户重新登录");
                } else if (res.data && res.data.status === 2) {
                  message.error("参数提取失败");
                } else if (res.data && res.data.status === 3) {
                  message.error("服务器故障，请刷新再试");
                }
              });
            } else {
            }
          });
        });
      } else {
        if (arr[3] === undefined) {
          this.setState({
            province: arr[0],
            city: arr[1],
            area: arr[2],
            school: '',
          }, function () {
            this.props.form.validateFields({ force: true }, (error) => {
              if (!error) {
                getrespersoninfo([
                  this.state.province,
                  this.state.city,
                  this.state.area,
                  this.state.school,
                ]).then(res => {
                  if (res.data && res.data.status === 1) {
                    if (res.data.resPerson.repairInfo[0] === undefined) {
                      this.setState({
                        repairname: '',
                        repairphone: '',
                        repairemail: '',
                        organization: '',
                      });
                    } else {
                      this.setState({
                        repairname: res.data.resPerson.repairInfo[0].name,
                        repairphone: res.data.resPerson.repairInfo[0].phone,
                        repairemail: res.data.resPerson.repairInfo[0].email,
                        organization: res.data.resPerson.repairInfo[0].organization,
                      });
                    }
                    if (res.data.resPerson.alertInfo[0] === undefined) {
                      this.setState({
                        alertname: '',
                        alertphone: '',
                        alertemail: '',
                        alertorganization: '',
                      });
                    } else {
                      this.setState({
                        alertname: res.data.resPerson.alertInfo[0].name,
                        alertphone: res.data.resPerson.alertInfo[0].phone,
                        alertemail: res.data.resPerson.alertInfo[0].email,
                        alertorganization: res.data.resPerson.alertInfo[0].organization,
                      });
                    }
                  } else if (res.data && res.data.status === 0) {
                    message.error("鉴权失败，需要用户重新登录");
                  } else if (res.data && res.data.status === 2) {
                    message.error("参数提取失败");
                  } else if (res.data && res.data.status === 3) {
                    message.error("服务器故障，请刷新再试");
                  }
                });
              } else {
              }
            });
          });
        } else {
          this.setState({
            province: arr[0],
            city: arr[1],
            area: arr[2],
            school: arr[3],
          }, function () {
            this.props.form.validateFields({ force: true }, (error) => {
              if (!error) {
                getrespersoninfo([
                  this.state.province,
                  this.state.city,
                  this.state.area,
                  this.state.school,
                ]).then(res => {
                  if (res.data && res.data.status === 1) {
                    if (res.data.resPerson.repairInfo[0] === undefined) {
                      this.setState({
                        repairname: '',
                        repairphone: '',
                        repairemail: '',
                        organization: '',
                      });
                    } else {
                      this.setState({
                        repairname: res.data.resPerson.repairInfo[0].name,
                        repairphone: res.data.resPerson.repairInfo[0].phone,
                        repairemail: res.data.resPerson.repairInfo[0].email,
                        organization: res.data.resPerson.repairInfo[0].organization,
                      });
                    }
                    if (res.data.resPerson.alertInfo[0] === undefined) {
                      this.setState({
                        alertname: '',
                        alertphone: '',
                        alertemail: '',
                        alertorganization: '',
                      });
                    } else {
                      this.setState({
                        alertname: res.data.resPerson.alertInfo[0].name,
                        alertphone: res.data.resPerson.alertInfo[0].phone,
                        alertemail: res.data.resPerson.alertInfo[0].email,
                        alertorganization: res.data.resPerson.alertInfo[0].organization,
                      });
                    }
                  } else if (res.data && res.data.status === 0) {
                    message.error("鉴权失败，需要用户重新登录");
                  } else if (res.data && res.data.status === 2) {
                    message.error("参数提取失败");
                  } else if (res.data && res.data.status === 3) {
                    message.error("服务器故障，请刷新再试");
                  }
                });
              } else {
              }
            });
          });
        }
      }

    }

  }

  out = () => {
    localStorage.clear()
    window.location.href = "/login";
  }
  reset = () => {
    window.location.href = "/newadd";
  }
  equipmentsubmit = () => {
    console.log(parseInt(document.getElementsByClassName('deviceId')[0].value))
    let type = document.getElementById('equipmenttype').value;
    let content = document.getElementById('content').value;
    let preAlertThreshold = document.getElementById('preAlertThreshold').value;
    let alertThreshold = document.getElementById('alertThreshold').value;
    let batteryThreshold = 10;
    let filterprovider = document.getElementById('filterprovider').value;
    let filterMaintainer = document.getElementById('filterMaintainer').value;
    let reg = /[^\d]/g;
    for (var i = 0; i < this.state.dataSource.length; i++) {
      this.state.dataSource[i].deviceId = document.getElementsByClassName('deviceId')[i].value;
      this.state.dataSource[i].location = document.getElementsByClassName('locations')[i].value;
      this.state.dataSource[i].initFlow = document.getElementsByClassName('initFlow')[i].value;
      this.state.dataSource[i].province = this.state.province;
      this.state.dataSource[i].city = this.state.city;
      this.state.dataSource[i].county = this.state.area;
      this.state.dataSource[i].school = this.state.school;
      this.state.dataSource[i].filterprovider = filterprovider;
      this.state.dataSource[i].filterMaintainer = filterMaintainer;
      this.state.dataSource[i].type = type;
      this.state.dataSource[i].content = content;
      this.state.dataSource[i].preAlertThreshold = preAlertThreshold;
      this.state.dataSource[i].alertThreshold = alertThreshold;
      this.state.dataSource[i].batteryThreshold = batteryThreshold;
      if (parseInt(preAlertThreshold) === parseFloat(preAlertThreshold)) {
        this.state.dataSource[i].preAlertThreshold = preAlertThreshold + ".0"
      }
      if (parseInt(alertThreshold) === parseFloat(alertThreshold)) {
        this.state.dataSource[i].alertThreshold = alertThreshold + ".0"
      }
      if (parseInt(batteryThreshold) === parseFloat(batteryThreshold)) {
        this.state.dataSource[i].batteryThreshold = batteryThreshold + ".0"
      }
      if (parseInt(document.getElementsByClassName('initFlow')[i].value) === parseFloat(document.getElementsByClassName('initFlow')[i].value)) {
        this.state.dataSource[i].initFlow = document.getElementsByClassName('initFlow')[i].value + ".0"
      }
      if (type === "") {
        message.error('请输入设备型号')
      } else if (filterprovider === "") {
        message.error('请输入滤芯供应商')
      } else if (filterMaintainer === "") {
        message.error('请输入滤芯维护服务商')
      }
      else if (preAlertThreshold === "") {
        message.error('请输入流量预报警值')
      } else if (alertThreshold === "") {
        message.error('请输入流量报警值')
      } else if (this.state.dataSource[i].location === "") {
        message.error('请输入具体的安装地址')
      } else if (this.state.dataSource[i].initFlow === "") {
        message.error('请输入初始流量')
      } else if (!reg.test(parseInt(document.getElementsByClassName('deviceId')[i].value)) && document.getElementsByClassName('deviceId')[i].value.length != 8) {
        message.error("请输入8位的纯数字编号")
      } else {
        this.props.form.validateFields({ force: true }, (error) => {
          if (!error) {
            equipmentadd(
              JSON.stringify(this.state.dataSource),
            ).then(res => {
              if (res.data && res.data.status === 1) {
                message.success("设备添加成功");
                window.location.href = "/management/management";
              } else if (res.data && res.data.status === 0) {
                message.error("鉴权失败，需要用户重新登录");
              } else if (res.data && res.data.status === 2) {
                message.error("参数提取失败");
              } else if (res.data && res.data.status === 3) {
                message.error("服务器故障，请刷新再试");
              }
            });
          } else {
            message.error("接口获取失败");
          }
        });
      }
    }

  }
  render() {
    const options = JSON.parse(localStorage.getItem('cascadedlocation'))
    const { dataSource } = this.state;
    const columns = this.columns;
    const judgeRenderDataV = () => {
      return localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER || localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER
    }
    return (
      <div id="newaddbody" >
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <div className="logo" />
            <div className="Lowalar-left">
              <Menu
                defaultSelectedKeys={['4']}
                defaultOpenKeys={['sub2']}
                mode="inline"
                theme="dark"
                inlineCollapsed={this.state.collapsed}
              >
                {
                  judgeRenderDataV() ? (
                    <div className="homepage" style={{ display: this.state.display10 }}>
                      <a href="http://datav.aliyun.com/share/d7d63263d774de3d38697367e3fbbdf7"
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
                  <Menu.Item key="10" style={{ display: this.state.display10 }}><Link to="/equipmentlog">设备日志查询</Link></Menu.Item>
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
              设备管理 / 设备管理 / 新增设备
        </div>
            <div className="tit">
              新增设备
        </div>
            <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280, marginTop: '10px' }}>
              <div className="current">
                <div className="curr">
                  <div className="current_text">
                    <div className='addinput'>
                      本批设备所属单位：<Cascader
                        value={[this.state.province, this.state.city, this.state.area, this.state.school]}
                        changeOnSelect options={options} onChange={this.onChange}
                        style={{ display: 'inline-block', width: '60%', textAlign: 'left' }}
                      />
                    </div>
                    <div className='addinput'>
                      &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本批设备型号：<Input placeholder="美的净水器V2018" style={{ width: '60%' }} id="equipmenttype" />
                    </div>
                    <div className='addinput'>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本批设备备注：<Input placeholder="本批设备寿命年限为3年" style={{ width: '60%' }} id="content" />
                    </div>
                    <div className='addinput'>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;滤芯供应商：<Input placeholder="请输入滤芯供应商" style={{ width: '60%' }} id="filterprovider" />
                    </div>
                    <div className='addinput'>
                      &nbsp;&nbsp;&nbsp;滤芯维护服务商：<Input placeholder="请输入滤芯维护服务商" style={{ width: '60%' }} id="filterMaintainer" />
                    </div>
                    <div className='bjz'>
                      <Row gutter={16}>
                        <Col className="gutter-row" span={12}>
                          <div className="gutter-box"  >
                            流量预报警值:<Input placeholder="20" style={{ width: '50%', marginLeft: '10px' }} id="preAlertThreshold"  addonAfter="t"/>
                          </div>
                        </Col>
                        <Col className="gutter-row" span={12}>
                          <div className="gutter-box">
                            流量报警值:<Input placeholder="25" style={{ width: '50%', marginLeft: '10px' }} id="alertThreshold"  addonAfter="t"/>
                          </div>
                        </Col>
                        {/* <Col className="gutter-row" span={8}>
                          <div className="gutter-box">
                            电池电量报警值:<Input placeholder="3Ah" style={{ width: '40%', marginLeft: '10px' }} id="batteryThreshold" />
                          </div>
                        </Col> */}
                      </Row>
                    </div>
                    <div className='number'>
                      <Table dataSource={dataSource} columns={columns} pagination={false} />
                      <span onClick={this.handleAdd} className="numadd" style={{ color: '#1890FF' }}>新增</span>
                    </div>
                    <div className="inform" >
                      <p>报警通知:<span style={{ display: 'inline-block', width: '60px', textAlign: 'center' }}>{this.state.alertname}</span>
                        <span style={{ display: 'inline-block', paddingLeft: '10px', paddingRight: '10px' }}>{this.state.alertphone} </span>
                        <span style={{ display: 'inline-block', paddingLeft: '10px', paddingRight: '10px' }}>{this.state.alertorganization} </span>
                        <span style={{ display: 'inline-block', paddingLeft: '10px', paddingRight: '10px' }}>{this.state.alertemail} </span></p>
                      <p>维修通知:<span style={{ display: 'inline-block', width: '60px', textAlign: 'center' }}>{this.state.repairname}</span>
                        <span style={{ display: 'inline-block', paddingLeft: '10px', paddingRight: '10px' }}>{this.state.repairphone} </span>
                        <span style={{ display: 'inline-block', paddingLeft: '10px', paddingRight: '10px' }}>{this.state.organization} </span>
                        <span style={{ display: 'inline-block', paddingLeft: '10px', paddingRight: '10px' }}>{this.state.repairemail} </span>
                      </p>
                    </div>
                    <div className="btn">
                      <Button type="primary" style={{ marginRight: '20px' }} onClick={this.equipmentsubmit}>提交</Button>
                      <Button onClick={this.reset}>重置</Button>
                    </div>
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

export default newadd = createForm()(newadd);

