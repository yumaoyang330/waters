import React, { Component } from 'react';
import {  Icon, Button,Tabs,Select,DatePicker,Table,Menu,Cascader,Modal ,Layout,Row, Col ,Popconfirm,InputNumber,Form,Input,Dropdown} from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import { querydevicelist,gets,queryhistorylist,updatestatus ,deleterecord} from '../axios';
import axios from 'axios';
import './../mock/mock';
import moment from 'moment';
import './lowalarm.css';




const myDate = new Date();
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const {RangePicker } = DatePicker;



function handleBlur() {
  console.log('blur');
}

function handleFocus() {
  console.log('focus');
}
const dateFormat = 'YYYY/MM/DD HH:mm:ss';
function handleMenuClick(e) {
  console.log('click', e);
}
const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1">已完成</Menu.Item>
    <Menu.Item key="2">待处理</Menu.Item>
  </Menu>
);


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
      flow:i,
      equipment: `行政楼${i}楼饮水点`,
      age: '张三',
      liuliang:`${i}`,
      address: `London ${i}`,
      status:'正在处理',
      jibie:'6',
      jd:'正在处理'
    });
  }
  const data1 = [];
  for (let i = 0; i < number; i++) {
      data1.push({
        keys: i,
        flow:i,
        equipment: `行政楼${i}楼饮水点`,
        age: '张三',
        liuliang:`${i}`,
        address: `London ${i}`,
        status:'正在处理',
        jibie:'6',
        jd:'正在处理'
      });
    }  
