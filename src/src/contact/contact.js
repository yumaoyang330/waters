import React, { Component } from 'react';
import {  Icon, Button,Select,Table,Menu,Input,Layout,Popconfirm,Cascader,Modal,Form,InputNumber} from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import { userupdate,userdelete,conactget} from '../axios';
import './contact.css';

const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const accounttype = ['  ','学校报警管理员', '学校管理员','区级管理员','超级管理员'];
const accounttypes = ['学校报警管理员', '学校管理员','区级管理员','超级管理员'];
const options = [{
  value: 'zhejiang',
  label: '浙江省',
  children: [{
    value: 'hangzhou',
    label: '杭州市',
    children: [{
      value: 'xihu',
      label: '上城区',
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
      phoneNumber:'13578545528',
      email:"854585109@qq.com",
      userName:'张三',
      password:'123',
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

class contact extends Component {
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
  typeChange=(date, dateString) =>{
      console.log(date)
      this.setState({
        usertype: date,
      });
  }
  usersChange=(date, dateString) =>{
    console.log(date)
    this.setState({
      usertypes: date,
    });
}
  contactget = (key) => {
    let username=document.getElementById('username').value;
    let tel=document.getElementById('tel').value;
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        conactget([
          this.state.province,
          this.state.city,
          this.state.area,
          this.state.school,
          username,
          tel,
          this.state.usertypes,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
             console.log("身份验证成功");
          } else if (res.data && res.data.status === 0){
            alert("鉴权失败，需要用户重新登录");            
          }else if(res.data && res.data.status === 2){
            alert("参数提取失败");   
          }else if(res.data && res.data.status === 3){
            alert("服务器故障，请刷新再试"); 
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
  constructor(props) {
    const typeOptions = accounttypes.map(type => <Option key={type}>{type}</Option>);
    super(props);
   this.columns = [{
    title: '用户类别',
    render: () =>   
    <Select defaultValue={accounttypes[0]} onChange={this.typeChange} style={{width:'80%'}} disabled={this.state.typedisabled}> 
    {typeOptions}
    </Select>
  }, {
    title: '用户名',
    dataIndex: 'userName',
    editable: true,
  }, {
    title: '初始密码',
    dataIndex: 'password',
    editable: true,
  },{
    title: '联系方式',
    dataIndex: 'phoneNumber',
    editable: true,
  },{
    title: '邮箱',
    dataIndex: 'email',
    editable: true,
  },{
    title: '详情',
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
      <p>所在单位:</p>
      <p style={{marginTop:"20px"}}>备注: <textarea name="" id="" cols="30" rows="10"  style={{border:'none',outline:'none',width:'100%',height:"100px", resize:'none',textIndent:"28px"}}></textarea> </p>
    </Modal>
  </div>
  }, {
    title: '操作',
    dataIndex: 'operation',
    width:'15%',
    render: (text, record) => {
      const editable = this.isEditing(record);
      return (
        <div>
          <span style={{marginRight:'10px'}}>
          {data.length > 1 ?
          (
            <Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(record.key)}>
              <a href="javascript:;">删除</a>
            </Popconfirm>
          ) : null}
          </span>
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
            <a onClick={() => this.edit(record.key)}>修改资料</a>
          )}
        </div>
      );
    },
      }];
      this.state = {
        num:number,
        collapsed: false,
        size: 'small',
        province:'浙江省',
        city:'杭州市',
        area:'上城区',
        school:'',
        selectedRowKeys: [],
        data, editingKey: '',
        usertype:'',
        usertypes:'',
        phoneNumber:'',
        userName:'',
        email:'',
        password:"",
        typedisabled:true,
      };    
  }
  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };
  edit(key) {
    this.setState({
       editingKey: key,
       typedisabled:false,
      });
  }

  save(form, key) {
    this.setState({
      typedisabled:true,
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
          data: newData, editingKey: '' ,
          userName:newData[key].userName,
          password:newData[key].password,
          phoneNumber:newData[key].phoneNumber,
          email:newData[key].email,
        },()=>{
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
                this.state.usertype,
              ]).then(res => {
                if (res.data && res.data.status === 1) {
                   alert("信息编辑成功");
                    setTimeout(() => {
                      this.setState({
                        typedisabled:true,
                      });                  
                    }, 2000);
                } else {
                  alert("信息编辑失败");
                  this.setState({
                    typedisabled:true,
                  });             
                }
              });
            } else {
              alert("请填好所有选项");
              this.setState({
                typedisabled:true,
              });           
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
  onDelete = (key) => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        userdelete([
          key,
          this.state.begintime,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
             console.log("身份验证成功");
             console.log(dataSource)
             const dataSource = [...this.state.dataSource];
             this.setState({ 
               num:this.state.num-1,
               dataSource: dataSource.filter(item => item.key !== key)
             });
             if (res.data && res.data.deleteResult === 1){
               alert('信息删除成功')
             }if (res.data && res.data.deleteResult === 1){
               alert('信息删除失败')
               console.log('删除失败，后端回滚，前端重试');
             }
          } else if (res.data && res.data.status === 0){
            alert("鉴权失败，需要用户重新登录");            
          }else if(res.data && res.data.status === 2){
            alert("参数提取失败");   
          }else if(res.data && res.data.status === 3){
            alert("服务器故障，请刷新再试"); 
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

  

  componentWillMount = () => {
    document.title = "区域联系人管理";
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
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
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
                <span><img src="" alt=""/></span>管理员
            </div>        
        </Header>
        <div className="nav">              
            账号管理 / 区域联系人管理
          </div>
          <div className="tit">
          区域联系人管理
          </div>
        <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280,marginTop:'10px' }}>
        <div className="current">
                <div className="curr">
                <div className="current_text">
                    <div className="current_textt">
                    位置选择:<Cascader defaultValue={['zhejiang', 'hangzhou', 'xihu','xuejun']} options={options} onChange={this.onChange}  style={{marginLeft:'20px'}}/>
                    </div>
                    <div className="current-time">
                        用户名:<Input placeholder="aaa" style={{width:'10%',marginLeft:'10px',marginRight:'10px'}}  id="username"/>
                        电话号码:<Input placeholder="1234567890" style={{width:'10%',marginLeft:'10px',marginRight:'10px'}} id="tel"/>
                        用户类别:  <Select defaultValue={accounttype[0]} onChange={this.usersChange} style={{width:'20%'}}> 
                                        {provinceOptions}
                                  </Select>
                        <div style={{float:"right"}}>
                        <Button type="primary" style={{marginRight:'20px'}} onClick={this.contactget}>查询</Button>  
                        <Button>重置</Button>
                        <Button type="primary" style={{marginLeft:'20px'}}><Link to="/newaccount">新建</Link></Button> 
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

export default contact = createForm()(contact);

