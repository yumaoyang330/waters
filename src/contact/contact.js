import React, { Component } from 'react';
import { Icon, Button, Select, Table, Menu, Input, Layout, Popconfirm, Cascader, Modal, Form, InputNumber, message } from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import { userupdate, userdelete, conactget, gets } from '../axios';
import './contact.css';
import adminTypeConst from '../config/adminTypeConst';

import typetext from './../type'
import typenum from './../types'

// console.log()
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;




const accounttypes = ['单位管理员', '单位滤芯维护人员', '区级管理员', '超级管理员'];


if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER) {
  var accounttype = ['不限', '单位管理员', '单位滤芯维护人员', '区级管理员', '超级管理员'];
}
if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_SCHOOL_MANAGER) {
  var accounttype = ['不限', '单位管理员', '单位滤芯维护人员'];
}
if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER) {
  var accounttype = ['不限', '区级管理员', '单位管理员', '单位滤芯维护人员'];
}


const FormItem = Form.Item;
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


class contact extends Component {
  state = { visible: false }
  showModal = (key) => {
    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].key === key) {
        this.setState({
          visible: true,
          content: this.state.data[i].detailVO.content,
          organization: this.state.data[i].detailVO.organization,
          name: this.state.data[i].detailVO.name,
        });
      }
    }
  }
  handleOk = (e) => {
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
  typeChange = (date, dateString) => {
    this.setState({
      selecttype: date,
      selectnum: typenum[date],
    });
  }
  out = () => {
    localStorage.clear()
    window.location.href = "/login";
  }
  usersChange = (date, dateString) => {
    this.setState({
      typenum: typenum[date],
      typetext: date,
    });
  }
  contactget = () => {
    let username = document.getElementById('username').value;
    let tel = document.getElementById('tel').value;
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        conactget([
          this.state.province,
          this.state.city,
          this.state.area,
          this.state.school,
          username,
          tel,
          this.state.typenum,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
            this.setState({
              data: res.data.userList,
              num: res.data.userList.length,
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
  constructor(props) {
    const typeOptions = accounttypes.map(type => <Option key={type}>{type}</Option>);
    super(props);
    this.columns = [{
      title: '用户类别',
      dataIndex: 'userType',
      width: '20%',
      render: (text, record, index) => {
        const editable = this.isEditing(record);
        return (
          <div>
            {editable ? (
              <Select defaultValue={typetext[text]} className="one" onChange={this.typeChange} style={{ width: '80%' }} disabled={false} >
                {typeOptions}
              </Select>
            ) : (
                <Select defaultValue={typetext[text]} className="one" onChange={this.typeChange} style={{ width: '80%' }} disabled={true} >
                  {typeOptions}
                </Select>
              )
            }</div>
        )
      }
    },{
      title: '所属单位',
      dataIndex: 'siteName',
    }, {
      title: '用户名',
      dataIndex: 'userName',
      editable: true,
    }, {
      title: '姓名',
      dataIndex: 'realName',
      editable: true,
    }, {
      title: '初始密码',
      dataIndex: 'initPassword',
      editable: true,
    }, {
      title: '联系方式',
      dataIndex: 'phone',
      editable: true,
    }, {
      title: '邮箱',
      dataIndex: 'email',
      editable: true,
    }, {
      title: '详情',
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
            <p>所属单位:{this.state.organization}</p>
            <p>备注:{this.state.content}</p>
          </Modal>
        </div>
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '15%',
      render: (text, record, index) => {
        const editable = this.isEditing(record);
        return (
          <div>
            {editable ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    <a
                      href="javascript:;"
                      onClick={() => this.save(form, record.key, index)}
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
                <a onClick={(index) => this.edit(record.key, index)} disabled={this.state.amend}>修改资料</a>
              )}


            <span style={{ marginLeft: '10px' }}>
              {this.state.data.length > 1 ?
                (
                  <Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(record.key)}>
                    <a href="javascript:;">删除</a>
                  </Popconfirm>
                ) : null}
            </span>
          </div>
        );
      },
    }];
    this.state = {
      num: '',
      collapsed: false,
      size: 'small',
      province: '',
      amend: true,
      city: '',
      area: '',
      school: '',
      data: '',
      selectedRowKeys: [],
      editingKey: '',
      typetext: typetext[localStorage.getItem('type')],
      typenum: localStorage.getItem('type'),
      phoneNumber: '',
      accounttype: '',
      selecttype: "",
      jurisdiction: true,
      selectnum: "",
      userName: '',
      email: '',
      password: "",
      typedisabled: true,
      power: '',
    };
  }


  edit(key, text, record, index) {
    console.log(this.state.data.length)
    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].key === key) {
        document.getElementsByClassName('one')[i].disabled = false;
        console.log(document.getElementsByClassName('one')[i])
        this.setState({
          selecttype: typetext[this.state.data[i].userType],
        });
      }
    }
    this.setState({
      editingKey: key,
      typedisabled: false,
    });
  }
  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };

  save(form, key) {
    this.setState({
      typedisabled: true,
    });
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
          userName: newData[index].userName,
          password: newData[index].initPassword,
          phoneNumber: newData[index].phone,
          email: newData[index].email,
        }, () => {
          console.log(newData[0])
          this.props.form.validateFields({ force: true }, (error) => {
            if (!error) {
              userupdate([
                key,
                this.state.province,
                this.state.city,
                this.state.area,
                this.state.school,
                this.state.userName,
                this.state.password,
                this.state.phoneNumber,
                this.state.email,
                typenum[this.state.selecttype]
              ]).then(res => {
                if (res.data && res.data.status === 1) {
                  message.success("信息编辑成功");
                  this.setState({
                    typedisabled: true,
                  });
                } else {
                  message.error("信息编辑失败");
                  this.setState({
                    typedisabled: true,
                  });
                }
              });
            } else {
              message.error("信息保存失败");
              this.setState({
                typedisabled: true,
              });
            }
          });

        });
      } else {
        newData.push(this.state.data);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }
  cancel = () => {
    this.setState({
      editingKey: '',
      typedisabled: true,
    });
  };
  onDelete = (key) => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        userdelete([
          key,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
            const dataSource = [...this.state.data];
            this.setState({
              num: dataSource.length,
              dataSource: dataSource.filter(item => item.key !== key)
            });
            if (res.data && res.data.deleteResult === 1) {
              message.success('信息删除成功');
              setTimeout(() => {
                window.location.href = "/contact/contact";
              }, 1000);
            }
          } else if (res.data && res.data.status === 0) {
            message.error("鉴权失败，需要用户重新登录");
          } else if (res.data && res.data.status === 2) {
            message.error("参数提取失败");
          } else if (res.data && res.data.status === 3) {
            message.error("服务器故障，请刷新再试");
          } else if (res.data && res.data.status === 4) {
            message.error("用户名已存在");
          }
        });
      } else {
        message.error("获取接口失败");
      }
    });
  }



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


            if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER) {
              this.setState({
                city: '',
                area: '',
                school: '',
                typetext: '不限',
                typenum: '0',
              });
            }
            if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER) {
              this.setState({
                school: '',
                typetext: '不限',
                typenum: '0',
              });
            }
            this.props.form.validateFields({ force: true }, (error) => {
              if (!error) {
                conactget([
                  this.state.province,
                  this.state.city,
                  this.state.area,
                  this.state.school,
                  '',
                  '',
                  this.state.typenum,
                ]).then(res => {
                  if (res.data && res.data.status === 1) {
                    this.setState({
                      data: res.data.userList,
                      num: res.data.userList.length,
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
              });
            }
            if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER) {
              this.setState({
                disabled: false,
                amend: false,
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


    document.title = "区域联系人管理";
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

  render() {

    const options = JSON.parse(localStorage.getItem('cascadedlocation'))

    const judgeRenderDataV = () => {
      return localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER || localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER
    }
    const provinceOptions = accounttype.map(province => <Option key={province}>{province}</Option>);
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const hasSelected = selectedRowKeys.length > 0;
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          // inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (

      <div id="contactbody" >
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <div className="logo" />
            <div className="Lowalar-left">
              <Menu
                defaultSelectedKeys={['7']}
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
              账号管理 / 区域联系人管理
          </div>
            <div className="tit">
              区域联系人管理
          </div>
            <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280, marginTop: '10px' }}>
              <div className="current">
                <div className="curr">
                  <div className="current_text">
                    <div className="current_textt">
                      位置选择:<Cascader defaultValue={['zhejiang', 'hangzhou', 'xihu', 'xuejun']} disabled={this.state.disabled}
                        value={[this.state.province, this.state.city, this.state.area, this.state.school,]}
                        options={options} onChange={this.onChange} changeOnSelect style={{ marginLeft: '20px' }} />
                    </div>
                    <div className="current-time">
                      用户名:<Input placeholder="aaa" style={{ width: '10%', marginLeft: '10px', marginRight: '10px' }} id="username" />
                      电话号码:<Input placeholder="1234567890" style={{ width: '10%', marginLeft: '10px', marginRight: '10px' }} id="tel" />
                      用户类别:  <Select value={this.state.typetext} onChange={this.usersChange} style={{ width: '20%' }}>
                        {provinceOptions}
                      </Select>
                      <div style={{ float: "right" }}>
                        <Button type="primary" style={{ marginRight: '20px' }} onClick={this.contactget}>查询</Button>
                        <Button>重置</Button>
                        <Button type="primary" style={{ marginLeft: '20px' }}><Link to="/newaccount">新建</Link></Button>
                      </div>
                    </div>
                    <div className="derive">
                      <Icon type="info-circle-o" />
                      &nbsp; &nbsp;已选择<span style={{ marginLeft: 8, color: 'rgba(0, 51, 255, 0.647058823529412)', fontWeight: 'bold' }}>
                        {hasSelected ? `   ${selectedRowKeys.length}  ` : ''}
                      </span>条记录
                        列表记录总计： <span style={{ color: 'rgba(0, 51, 255, 0.647058823529412)', fontWeight: 'bold' }}>{this.state.num}</span> 条
                    <Button type="primary" style={{ float: 'right', marginTop: '3px' }}>数据导出</Button>
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

export default contact = createForm()(contact);

