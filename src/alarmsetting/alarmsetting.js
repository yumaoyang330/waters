import React, { Component } from 'react';
import { Icon, Button, Select, Table, Menu, Input, Layout, Cascader, Popconfirm, InputNumber, Form, Modal, message } from 'antd';
import { Link } from 'react-router-dom';
import { updatealarm, querydevicelists, gets } from '../axios';
import { createForm } from 'rc-form';
import './alarmsetting.css';
import adminTypeConst from '../config/adminTypeConst';

const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const data = [];
const number = 0;
for (let i = 0; i < number; i++) {
  data.push({
    key: i,
    preAlertThreshold: i,
    location: `行政楼${i}楼饮水点`,
    age: '张三',
    alertThreshold: `${i}`,
    address: `London ${i}`,
    status: '正在处理'
  });
}



const FormItem = Form.Item;
function onChange(date, dateString) {
  console.log(date, dateString);

}
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };
  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
class alarmsetting extends Component {
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
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      size: 'small',
      selectedRowKeys: [],
      data: data,
      editingKey: '',
      num: number,
      alertThreshold: '',
      preAlertThreshold: '',
      province: '',
      city: '',
      area: '',
      school: '',
      display1: '',
      display2: '',
      display3: '',
      display4: '',
      display5: '',
      display6: '',
      display7: '',
      display8: '',
      display9: '',
    };
    this.columns = [{
      title: '所属单位',
      dataIndex: 'siteName',
    },{
      title: '设备位置',
      dataIndex: 'location',
    }, {
      title: '预报警域值',
      dataIndex: 'preAlertThreshold',
      editable: true,
    }, {
      title: '报警域值',
      dataIndex: 'alertThreshold',
      editable: true,
    }, {
      title: '责任人',
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
      title: '操作',
      dataIndex: 'operation',
      width: '15%',
      render: (text, record) => {
        const editable = this.isEditing(record);

        return (
          <div>

            {editable ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    <a
                      href="javascript:;"
                      onClick={() => this.save(form, record.key)}
                      style={{ marginRight: 8 }}
                    >
                      保存
                      </a>
                  )}
                </EditableContext.Consumer>
                <Popconfirm
                  title="确认要取消吗?"
                  onConfirm={() => this.cancel(record.key)}
                >
                  <a>取消</a>
                </Popconfirm>
              </span>
            ) : (
                <a onClick={() => this.edit(record.key)}>编辑</a>
              )}
          </div>
        );
      }
    },
    ];
  }
  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };
  edit(key) {
    this.setState({
      editingKey: key
    });
  }

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({
          data: newData, editingKey: '',
          preAlertThreshold: newData[index].preAlertThreshold,
          alertThreshold: newData[index].alertThreshold,
        }, () => {
          this.props.form.validateFields({ force: true }, (error) => {
            if (!error) {
              updatealarm([
                key,
                this.state.preAlertThreshold,
                this.state.alertThreshold,
              ]).then(res => {
                if (res.data && res.data.status === 1) {
                  if (res.data.updateResult === 1) {
                    message.success("信息编辑成功");
                  } else {
                    message.error("信息编辑失败");
                  }
                } else {
                  message.error("加载失败");
                }
              });
            } else {
              message.error("请填好所有选项");
            }
          });

        });
      } else {
        newData.push(data);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };

  componentWillMount = () => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        gets([
          localStorage.getItem('token'),
        ]).then(res => {
          if (res.data && res.data.status === 1) {
            this.setState({
              province: res.data.cascadedlocation[0].value,
              city: res.data.cascadedlocation[0].children[0].value,
              area: res.data.cascadedlocation[0].children[0].children[0].value,
              school: res.data.cascadedlocation[0].children[0].children[0].children[0].value,
            });

            if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER){
              this.setState({
                city:'',
                area:'',
                school:'',
              });
            }
            if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER){
              this.setState({
                school:'',
              });
            }
            this.props.form.validateFields({ force: true }, (error) => {
              if (!error) {
                querydevicelists([
                  this.state.province,
                  this.state.city,
                  this.state.area,
                  this.state.school,
                  ""
                ]).then(res => {
                  if (res.data && res.data.status === 1) {
                    console.log(res.data.deviceList[0])
                    this.setState({
                      data: res.data.deviceList,
                      num: res.data.deviceList.length,
                    });


                    if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_SCHOOL_MANAGER) {
                      this.setState({
                        display2: 'none',
                        display6: 'none',
                        display9: 'none',
                        display10: 'none',
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
          } else {
            message.error("获取信息失败");
          }
        });
      } else {
        message.error("获取接口失败");

      }
    });
    document.title = "流量报警设置";
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

  out = () => {
    localStorage.clear()
    window.location.href = "/login";
  }
  querybtn = () => {
    const imei = document.getElementById('imei').value;
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        querydevicelists([
          this.state.province,
          this.state.city,
          this.state.area,
          this.state.school,
          imei,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
            console.log(res.data.deviceList[0])
            this.setState({
              data: res.data.deviceList,
              num: res.data.deviceList.length,
            });
          } else {
            message.error("获取信息失败");
          }
        });
      } else {
        message.error("获取接口失败");
      }
    });
  }

  render() {

    const options = JSON.parse(localStorage.getItem('cascadedlocation'))



    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const judgeRenderDataV = () => {
      return localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER || localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER
    }
    const hasSelected = selectedRowKeys.length > 0;
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
      <div id="alarmsettingbody" >
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <div className="logo" />
            <div className="Lowalar-left">
              <Menu
                defaultSelectedKeys={['2']}
                defaultOpenKeys={['sub1']}
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
                  <Menu.Item key="1" className="navbar1" style={{ display: this.state.display1 }}><Link to="/lowalarm">流量报警</Link></Menu.Item>
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
              流程监控 / 流量报警设置
        </div>
            <div className="tit">
              流量报警设置
        </div>
            <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280, marginTop: '10px' }}>
              <div className="current">
                <div className="curr">
                  <div className="current_text">
                    <div className="current_textt">
                      位置选择:<Cascader defaultValue={['zhejiang', 'hangzhou', 'xihu', 'xuejun']} disabled={this.state.disabled} value={[this.state.province, this.state.city, this.state.area, this.state.school,]} options={options} onChange={this.onChange} changeOnSelect style={{ marginLeft: '20px' }} />
                      设备编号:<Input placeholder="1234567890" style={{ width: '10%', marginLeft: '10px' }} id="imei" />
                      <div style={{ float: "right" }}>
                        <Button type="primary" style={{ marginRight: '20px' }} onClick={this.querybtn} >查询</Button>
                        <Button>重置</Button>
                      </div>
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

export default alarmsetting = createForm()(alarmsetting);