function callback(key) {
    console.log(key);
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
class lowalarm extends Component {

  state = { visible: false }
  showModal = () => {
    this.setState({
      visible: true,
    });
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
  timeonChange=(data,dateString)=>{
    this.setState({
      begintime: dateString[0],
      endtime:dateString[1],
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
      keylist:'',
      dataSource:'',
      size: 'small',
      num: number,
      num1: number,
      selectedRowKeys: [],
      selectedRowKeys1: [],
      time:myDate,
      data, editingKey: '',
      begintime:myDate,
      endtime:myDate,
      province:'浙江省',
      city:'杭州市',
      area:'西湖区',
      school:'',
      IMEI:'',
    }; 
    this.columns1 = [{
      title: '设备位置',
      dataIndex: 'equipment',
    }, {
      title: '流量大小',
      dataIndex: 'flow',
    }, {
      title: '报警级别',
      dataIndex: 'jibie',
    },{
      title: '处理阶段',
      dataIndex: 'jd',
    }, {
      title: '责任人',
      dataIndex: 'age',
    }, {
      title: '责任人联系方式',
      dataIndex: '', 
      keys: 'x', 
      render: () =><div>
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
      title: '报警时间',
      dataIndex: 'address',
    }, {
      title: '总流量',
      dataIndex: 'liuliang',
    }, {
      title: '编辑状态',
      dataIndex: '', 
      keys: 'x', 
      render: () =>   
      <Select
      showSearch
      optionFilterProp="children"
      onChange={this.handleChange}
      onFocus={handleFocus}
      defaultValue={'正在处理'}
      onBlur={handleBlur}
      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
      <Option value="正在处理">正在处理</Option>
      <Option value="处理完成">处理完成</Option>
      <Option value="待处理">待处理</Option>
    </Select>,
    }];  
    
  this.columns = [{
    title: '设备位置',
    dataIndex: 'equipment',
    editable: true,
  }, {
    title: '流量大小',
    dataIndex: 'flow',
    editable: true,
  }, {
    title: '报警级别',
    dataIndex: 'jibie',
    editable: true,
  },{
    title: '处理阶段',
    dataIndex: 'jd',
    editable: true,
  }, {
    title: '责任人',
    dataIndex: 'age',
  }, {
    title: '责任人联系方式',
    dataIndex: '', 
    key: 'x', 
    render: () =><div>
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
    title: '报警时间',
    dataIndex: 'address',
    editable: true,
  }, {
    title: '总流量',
    dataIndex: 'liuliang',
    editable: true,
  }, {
    title: '编辑状态',
    dataIndex: 'operation',
    width:'10%',
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
    },
      }];
  }

  handleChange = (value) =>{
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        updatestatus([
          this.state.endtime,
          `${value}`,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
             alert("提交信息成功");
              setTimeout(() => {
                this.setState({
                  btn_disabled:false,
                });                  
              }, 2000);
          } else {
            alert("提交信息失败");
            this.setState({
              btn_disabled:false,
            });               
          }
        });
      } else {
        alert("请填好所有选项");
        this.setState({
          btn_disabled:false,
        });           
      }
    });
  }
  getdqlist = () => {
    const dqbh= document.getElementById('dqimei').value;
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        querydevicelist([
          this.state.begintime,
          this.state.endtime,
          this.state.province,
          this.state.city,
          this.state.area,
          this.state.school,
          dqbh,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
             alert("提交信息成功");
              setTimeout(() => {
                this.setState({
                  btn_disabled:false,
                });                  
              }, 2000);
          } else {
            alert("提交信息失败");
            this.setState({
              btn_disabled:false,
            });               
          }
        });
      } else {
        alert("请填好所有选项");
        this.setState({
          btn_disabled:false,
        });           
      }
    });
  }

  getlslist = () => {
    const lsbh= document.getElementById('lsimei').value;
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        queryhistorylist([
          this.state.begintime,
          this.state.endtime,
          this.state.province,
          this.state.city,
          this.state.area,
          this.state.school,
          lsbh,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
             alert("提交信息成功");
              setTimeout(() => {
                this.setState({
                  btn_disabled:false,
                });                  
              }, 2000);
          } else {
            alert("提交信息失败");
            this.setState({
              btn_disabled:false,
            });               
          }
        });
      } else {
        alert("请填好所有选项");
        this.setState({
          btn_disabled:false,
        });           
      }
    });
  }

    isEditing = (record) => {
      return record.key === this.state.editingKey;
    };
    edit(key) {
      this.setState({ editingKey: key });
    }
    onDelete = (key) => {
      const data = [...this.state.data];
      this.setState({ 
        num:this.state.num-1,
        data: data.filter(item => item.key !== key)
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
          this.setState({ data: newData, editingKey: '' });
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
    document.title = "流量报警";
    // this.props.form.validateFields({ force: true }, (error) => {
    //   if (!error) {
    //     gets([
    //       this.state.begintime,
    //     ]).then(res => {
    //       if (res.data && res.data.status === 1) {
    //          alert("提交信息成功");
    //           setTimeout(() => {
    //             this.setState({
    //               btn_disabled:false,
    //             });                  
    //           }, 2000);
    //       } else {
    //         alert("提交信息失败");
    //         this.setState({
    //           btn_disabled:false,
    //         });               
    //       }
    //     });
    //   } else {
    //     alert("请填好所有选项");
    //     this.setState({
    //       btn_disabled:false,
    //     });           
    //   }
    // });
  }
  // get(){
  //   axios.get('./data/data.json').then((res)=>{
  //     console.log(res.data);
  //     console.log(res.data[3]);
  //   }).catch((err)=>{
  //     console.log(err.status);
  //   })
  // }
  componentDidMount(){
    let that = this;
    axios.get('/data','post',{dataType:'json'})
    .then(res=>{
      console.log(res.data.list);
      that.setState({
        dataSource:res.data.list
      });
    })
    .catch(function(error){
      console.log(error);
    });
  }
  onSelectChange1 = (selectedRowKeys1) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys1);
    this.setState({ 
     selectedRowKeys1
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
    const {
      dataSource,
      loading,
      pagination,
    }= this.props;

    const paginationProps={
      simple:false,
      ...pagination,
    }
    // paginationProps.showTotal=()=>{
    //   return '共' +pagination.total+'条'
    //   this.setState({
    //     num1:pagination.total,
    //   });
    // }
    const tablelist =this.state.dataSource;
    const { selectedRowKeys1 } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const rowSelection1 = {
      selectedRowKeys1,
      onChange: this.onSelectChange1,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const hasSelecteds = selectedRowKeys1.length > 0;
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

    const columns1 = this.columns1.map((col) => {
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
      <div id="lowalarmbody" >
      <Layout>
      <Sider 
        trigger={null}
        collapsible
        collapsed={this.state.collapsed}
      >
        <div className="logo" />
         <div className="lowalar-left">
         <Menu
            defaultSelectedKeys={['1']}
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
      流程监控 / 流量报警
        </div>
        <div className="tit">
          报警查询
        </div>
        <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280,marginTop:'10px' }}>
        <div className="current">
                <div className="curr">
                <Tabs onChange={callback} type="card">
                    <TabPane tab="当前" key="1">
                        <div className="current_text">
                            <div className="current_textt">
                            位置选择:<Cascader defaultValue={['zhejiang', 'hangzhou', 'xihu','xuejun']} options={options} onChange={this.onChange}  style={{marginLeft:'20px'}}/>
                            </div>
                            <div className="current-time">
                              时间选择:
                              <RangePicker 
                                style={{marginLeft:'20px',marginRight:'20px'}}  
                                defaultValue={[moment().startOf('day'), moment(this.state.time, dateFormat)]}
                                format={dateFormat}
                                  ranges={{ 今天: [moment().startOf('day'), moment().endOf('day')], '本月': [moment().startOf('month'), moment().endOf('month')] }}
                                  onChange={this.timeonChange}
                                  disabled
                                />  
                              设备编号:<Input placeholder="1234567890" style={{width:'10%',marginLeft:'10px'}} id="dqimei"/>
                              <span style={{float:'right'}}>
                              <Button type="primary" onClick={this.getdqlist} style={{marginRight:'10px'}}>查询</Button>  
                                <Button onClick={this.get}>重置</Button>
                                </span>
                            </div>
                            <div className="derive">
                            <Icon type="info-circle-o" />                                
                               &nbsp; &nbsp;已加载<span style={{ marginLeft: 8 ,color:'rgba(0, 51, 255, 0.647058823529412)',fontWeight:'bold'}}>
                               {hasSelecteds ? `   ${selectedRowKeys1.length}  ` : ''}
                                </span>条记录
                                列表记录总计： <span style={{color:'rgba(0, 51, 255, 0.647058823529412)',fontWeight:'bold'}}>{this.state.num1}</span> 条
                            <Button type="primary" style={{float:'right',marginTop:'3px'}}>数据导出</Button> 
                            </div>
                            <div style={{marginTop:'10px'}}>
                                <Table rowSelection={rowSelection1} columns={columns1} dataSource={tablelist} pagination={paginationProps} />
                            </div>
                        </div>   
                    </TabPane>
                    <TabPane tab="历史" key="2">
                    <div className="current_text">
                            <div className="current_textt">
                            位置选择:<Cascader defaultValue={['zhejiang', 'hangzhou', 'xihu','xuejun']} options={options} onChange={this.onChange}  style={{marginLeft:'20px'}}/>
                            </div>
                            <div className="current-time">
                            时间选择:
                              <RangePicker 
                                style={{marginLeft:'20px',marginRight:'20px'}}  
                                defaultValue={[moment().startOf('day'), moment(this.state.time, dateFormat)]}
                                format={dateFormat}
                                  ranges={{ 今天: [moment().startOf('day'), moment().endOf('day')], '本月': [moment().startOf('month'), moment().endOf('month')] }}
                                  onChange={this.timeonChange}
                                />  
                              设备编号:<Input placeholder="1234567890" style={{width:'10%',marginLeft:'10px'}}  id="lsimei"/>
                              <span style={{float:'right'}}>
                              <Popconfirm title="确定要删除吗?" onConfirm={() => this.moredelete()}>
                                      <Button  style={{background:"rgba(204, 0, 0, 1)",color:'white',border:'none',marginRight:'20px'}} >
                                      批量删除</Button>  
                                      </Popconfirm>
                              <Button type="primary" onClick={this.getlslist} style={{marginRight:'10px'}}>查询</Button>  
                                <Button onClick={this.get}>重置</Button>
                                </span>
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
                    </TabPane>
                </Tabs>
                </div>
           </div>      
        </Content>
      </Layout>
    </Layout>   
</div>    
    )
  }
}

export default lowalarm = createForm()(lowalarm);

