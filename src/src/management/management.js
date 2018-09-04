import React, { Component } from 'react';
import { Icon, Button, Select, Table, Menu, Input, Layout, Cascader, Popconfirm, InputNumber, Form, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import { deleterecord, equipmentdelete, equipmentget } from '../axios';
import './management.css';

const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const options = [{
  value: 'zhejiang',
  label: '浙江省',
  children: [{
    value: 'hangzhou',
    label: '杭州市',
    children: [{
      value: 'xihu',
      label: '西湖区',
      children: [{
        value: 'xuejun',
        label: '学军中学',
      }]
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
const data = [];
const number = 15;
for (let i = 0; i < number; i++) {
  data.push({
    key: i,
    flow: i,
    equipment: `行政楼${i}楼饮水点`,
    age: '张三',
    liuliang: `${i}`,
    address: `London ${i}`,
    status: '正在处理',
    jd: '正在处理'
  });
}
function onChange(date, dateString) {
  console.log(date, dateString);
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
class management extends Component {
  state = { visible: false }
  showModal = () => {
    this.setState({
      visible: true,
    });
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
      num: number,
      collapsed: false,
      size: 'small',
      selectedRowKeys: [],
      data, editingKey: '',
      keylist: "",
      province: '浙江省',
      city: '杭州市',
      school: "",
      area: '上城区',
    };
    this.columns = [{
      title: '设备编号',
      dataIndex: 'equipment',
      editable: true,
    }, {
      title: '设备位置',
      dataIndex: 'flow',
      editable: true,
    }, {
      title: '所属地址',
      dataIndex: 'address',
      editable: true,
    }, {
      title: '责任人',
      dataIndex: 'age',
      editable: true,
    }, {
      title: '责任人联系方式',
      dataIndex: '',
      key: 'x',
      render: () => <div>
        <a onClick={this.showModal}>详情</a>
        <Modal
          title="联系方式"
          maskStyle={{ background: "black", opacity: '0.1' }}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>姓名:</p>
          <p>电话:</p>
          <p>邮箱:</p>
        </Modal>
      </div>
    }, {
      title: '初始流量值',
      dataIndex: 'address',
      editable: true,
    }, {
      title: '当前流量',
      dataIndex: 'liuliang',
      editable: true,
    }, {
      title: '安装时间',
      dataIndex: 'liuliang',
      editable: true,
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '10%',
      render: (text, record) => {
        const editable = this.isEditing(record);
        return (
          <div>
            <span style={{ marginLeft: '10px' }}>
              {data.length > 1 ?
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
  }
  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };
  edit(key) {
    this.setState({ editingKey: key });
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
  equipmentquery = () => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        equipmentget([
          this.state.province,
          this.state.city,
          this.state.area,
          this.state.school,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
            console.log("身份验证成功");
          } else if (res.data && res.data.status === 0) {
            alert("鉴权失败，需要用户重新登录");
          } else if (res.data && res.data.status === 2) {
            alert("参数提取失败");
          } else if (res.data && res.data.status === 3) {
            alert("服务器故障，请刷新再试");
          }
        });
      } else {
        alert("请填好所有选项");
        this.setState({
          btn_disabled: false,
        });
      }
    });
  }
  onDelete = (key) => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        equipmentdelete([
          key,
          this.state.begintime,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
            alert("提交信息成功");
            console.log(dataSource)
            const dataSource = [...this.state.dataSource];
            this.setState({
              num: this.state.num - 1,
              dataSource: dataSource.filter(item => item.key !== key)
            });
          } else if (res.data && res.data.status === 0) {
            alert("鉴权失败，需要用户重新登录");
          } else if (res.data && res.data.status === 2) {
            alert("参数提取失败");
          } else if (res.data && res.data.status === 3) {
            alert("服务器故障，请刷新再试");
          }
        });
      } else {
        alert("请填好所有选项");
        this.setState({
          btn_disabled: false,
        });
      }
    });
  }
  componentWillMount = () => {
    document.title = "设备管理";
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
  moredelete = (key) => {
    key = this.state.selectedRowKeys;
    const len = key.length;
    const dataSource = [...this.state.data];
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        deleterecord([
          this.state.keylist,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
            console.log("提交信息成功");
            this.setState({
              selectedRowKeys: [],
              num: this.state.num - len,
              dataSource:
                dataSource.filter((item) => {
                  for (let i = 0; i < key.length; i++) {
                    if (item.key === key[i]) {
                      return false
                    }
                  }
                  return true
                })
            });
          } else {
            alert("提交信息失败");
          }
        });
      } else {
        alert("请填好所有选项");
      }
    });
  }


  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
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
      <div id="managementbody" >
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
                <div className="top"><span style={{display:"inline-block",width:'100%',height:"100%",borderRadius:'5px',background:'#1890ff',color:'white'}}>中小学直饮水机卫生监管平台</span></div>
                <SubMenu key="sub1" title={<span><Icon type="clock-circle-o" /><span>流程监控</span></span>}>
                  <Menu.Item key="1"><Link to="/lowalarm">流量报警</Link></Menu.Item>
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
                <Button type="primary" onClick={this.toggle} style={{ marginLeft: "16px", }}>
                  <Icon
                    className="trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  />
                </Button>
              </div>
              <div className="Administrator">
                <Icon type="search" />
                <Icon type="bell" />
                <span></span>管理员
            </div>
            </Header>
            <div className="nav">
              设备管理 / 设备管理
        </div>
            <div className="tit">
              设备管理
        </div>
            <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280, marginTop: '10px' }}>
              <div className="current">
                <div className="curr">
                  <div className="current_text">
                    <div className="current_textt">
                      位置选择:<Cascader defaultValue={['zhejiang', 'hangzhou', 'xihu', 'xuejun']} options={options} onChange={this.onChange} style={{ marginLeft: '20px' }} />
                      <Button type="primary" style={{ marginRight: '20px' }} onClick={this.equipmentquery}>查询</Button>
                      <Button>重置</Button>
                      <div className="newadd">
                        <Button type="primary" style={{ marginRight: '20px' }}><Link to="/newadd">新增设备</Link></Button>
                        <Popconfirm title="确定要删除吗?" onConfirm={() => this.moredelete()}>
                          <Button style={{ background: "rgba(204, 0, 0, 1)", color: 'white', border: 'none', }}>
                            批量删除</Button>
                        </Popconfirm>
                      </div>

                    </div>
                    <div className="derive">
                      <Icon type="info-circle-o" />
                      &nbsp; &nbsp;已选择<span style={{ marginLeft: 8, color: 'rgba(0, 51, 255, 0.647058823529412)', fontWeight: 'bold' }}>
                        {hasSelected ? `   ${selectedRowKeys.length}  ` : ''}
                      </span>条记录
                                列表记录总计： <span style={{ color: 'rgba(0, 51, 255, 0.647058823529412)', fontWeight: 'bold' }}>{this.state.num}</span> 条
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

export default management = createForm()(management);

