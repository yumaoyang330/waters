import React, { Component } from 'react';
import {  Icon, Button,Select,Table,Menu,Input,Layout,Popconfirm,InputNumber,Form,Breadcrumb,Cascader,Modal } from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import { userupdate,userdelete,equipmentget} from '../axios';
import './devInfo.css';

const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const options = [{
  value: 'zhejiang',
  label: '浙江省',
  disabled:'disabled',
  children: [{
    value: 'hangzhou',
    label: '杭州市',
    children: [{
      value: 'shangcheng',
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
  disabled:'disabled',
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
for (let i = 0; i < 15; i++) {
    data.push({
      key: i,
      flow:i,
      equipment: `行政楼${i}楼饮水点`,
      ages: '32',
      liuliang:`${i}`,
      address: `London ${i}`,
      status:'正在处理',
      manage:'张三',
    });
  }
  function onChange(date, dateString) {
    console.log(date, dateString);
  }
const FormItem = Form.Item;
class devInfo extends Component {
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
        data, editingKey: '',
        num:'15',
        province:'浙江省',
        city:'杭州市',
        school:"",
        area:'上城区',
        offline:'1',
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
        title: '状态',
        dataIndex: 'status',
        editable: true,
      },{
        title: '所属地址',
        dataIndex: 'ages',
        editable: true,
      }, {
        title: '管理员',
        dataIndex: 'manage',
        editable: true,
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
        title: '最后连接时刻',
        dataIndex: 'address',
        editable: true,
      },

      ];
    }
    equipmentquery = () => {
      let  imei=document.getElementById('equipmentimei').value;
    this.props.form.validateFields({ force: true }, (error) => {
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
    isEditing = (record) => {
      return record.key === this.state.editingKey;
    };
    edit(key) {
      this.setState({ editingKey: key });
    }
  cancel = () => {
      this.setState({ editingKey: '' });
    };
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
  componentWillMount = () => {
    document.title = "设备在线查询";
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
<div id="devInfobody" >
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
        <Breadcrumb>
          <Breadcrumb.Item>设备管理</Breadcrumb.Item>
          <Breadcrumb.Item><a href="">设备在线查询</a></Breadcrumb.Item>
        </Breadcrumb>
        </div>
        <div className="tit">
        设备在线查询
        </div>
        <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280,marginTop:'10px' }}>
        <div className="current">
                <div className="curr">
                        <div className="current_text">
                            <div className="current_textt">
                            位置选择:<Cascader defaultValue={['zhejiang', 'hangzhou', 'shangcheng','xuejun']} options={options} onChange={this.onChange}  style={{marginLeft:'20px'}}/>
                              <div style={{float:"right"}}>
                                <Button type="primary" style={{marginRight:'20px'}} onClick={this.equipmentquery}>查询</Button>  
                                <Button>重置</Button>
                                <Button type="primary" style={{marginLeft:'20px'}}><Link to="/offline">查看离线</Link></Button> 
                              </div>
                            </div>
                            <div style={{marginTop:'10px',marginBottm:'10px'}}>
                            设备编号:<Input placeholder="1234567890" style={{width:'15%',marginLeft:'20px'}}  id="equipmentimei"/>
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


