import React, { Component } from 'react';
import {  Icon, Button,Cascader,Select,DatePicker,Table,Menu,Input,Layout,Row, Col,Popconfirm,Modal } from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import moment from 'moment';
import { processget,deleterecord} from '../axios';
import './process.css';


const myDate = new Date();
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const {RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD HH:mm:ss';
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
const dataSource = [];
for (let i = 0; i < 15; i++) {
    dataSource.push({
      key: i,
      flow:i,
      equipment: `行政楼${i}楼饮水点`,
      age: '张三',
      liuliang:`${i}`,
      address: `London ${i}`,
      status:'正在处理',
      time:'2天05小时'
    });
  }
  function onChange(date, dateString) {
    console.log(date, dateString);
  }
class processbody extends Component {
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
    title: '设备编号',
    dataIndex: 'equipment',
  }, {
    title: '设备位置',
    dataIndex: 'flow',
  }, {
    title: '所属地址',
    dataIndex: '报警级别',
  },{
    title: '责任人',
    dataIndex: 'age',
  }, {
    title: '联系方式',
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
    title: '报警时间',
    dataIndex: 'address',
  }, {
    title: '解决时间',
    dataIndex: 'liuliang',
  }, {
    title: '处理时长',
    dataIndex: 'time', 
      }];
      this.state = {
        num:15,
        collapsed: false,
        size: 'small',
        selectedRowKeys: [],
        time:myDate,
        begintime:myDate,
        endtime:myDate,
        dataSource: dataSource,
        province:'浙江省',
        city:'杭州市',
        area:'西湖区',
        school:'',
        count: 2,
        keylist:"",
      };    
  }

  componentWillMount = () => {
    document.title = "流程查询";
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ 
     selectedRowKeys,
     keylist:selectedRowKeys,
    });
  }  
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
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
  moredelete = (key) =>{
    key=this.state.selectedRowKeys;
    const len=key.length;
    const dataSource = [...this.state.dataSource];
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        deleterecord([
          this.state.keylist,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
             console.log("提交信息成功");
             this.setState({ 
              selectedRowKeys: [],
              num:this.state.num-len,
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


  processbtn = () => {
    const dqbh= document.getElementById('imei').value;
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
  
  render() {
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
          查询管理 / 流程查询
          </div>
          <div className="tit">
          流程查询
          </div>
        <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280,marginTop:'10px' }}>
        <div className="current">
                <div className="curr">
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
                          设备编号:<Input placeholder="1234567890" style={{width:'10%',marginLeft:'10px'}}  id="imei"/>
                          <div style={{float:"right"}}>
                          <Button type="primary" style={{marginRight:'20px'}}  onClick={this.processbtn}>查询</Button>  
                          <Button>重置</Button>
                          <Popconfirm title="确定要删除吗?" onConfirm={() => this.moredelete()}>
                          <Button  style={{background:"rgba(204, 0, 0, 1)",color:'white',border:'none',marginLeft:'20px'}} onClick={this.deletes}>
                          批量删除</Button>  
                          </Popconfirm>
                          </div>
                      </div>
                      <div className="derive">
                      <Icon type="info-circle-o" />                                
                          &nbsp; &nbsp;已选择<span style={{ marginLeft: 8 ,color:'rgba(0, 51, 255, 0.647058823529412)',fontWeight:'bold'}}>
                          {hasSelected ? `   ${selectedRowKeys.length}  ` : ''}
                          </span>条记录
                          列表记录总计： <span style={{color:'rgba(0, 51, 255, 0.647058823529412)',fontWeight:'bold'}}>{this.state.num}</span> 条
                      <Button type="primary" style={{float:'right',marginTop:'3px'}}>数据导出</Button> 
                      </div>
                      <div style={{marginTop:'10px'}}>
                          <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource}   onSelect={this.onSelect}/>
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

