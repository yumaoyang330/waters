import React, { Component } from 'react';
import { Icon, Button, Cascader, Select, DatePicker, Table, Menu, Input, Layout, Row, Col, Popconfirm, Modal, message } from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import moment from 'moment';
import { processget, deleterecord, gets } from '../axios';
import './process.css';
import adminTypeConst from '../config/adminTypeConst';
import Headers from '../header';



var now = new Date();
var date = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
var hour = date.getHours();
var minute = date.getMinutes();
var second = date.getSeconds();


var date1 = new Date();
var year1 = date1.getFullYear();
var month1 = date1.getMonth() + 1;
var day1 = date1.getDate();
var hour1 = date1.getHours();
var minute1 = date1.getMinutes();
var second1 = date1.getSeconds();


const myDate = new Date();
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD HH:mm:ss';
const dataSource = [];
for (let i = 0; i < 1; i++) {
  dataSource.push({
    key: i,
    flow: i,
    equipment: `行政楼${i}楼饮水点`,
    age: '张三',
    liuliang: `${i}`,
    address: `London ${i}`,
    status: '正在处理',
    time: '2天05小时'
  });
}
function onChange(date, dateString) {
  console.log(date, dateString);
}
class processbody extends Component {
  state = { visible: false }
  showModal = (key) => {
    console.log(key)
    for (var i = 0; i < this.state.dataSource.length; i++) {
      if (this.state.dataSource[i].key === key) {
        this.setState({
          visible: true,
          organization: this.state.dataSource[i].resPerson.organization,
          phone: this.state.dataSource[i].resPerson.phone,
          name: this.state.dataSource[i].resPerson.name,
          email: this.state.dataSource[i].resPerson.email,
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
  out = () => {
    localStorage.clear()
    window.location.href = "/login";
  }
  constructor(props) {
    super(props);
    this.columns = [{
      title: '设备编号',
      dataIndex: 'deviceId',
    }, {
      title: '所属单位',
      dataIndex: 'deviceBelongs',
    }, {
      title: '设备位置',
      dataIndex: 'deviceLocation',
    }, {
      title: '责任人',
      dataIndex: 'resPerson.name',
    }, {
      title: '联系方式',
      dataIndex: '',
      key: 'x',
      render: (text, record, index) => <div>
        <a onClick={() => this.showModal(record.key)}
        >详情</a>
        <Modal
          title="联系方式"
          // maskStyle={{background:"black",opacity:'0.1'}}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          mask={false}
        >
          <p>姓名:&nbsp;&nbsp;{this.state.name}</p>
          <p>电话:&nbsp;&nbsp;{this.state.phone}</p>
          <p>邮箱:&nbsp;&nbsp;{this.state.email}</p>
          <p>地址:&nbsp;&nbsp;{this.state.organization}</p>
        </Modal>
      </div>
    }, {
      title: '报警时间',
      dataIndex: 'alertBeginTime',
    }, {
      title: '解决时间',
      dataIndex: 'aldertEndTime',
    }, {
      title: '处理时长',
      dataIndex: 'handleTime',
    }];
    this.state = {
      num: '',
      collapsed: false,
      size: 'small',
      selectedRowKeys: [],
      time: year1 + '-' + month1 + '-' + day1 + ' ' + hour1 + ':' + minute1 + ':' + second1,
      endtime: year1 + '-' + month1 + '-' + day1 + ' ' + hour1 + ':' + minute1 + ':' + second1,
      dataSource: dataSource,
      province: '',
      begintime: year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second,
      city: '',
      area: '',
      school: '',
      count: 2,
      keylist: "",
    };
  }

  componentWillMount = () => {
    document.title = "流程查询";

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


            this.props.form.validateFields({ force: true }, (error) => {
              if (!error) {
                processget([
                  this.state.begintime,
                  this.state.endtime,
                  this.state.province,
                  this.state.city,
                  this.state.area,
                  this.state.school,
                  '',
                ]).then(res => {
                  if (res.data && res.data.status === 1) {
                    console.log(res.data)
                    this.setState({
                      dataSource: res.data.processList,
                      num: res.data.processList.length,
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
                message.error("接口获取失败");
              }
            });

          } else {
            message.error("获取信息失败");
          }
        });
      } else {
        message.error("接口获取失败");
      }
    });
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({
      selectedRowKeys,
      keylist: selectedRowKeys,
    });
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

  timeonChange = (value, dateString) => {
    this.setState({
      begintime: dateString[0],
      endtime: dateString[1],
    });
  }



  processbtn = () => {
    const dqbh = document.getElementById('imei').value;
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        processget([
          this.state.begintime,
          this.state.endtime,
          this.state.province,
          this.state.city,
          this.state.area,
          this.state.school,
          dqbh,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
            console.log(res.data)
            this.setState({
              dataSource: res.data.processList,
              num: res.data.processList.length,
            });
          } else {
            message.error("获取信息失败");
          }
        });
      } else {
        message.error("接口获取失败");
      }
    });
  }

  render() {

    const options = JSON.parse(localStorage.getItem('cascadedlocation'))

    const judgeRenderDataV = () => {
      return localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER || localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER
    }

    const { dataSource } = this.state;
    const columns = this.columns;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div id="processbody" >
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <div className="logo" />
            <div className="Lowalar-left">
              <Menu
                defaultSelectedKeys={['5']}
                defaultOpenKeys={['sub3']}
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
              <Button type="primary" onClick={this.toggle} style={{ marginLeft: "16px", float: 'left', marginTop: '15px' }}>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                />
              </Button>
              <Headers />
            </Header>
            <div className="nav">
              查询管理 / 流程查询
          </div>
            <div className="tit">
              流程查询
          </div>
            <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280, marginTop: '10px' }}>
              <div className="current">
                <div className="curr">
                  <div className="current_text">
                    <div className="current_textt">
                      位置选择:<Cascader value={[this.state.province, this.state.city, this.state.area, this.state.school,]} options={options} onChange={this.onChange} changeOnSelect style={{ marginLeft: '20px' }} />
                    </div>
                    <div className="current-time">
                      时间选择:
                              <RangePicker
                        style={{ marginLeft: '20px', marginRight: '20px' }}
                        defaultValue={[moment(this.state.begintime, dateFormat), moment(this.state.time, dateFormat)]}
                        format={dateFormat}
                        ranges={{ 今天: [moment().startOf('day'), moment().endOf('day')], '本月': [moment().startOf('month'), moment().endOf('month')] }}
                        onChange={this.timeonChange}
                      />
                      设备编号:<Input placeholder="请输入设备编号" style={{ width: '10%', marginLeft: '10px' }} id="imei" />
                      <div style={{ float: "right" }}>
                        <Button type="primary" style={{ marginRight: '20px' }} onClick={this.processbtn}>查询</Button>
                        <Button>重置</Button>
                      </div>
                    </div>
                    <div className="derive">
                      <Icon type="info-circle-o" />
                      &nbsp; &nbsp;已选择<span style={{ marginLeft: 8, color: 'rgba(0, 51, 255, 0.647058823529412)', fontWeight: 'bold' }}>
                        {hasSelected ? `   ${selectedRowKeys.length}  ` : ''}
                      </span>条记录
                          列表记录总计： <span style={{ color: 'rgba(0, 51, 255, 0.647058823529412)', fontWeight: 'bold' }}>{this.state.num}</span> 条
                      {/* <Button type="primary" style={{ float: 'right', marginTop: '3px' }}>数据导出</Button> */}
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource} onSelect={this.onSelect} />
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

export default processbody = createForm()(processbody);

