import React, { Component } from 'react';
import {  Icon, Button,Select,Table,Menu,Layout,Popconfirm,Cascader,Modal } from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import './journal.css';
import { deletes,querylog } from '../axios';


  const dataSource = [];
  for (let i = 0; i <15; i++) {
    dataSource.push({
      key: i,
      flow:i,
      equipment: `行政楼${i}楼饮水点`,
      age: '张三',
      liuliang:`${i}`,
      address: `London ${i}`,
      status:'正在处理'
    });
  }
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
  function onChange(date, dateString) {
    console.log(date, dateString);
  }
class journal extends React.Component {

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
 this.columns = [{
  title: '用户类别',
  dataIndex: 'equipment',
}, {
  title: '用户名',
  dataIndex: 'flow',
}, {
  title: '用户详情',
  dataIndex: '', 
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
  title: '日志内容',
  dataIndex: 'address',
}, {
  title: '日志时间',
  dataIndex: 'liuliang',
}, {
  title: '操作',
  dataIndex: 'operation',
  render: (text, record) => {
    return (
      dataSource.length > 1 ?
      (
        <Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(record.key)}>
          <a href="javascript:;">删除</a>
        </Popconfirm>
      ) : null
    );
  },
    }];
    this.state = {
      num:15,
      collapsed: false,
      size: 'small',
      selectedRowKeys: [],
      dataSource: dataSource,
      province:"浙江省",
      city:'杭州市',
      area:'上城区',
      school:'',
      count: 2,
    };    
}


  componentWillMount = () => {
    document.title = "操作日志查询";
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
  onDelete = (key) => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        deletes([
          key,
          this.state.begintime,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
             alert("提交信息成功");
             console.log(dataSource)
             const dataSource = [...this.state.dataSource];
             this.setState({ 
               num:this.state.num-1,
               dataSource: dataSource.filter(item => item.key !== key)
             });
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

  querylog = (key) => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        querylog([
          this.state.province,
          this.state.city,
          this.state.area,
          this.state.school,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
             alert("提交信息成功");
             console.log(dataSource)
             const dataSource = [...this.state.dataSource];
             this.setState({ 
               num:this.state.num-1,
               dataSource: dataSource.filter(item => item.key !== key)
             });
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
  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    console.log(dataSource)
    const { selectedRowKeys } = this.state;
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
          账号管理 / 操作日志查询
          </div>
          <div className="tit">
          操作日志查询
          </div>
        <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280,marginTop:'10px' }}>
        <div className="current">
                <div className="curr">
                        <div className="current_text">
                            <div className="current_textt">
                            位置选择:<Cascader defaultValue={['zhejiang', 'hangzhou', 'xihu','xuejun']} options={options} onChange={onChange}  style={{marginLeft:'20px'}}/>
                                <Button type="primary" style={{marginRight:'10px',marginLeft:'20px'}} onClick={this.querylog}>查询</Button>  
                                  <Button>重置</Button>
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
                                <Table dataSource={dataSource} columns={columns}  
                                rowSelection={rowSelection}/>
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

