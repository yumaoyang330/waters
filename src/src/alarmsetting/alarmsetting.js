import React, { Component } from 'react';
import {  Icon, Button,Select,Table,Menu,Input,Layout,Cascader,Popconfirm,InputNumber,Form,Modal} from 'antd';
import { Link } from 'react-router-dom';
import { updatealarm} from '../axios';
import { createForm } from 'rc-form';
import './alarmsetting.css';

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
      children:[{
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
const number=15;
for (let i = 0; i < number; i++) {
    data.push({
      key: i,
      preAlertThreshold:i,
      location: `行政楼${i}楼饮水点`,
      age: '张三',
      alertThreshold:`${i}`,
      address: `London ${i}`,
      status:'正在处理'
    });
  }

  const FormItem = Form.Item;
  function onChange(date, dateString) {
    console.log(date,dateString);

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
      collapsed: false,
      size: 'small',
      selectedRowKeys: [],
      data: data,
      editingKey: '',
      num:number,
      alertThreshold:'',
      preAlertThreshold:'',
     };
    this.columns = [{
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
  },{
    title: '责任人',
    dataIndex: 'age',
  }, {
    title: '责任人联系方式',
    dataIndex: '', 
    key: 'x', 
    render: () => <div>
    <a onClick={this.showModal}>详情</a>
    <Modal
      title="联系方式"
      maskStyle={{background:"black",opacity:'0.1'}}
      visible={this.state.visible}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
    >
      <p>姓名:</p>
      <p>电话:</p>
      <p>邮箱:</p>
    </Modal>
  </div>
  },{
        title: '操作',
        dataIndex: 'operation',
        width:'15%',
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
              <span style={{marginLeft:'10px'}}>
              {data.length > 1 ?
              (
                <Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(record.key)}>
                  <a href="javascript:;">删除</a>
                </Popconfirm>
              ) : null}
              </span>
            </div>
          );
        }},
    ];
  }
  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };
  edit(key) {
    this.setState({ editingKey: key });
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
          data: newData, editingKey: '' ,
          preAlertThreshold:newData[key].preAlertThreshold,
          alertThreshold:newData[key].alertThreshold,
        },()=>{
          this.props.form.validateFields({ force: true }, (error) => {
            if (!error) {
              updatealarm([
                key,
                this.state.preAlertThreshold,
                this.state.alertThreshold,
              ]).then(res => {
                if (res.data && res.data.status === 1) {
                   alert("信息编辑成功");
                } else {
                  alert("信息编辑失败");         
                }
              });
            } else {
              alert("请填好所有选项");     
            }
          });
            
        });
      } else {
        newData.push(data);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }
  onDelete = (key) => {
    const data = [...this.state.data];
    this.setState({ 
      num:this.state.num-1,
      data: data.filter(item => item.key !== key)
    });
  }  
cancel = () => {
    this.setState({ editingKey: '' });
  };

  componentWillMount = () => {
    document.title = "流量报警设置";
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
                <Button type="primary"  onClick={this.toggle} style={{ marginLeft:"16px",  }}>
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
        流程监控 / 流量报警设置
        </div>
        <div className="tit">
        流量报警设置
        </div>
        <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280,marginTop:'10px' }}>
        <div className="current">
                <div className="curr">
                        <div className="current_text">
                            <div className="current_textt">
                            位置选择:<Cascader defaultValue={['zhejiang', 'hangzhou', 'xihu','xuejun']} options={options} onChange={onChange}  style={{marginLeft:'20px'}}/>
                                设备编号:<Input placeholder="1234567890" style={{width:'10%',marginLeft:'10px'}} />
                                <div style={{float:"right"}}>
                                  <Button type="primary" style={{marginRight:'20px'}}>查询</Button>  
                                  <Button>重置</Button>
                                </div>
                            </div>
                            <div className="derive">
                            <Icon type="info-circle-o" />                                
                               &nbsp; &nbsp;已加载<span style={{ marginLeft: 8 ,color:'rgba(0, 51, 255, 0.647058823529412)',fontWeight:'bold'}}>
                               {hasSelected ? `   ${selectedRowKeys.length}  ` : ''}
                                </span>条记录
                                列表记录总计： <span style={{color:'rgba(0, 51, 255, 0.647058823529412)',fontWeight:'bold'}}>{this.state.num}</span> 条
                            <Button type="primary" style={{float:'right',marginTop:'3px'}}>数据导出</Button> 
                            </div>
                            <div style={{marginTop:'10px'}}>
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

