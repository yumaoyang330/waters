import React, { Component } from 'react';
import { Icon, Button, Select, Table, Menu, Layout, Popconfirm, Cascader, Modal, DatePicker, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import moment from 'moment';
import './journal.css';
import { deletes, querylogs, gets } from '../axios';
import adminTypeConst from '../config/adminTypeConst';

import typetext from './../type'
import typenum from './../types'



var now = new Date();
var date = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
var hour = date.getHours();
var minute = date.getMinutes();
var second = date.getSeconds();


var time = new Date();
var year1 = time.getFullYear();
var month1 = time.getMonth() + 1;
var day1 = time.getDate();
var hour1 = time.getHours();
var minute1 = time.getMinutes();
var second1 = time.getSeconds();


const myDate = new Date();

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD HH:mm:ss';
const accounttype = ["不限", '单位管理员', '单位滤芯维护人员', '区级管理员', '超级管理员'];
const dataSource = [];
for (let i = 0; i < 1; i++) {
  dataSource.push({
    key: i,
    flow: i,
    equipment: `行政楼${i}楼饮水点`,
    age: '张三',
    liuliang: `${i}`,
    address: `London ${i}`,
    status: '正在处理'
  });
}
const judgeRenderDataV = () => {
  return localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER || localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER
}
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;
class journal extends React.Component {

  state = { visible: false }
  showModal = (key) => {
    for (var i = 0; i < this.state.dataSource.length; i++) {
      if (this.state.dataSource[i].key === key) {
        this.setState({
          visible: true,
          phone: this.state.dataSource[i].resPerson.phone,
          name: this.state.dataSource[i].resPerson.name,
          email: this.state.dataSource[i].resPerson.email,
          organization: this.state.dataSource[i].resPerson.organization,
          content: this.state.dataSource[i].resPerson.content,
        });
      }
    }
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  constructor(props) {
    super(props);
    this.columns = [{
      title: '用户类别',
      dataIndex: 'userType',
      width: '10%'
    }, {
      title: '用户名',
      dataIndex: 'username',
      width: '8%'
    }, {
      title: '用户详情',
      dataIndex: '',
      width: '5%',
      render: (text, record, index) =>
        <div>
          <a onClick={() => this.showModal(record.key)}
          >详情</a>
          <Modal
            title="联系方式"
            // maskStyle={{ background: "black", opacity: '0.1' }}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            mask={false}
          >
            <p>姓名:{this.state.name}</p>
            <p>电话:{this.state.phone}</p>
            <p>邮箱:{this.state.email}</p>
            <p>地址:{this.state.organization}</p>
            <p>备注:{this.state.content}</p>
          </Modal>
        </div>
    }, {
      title: '日志内容',
      dataIndex: 'logContent',
    }, {
      title: '日志时间',
      dataIndex: 'gmtCreate',
      width: '10%'
    }]

    // {
    //   title: '操作',
    //   dataIndex: 'operation',
    //   render: (text, record) => {
    //     return (
    //       dataSource.length > 1 ?
    //         (
    //           <Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(record.key)}>
    //             <a href="javascript:;">删除</a>
    //           </Popconfirm>
    //         ) : null
    //     );
    //   },
    // };
    this.state = {
      num: '',
      collapsed: false,
      size: 'small',
      time: myDate,
      begintime: year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second,
      endtime: year1 + '-' + month1 + '-' + day1 + ' ' + hour1 + ':' + minute1 + ':' + second1,
      selectedRowKeys: [],
      dataSource: dataSource,
      typetext: typetext[0],
      province: "",
      typenum: "0",
      city: '',
      area: '',
      school: '',
      count: 2,
    };
  }


  componentWillMount = () => {

    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        gets([
          localStorage.getItem('token'),
        ]).then(res => {
          if (localStorage.getItem('token') === null) {
            window.location.href = "/login";
          }
          if (res.data && res.data.status === 1) {
            this.setState({
              province: res.data.cascadedlocation[0].value,
              city: res.data.cascadedlocation[0].children[0].value,
              area: res.data.cascadedlocation[0].children[0].children[0].value,
              school: res.data.cascadedlocation[0].children[0].children[0].children[0].value,
            });
            if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER) {
              this.setState({
                city: '',
                area: '',
                school: '',
              });
            }
            if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER) {
              this.setState({
                school: '',
              });
            }

            if (!error) {
              console.log(this.state.time)
              querylogs([
                this.state.begintime,
                this.state.endtime,
                this.state.province,
                '',
                this.state.typenum,
                this.state.city,
                this.state.area,
                this.state.school,
              ]).then(res => {
                if (res.data && res.data.status === 1) {
                  console.log(res.data.logList)
                  for (var i = 0; i < res.data.logList.length; i++) {
                    if (res.data.logList[i].userType === 8) {
                      res.data.logList[i].userType = "超级管理员"
                    }
                    if (res.data.logList[i].userType === 1) {
                      res.data.logList[i].userType = "单位管理员"
                    }
                    if (res.data.logList[i].userType === 2) {
                      res.data.logList[i].userType = "单位滤芯维护人员"
                    }
                    if (res.data.logList[i].userType === 3) {
                      res.data.logList[i].userType = "区级管理员"
                    }
                  }
                  this.setState({
                    dataSource: res.data.logList,
                    num: res.data.logList.length,
                  });
                } else if (res.data && res.data.status === 0) {
                  message.error("鉴权失败，需要用户重新登录");
                } else if (res.data && res.data.status === 2) {
                  message.error("参数提取失败");
                } else if (res.data && res.data.status === 3) {
                  message.error("服务器故障，请刷新再试");
                }
              });
            } else {
              message.error("获取接口失败");
            }




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
    document.title = "操作日志查询";
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
      });
    } else {
      if (arr[2] === undefined) {
        this.setState({
          province: arr[0],
          city: arr[1],
          area: '',
          school: '',
        });
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
        }
      }
    }
  }

  usersChange = (date, dateString) => {
    this.setState({
      typenum: typenum[date],
      typetext: date,
    });
  }
  timeonChange = (value, dateString) => {
    this.setState({
      begintime: dateString[0],
      endtime: dateString[1],
    });
  }
  out = () => {
    localStorage.clear()
    window.location.href = "/login/login";
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  // onDelete = (key) => {
  //   this.props.form.validateFields({ force: true }, (error) => {
  //     if (!error) {
  //       deletes([
  //         key
  //       ]).then(res => {
  //         if (res.data && res.data.status === 1) {
  //           alert("提交信息成功");
  //           console.log(dataSource)
  //           const dataSource = [...this.state.dataSource];
  //           this.setState({
  //             num: this.state.num - 1,
  //             dataSource: dataSource.filter(item => item.key !== key)
  //           });
  //         } else if (res.data && res.data.status === 0) {
  //           alert("鉴权失败，需要用户重新登录");
  //         } else if (res.data && res.data.status === 2) {
  //           alert("参数提取失败");
  //         } else if (res.data && res.data.status === 3) {
  //           alert("服务器故障，请刷新再试");
  //         }
  //       });
  //     } else {
  //       console.log("请填好所有选项");
  //     }
  //   });
  // }

  querylog = (key) => {
    var user = document.getElementById('user').value;
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER) {
          this.setState({
            school: '',
          });
        }
        querylogs([
          this.state.begintime,
          this.state.endtime,
          this.state.province,
          user,
          this.state.typenum,
          this.state.city,
          this.state.area,
          this.state.school,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
            for (var i = 0; i < res.data.logList.length; i++) {
              if (res.data.logList[i].userType === 8) {
                res.data.logList[i].userType = "超级管理员"
              }
              if (res.data.logList[i].userType === 1) {
                res.data.logList[i].userType = "单位管理员"
              }
              if (res.data.logList[i].userType === 2) {
                res.data.logList[i].userType = "单位滤芯维护人员"
              }
              if (res.data.logList[i].userType === 3) {
                res.data.logList[i].userType = "区级管理员"
              }
            }
            this.setState({
              dataSource: res.data.logList,
              num: res.data.logList.length,
            });

          } else if (res.data && res.data.status === 0) {
            message.error("鉴权失败，需要用户重新登录");
          } else if (res.data && res.data.status === 2) {
            message.error("参数提取失败");
          } else if (res.data && res.data.status === 3) {
            message.error("服务器故障，请刷新再试");
          }
        });
      } else {
        message.error("获取接口失败");
      }
    });
  }
  render() {
    const equipmentlook = () => {
      return localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER
    }
    const schoollook = () => {
      return localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_SCHOOL_MANAGER
    }
    const options = JSON.parse(localStorage.getItem('cascadedlocation'))

    const { dataSource } = this.state;
    const columns = this.columns;
    const { selectedRowKeys } = this.state;
    const provinceOptions = accounttype.map(province => <Option key={province}>{province}</Option>);
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div id="journalbody" >
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <div className="logo" />
            <div className="Lowalar-left">
              <Menu
                defaultSelectedKeys={['8']}
                defaultOpenKeys={['sub4']}
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
                {
                  equipmentlook() ? (
                    <SubMenu key="sub4" title={<span><Icon type="warning" /><span>系统管理</span></span>}>
                      <Menu.Item key="6" style={{ display: this.state.display6 }}><Link to="/school">单位管理</Link></Menu.Item>
                      <Menu.Item key="7" style={{ display: this.state.display7 }}><Link to="/contact">区域联系人管理</Link></Menu.Item>
                      <Menu.Item key="8" style={{ display: this.state.display8 }}><Link to="/journal">操作日志查询</Link></Menu.Item>
                    </SubMenu>
                  ) : schoollook() ? (
                      <SubMenu key="sub4" title={<span><Icon type="warning" /><span>系统管理</span></span>}>
                        <Menu.Item key="7" style={{ display: this.state.display7 }}><Link to="/contact">区域联系人管理</Link></Menu.Item>
                        <Menu.Item key="8" style={{ display: this.state.display8 }}><Link to="/journal">操作日志查询</Link></Menu.Item>
                      </SubMenu>):(
                      <SubMenu key="sub4" title={<span><Icon type="warning" /><span>系统管理</span></span>}>
                      <Menu.Item key="6" style={{ display: this.state.display6 }}><Link to="/school">单位管理</Link></Menu.Item>
                      <Menu.Item key="7" style={{ display: this.state.display7 }}><Link to="/contact">区域联系人管理</Link></Menu.Item>
                      <Menu.Item key="8" style={{ display: this.state.display8 }}><Link to="/journal">操作日志查询</Link></Menu.Item>
                      <Menu.Item key="9" style={{ display: this.state.display9 }}><Link to="/highset">高级设置</Link></Menu.Item>
                    </SubMenu>                        
                      )
                }
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
              账号管理 / 操作日志查询
          </div>
            <div className="tit">
              操作日志查询
          </div>
            <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280, marginTop: '10px' }}>
              <div className="current">
                <div className="curr">
                  <div className="current_text">
                    <div className="current_textt">
                      位置选择:<Cascader value={[this.state.province, this.state.city, this.state.area, this.state.school,]} options={options} onChange={this.onChange} changeOnSelect style={{ marginLeft: '20px' }} />
                      <Button type="primary" style={{ marginRight: '10px', marginLeft: '20px' }} onClick={this.querylog}>查询</Button>
                      <Button>重置</Button>
                    </div>
                    <div className="current-time">
                      时间选择:
                       <RangePicker
                        style={{ marginLeft: '20px', marginRight: '20px' }}
                        defaultValue={[moment(this.state.begintime, dateFormat), moment(this.state.endtime, dateFormat)]}
                        format={dateFormat}
                        ranges={{ 今天: [moment().startOf('day'), moment().endOf('day')], '本月': [moment().startOf('month'), moment().endOf('month')] }}
                        onChange={this.timeonChange}
                      />
                      用户名:<Input placeholder="请输入用户名" style={{ width: '10%', marginLeft: '10px', marginRight: '10px' }} id="user" />
                      用户类别:  <Select value={this.state.typetext} onChange={this.usersChange} style={{ width: '20%' }}>
                        {provinceOptions}
                      </Select>
                    </div>
                    <div className="derive">
                      <Icon type="info-circle-o" />
                      &nbsp; &nbsp;已加载<span style={{ marginLeft: 8, color: 'rgba(0, 51, 255, 0.647058823529412)', fontWeight: 'bold' }}>
                        {hasSelected ? `   ${selectedRowKeys.length}  ` : ''}
                      </span>条记录
                                列表记录总计： <span style={{ color: 'rgba(0, 51, 255, 0.647058823529412)', fontWeight: 'bold' }}>{this.state.num}</span> 条
                            {/* <Button type="primary" style={{ float: 'right', marginTop: '3px' }}>数据导出</Button> */}
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <Table dataSource={dataSource} columns={columns}
                        rowSelection={rowSelection} />
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
export default journal = createForm()(journal);

