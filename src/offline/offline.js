import React, { Component } from 'react';
import { Icon, Button, Select, Table, Menu, Input, Layout, Popconfirm, InputNumber, Form, Breadcrumb, Cascader, Modal, message } from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import { userupdate, equipmentget, gets } from '../axios';
import './offline.css';
import adminTypeConst from '../config/adminTypeConst';

import Headers from '../header';


const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const options = [{
  value: 'zhejiang',
  label: '浙江省',
  disabled: 'disabled',
  children: [{
    value: 'hangzhou',
    label: '杭州市',
    children: [{
      value: 'shangcheng',
      label: '上城区',
      children: [{
        value: 'xuejun',
        label: '学军中学',
      }]
    }],
  }],
}, {
  value: 'jiangsu',
  label: '江苏省',
  disabled: 'disabled',
  children: [{
    value: 'nanjing',
    label: '南京市',
    children: [{
      value: 'zhonghuamen',
      label: '中华门',
    }],
  }],
}];

const FormItem = Form.Item;
class devInfo extends Component {
  state = { visible: false }
  showModal = (key) => {
    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].key === key) {
        this.setState({
          visible: true,
          phone: this.state.data[i].resPerson.phone,
          name: this.state.data[i].resPerson.name,
          email: this.state.data[i].resPerson.email,
          organization: this.state.data[i].resPerson.organization,
          content: this.state.data[i].resPerson.content,
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
    this.state = {
      collapsed: false,
      size: 'small',
      selectedRowKeys: [],
      num: '',
      province: '',
      city: '',
      school: "",
      area: '',
      offline: 23,
    };
    this.columns = [{
      title: '设备编号',
      dataIndex: 'deviceId',
    }, {
      title: '设备位置',
      dataIndex: 'location',
    }, {
      title: '状态',
      dataIndex: 'status',
      render: (text, record, index) => {
        if (text === "离线") {
          return (
            <div>
              <span style={{
                display: 'inline-block', width: "10px",
                height: "10px", borderRadius: '50%', background: "red", marginRight: '8px'
              }}></span>
              <span>{text}</span>
            </div>
          )
        }
      }
    }, {
      title: '所属地址',
      dataIndex: 'siteName',
    }, {
      title: '管理员',
      dataIndex: 'resPerson.name',
    }, {
      title: '责任人联系方式',
      dataIndex: '',
      key: 'x',
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
            <p>姓名:&nbsp;&nbsp; {this.state.name}</p>
            <p>电话:&nbsp;&nbsp;  {this.state.phone}</p>
            <p>邮箱:&nbsp;&nbsp;  {this.state.email}</p>
            <p>地址:&nbsp;&nbsp;  {this.state.organization}</p>
            <p>备注:&nbsp;&nbsp;  {this.state.content}</p>
          </Modal>
        </div>
    }, {
      title: '最后连接时刻',
      dataIndex: 'lastConnectTime',
    },

    ];
  }
  equipmentquery = () => {
    let imei = document.getElementById('equipmentimei').value;
    this.props.form.validateFields({ force: true }, (error) => {
      console.log(error);
      if (!error) {
        equipmentget([
          this.state.province,
          this.state.city,
          this.state.area,
          this.state.school,
          imei,
          this.state.offline,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
            console.log(res.data)
            for (var i = 0; i < res.data.deviceList.length; i++) {
              if (res.data.deviceList[i].status === 10) {
                res.data.deviceList[i].status = "在线"
              }
              if (res.data.deviceList[i].status === 23) {
                res.data.deviceList[i].status = "离线"
              }
            }
            this.setState({
              data: res.data.deviceList,
              num: res.data.deviceList.length,
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
        message.error("接口获取失败");
      }
    });
  }
  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };
  edit(key) {
    this.setState({ editingKey: key });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  onChange = (date, dateString) => {
    let arr = [];
    for (var i in dateString) {
      arr.push(dateString[i].label);
    }
    this.setState({
      province: arr[0],
      city: arr[1],
      area: arr[2],
      school: arr[3],
    });
  }



  componentWillMount = () => {
    document.title = "设备离线查询";
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
              equipmentget([
                this.state.province,
                this.state.city,
                this.state.area,
                this.state.school,
                '',
                this.state.offline,
              ]).then(res => {
                if (res.data && res.data.status === 1) {
                  console.log(res.data)
                  for (var i = 0; i < res.data.deviceList.length; i++) {
                    if (res.data.deviceList[i].status === 10) {
                      res.data.deviceList[i].status = "在线"
                    }
                    if (res.data.deviceList[i].status === 23) {
                      res.data.deviceList[i].status = "离线"
                    }
                  }
                  this.setState({
                    data: res.data.deviceList,
                    num: res.data.deviceList.length,
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
              message.error("接口获取失败");
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
        message.error("请填好所有选项");
      }
    });
  }


  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  out = () => {
    localStorage.clear()
    window.location.href = "/login";
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }


  render() {
    const equipmentlook = () => {
      return localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER
    }
    const judgeRenderDataV = () => {
      return localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER || localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER
    }
    const options = JSON.parse(localStorage.getItem('cascadedlocation'))


    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const components = {
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <div id="offlinebody" >
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <div className="logo" />
            <div className="Lowalar-left">
              <Menu
                defaultSelectedKeys={['3']}
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
                {
                  equipmentlook() ? (

                    <SubMenu key="sub2" title={<span><Icon type="edit" /><span>设备管理</span></span>}>
                      <Menu.Item key="10" style={{ display: this.state.display10 }}><Link to="/equipmentlog">设备日志查询</Link></Menu.Item>
                    </SubMenu>
                  ) : (
                      <SubMenu key="sub2" title={<span><Icon type="edit" /><span>设备管理</span></span>}>
                        <Menu.Item key="3" style={{ display: this.state.display3 }}><Link to="/devInfo">设备在线查询</Link></Menu.Item>
                        <Menu.Item key="4" style={{ display: this.state.display4 }}><Link to="/management">设备管理</Link></Menu.Item>
                        <Menu.Item key="10" style={{ display: this.state.display10 }}><Link to="/equipmentlog">设备日志查询</Link></Menu.Item>
                      </SubMenu>)
                }
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
              <Breadcrumb>
                <Breadcrumb.Item>设备管理</Breadcrumb.Item>
                <Breadcrumb.Item><a href="">设备在线查询</a></Breadcrumb.Item>
                <Breadcrumb.Item><a href="">设备离线查看</a></Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className="tit">
              设备离线查看
        </div>
            <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280, marginTop: '10px' }}>
              <div className="current">
                <div className="curr">
                  <div className="current_text">
                    <div className="current_textt">
                      位置选择:<Cascader value={[this.state.province, this.state.city, this.state.area, this.state.school,]} options={options} changeOnSelect onChange={this.onChange} style={{ marginLeft: '20px' }} />
                      <div style={{ float: "right" }}>
                        <Button type="primary" style={{ marginRight: '20px' }} onClick={this.equipmentquery}>查询</Button>
                        <Button>重置</Button>
                      </div>
                    </div>
                    <div style={{ marginTop: '10px', marginBottm: '10px' }}>
                      设备编号:<Input placeholder="请输入设备编号" style={{ width: '15%', marginLeft: '20px' }} id="equipmentimei" />
                    </div>
                    <p style={{ marginTop: '.1rem', fontWeight: 'bold', fontSize: '16px' }}>以下是离线设备列表:</p>
                    <div className="derive">
                      <Icon type="info-circle-o" />
                      &nbsp; &nbsp;已选择<span style={{ marginLeft: 8, color: 'rgba(0, 51, 255, 0.647058823529412)', fontWeight: 'bold' }}>
                        {hasSelected ? `   ${selectedRowKeys.length}  ` : ''}
                      </span>条记录
                                列表记录总计： <span style={{ color: 'rgba(0, 51, 255, 0.647058823529412)', fontWeight: 'bold' }}>{this.state.num}</span> 条
                            {/* <Button type="primary" style={{ float: 'right', marginTop: '3px' }}>数据导出</Button> */}
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      {/* <Table rowSelection={rowSelection} columns={columns} dataSource={data}  /> */}
                      <Table
                        rowSelection={rowSelection}
                        components={components}
                        dataSource={this.state.data}
                        columns={columns}
                        rowClassName="editable-row"

                      />
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

export default devInfo = createForm()(devInfo);


