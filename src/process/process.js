import React, { Component } from 'react';
import {  Icon, Button,Cascader,Select,DatePicker,Table,Menu,Input,Layout,Row, Col,Popconfirm,Modal,message } from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import moment from 'moment';
import { processget,deleterecord,gets} from '../axios';
import './process.css';
import adminTypeConst from '../config/adminTypeConst';





const myDate = new Date();
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const {RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD HH:mm:ss';
const dataSource = [];
for (let i = 0; i < 1; i++) {
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
  showModal = (index) => {
    this.setState({
      visible: true,
      organization:this.state.dataSource[index].resPerson.organization,
      phone:this.state.dataSource[index].resPerson.phone,
      name:this.state.dataSource[index].resPerson.name,
      email:this.state.dataSource[index].resPerson.email,
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
  out = () => {
    localStorage.clear()
    window.location.href = "/login";
  }
  constructor(props) {
    super(props);
   this.columns = [{
    title: '设备编号',
    dataIndex: 'deviceId',
  }, {
    title: '设备位置',
    dataIndex: 'deviceLocation',
  }, {
    title: '所属地址',
    dataIndex: 'deviceBelongs',
  },{
    title: '责任人',
    dataIndex: 'resPerson.name',
  }, {
    title: '联系方式',
    dataIndex: '', 
    key: 'x', 
    render: (text, record, index) => <div>
     <a onClick={() => this.showModal(index)}
    >详情</a>
    <Modal
      title="联系方式"
      // maskStyle={{background:"black",opacity:'0.1'}}
      visible={this.state.visible}
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      mask={false}
    >
      <p>姓名:{this.state.name}</p>
      <p>电话:{this.state.phone}</p>
      <p>邮箱:{this.state.email}</p>
      <p>地址:{this.state.organization}</p>
    </Modal>
  </div>
  },{
    title: '报警时间',
    dataIndex: 'alertBeginTime',
  }, {
    title: '解决时间',
    dataIndex: 'aldertEndTime',
  }, {
    title: '处理时长',
    dataIndex: 'handleTime', 
      }];
      this.state = {
        num:'',
        collapsed: false,
        size: 'small',
        selectedRowKeys: [],
        time:myDate,
        begintime:myDate,
        endtime:myDate,
        dataSource: dataSource,
        province:'',
        city:'',
        area:'',
        school:'',
        count: 2,
        keylist:"",
      };    
  }

  componentWillMount = () => {
    document.title = "流程查询";
    function showTime(){
      let nowtime=new Date();
      let year=nowtime.getFullYear();
      let month=nowtime.getMonth()+1;
      let date=nowtime.getDate();
      document.getElementById("mytime").innerText=year+"年"+month+"月"+date+" "+nowtime.toLocaleTimeString();
    }
    setInterval(showTime,1000);

    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        gets([
          localStorage.getItem('token'),
        ]).then(res => {
          if (res.data && res.data.status === 1) {
             this.setState({
              province:res.data.cascadedlocation[0].value,
              city:res.data.cascadedlocation[0].children[0].value,
              area:res.data.cascadedlocation[0].children[0].children[0].value,
              school:res.data.cascadedlocation[0].children[0].children[0].children[0].value,
            });    

            this.props.form.validateFields({ force: true }, (error) => {
              if (!error) {
                processget([
                  this.state.begintime,
                  this.state.endtime,
                  res.data.cascadedlocation[0].value,
                  res.data.cascadedlocation[0].children[0].value,
                  res.data.cascadedlocation[0].children[0].children[0].value,
                  res.data.cascadedlocation[0].children[0].children[0].children[0].value,
                  '',
                ]).then(res => {
                  if (res.data && res.data.status === 1) {
                    console.log(res.data)
                     this.setState({
                      dataSource:res.data.processList,
                      num:res.data.processList.length,
                    });  

                    if(localStorage.getItem('type')=== adminTypeConst.ADMIN_TYPE_SCHOOL_MANAGER){
                      this.setState({
                        display2:'none',
                        display6:'none',
                        display9:'none',
                        disabled:true,
                      });    
                    }
                    if(localStorage.getItem('type')=== adminTypeConst.ADMIN_TYPE_SCHOOL_MANTAINER){
                      this.setState({
                        display2:'none',
                        display3:'none',
                        display4:'none',
                        display6:'none',
                        display7:'none',
                        display8:'none',
                        display9:'none',
                        disabled:true,
                      });    
                    }
        
                    if(localStorage.getItem('type')=== adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER){
                      this.setState({
                        disabled:false,
                        display3:'none',
                        display4:'none',
                        display9:'none',
                        shpower:true,
                        spower:true,
                        qpower:true,
                      });    
                    }
                    if(localStorage.getItem('type')=== adminTypeConst.ADMIN_TYPE_EDU_MANAGER){
                      this.setState({
                        disabled:false,
                        display1:'none',
                        display2:'none',
                        display6:'none',
                        display9:'none',
                        shpower:true,
                        spower:true,
                        qpower:true,
                      });    
                    }
                    if(localStorage.getItem('type')=== adminTypeConst.ADMIN_TYPE_SUPER_MANAGER){
                      this.setState({
                        disabled:false,
                      });    
                    }
                  } else {
                    message.error("获取信息失败");            
                  }
                });
              } else {
                message.error("接口获取失败");      
              }
            });

          } else {
            message.error("获取信息失败");             
          }
        });
      } else {
        message.error("接口获取失败");     
      }
    });
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
    if(arr[1] === undefined){
      this.setState({
        province: arr[0],
        city:' ',
        area:' ',
        school:' ',
      });
    }else{
      if(arr[2] === undefined){
        this.setState({
          province: arr[0],
          city:arr[1],
          area:' ',
          school:' ',
        });
      }else{
        if(arr[3] === undefined){
          this.setState({
            province: arr[0],
            city:arr[1],
            area:arr[2],
            school:' ',
          });
        }else{
          this.setState({
            province: arr[0],
            city:arr[1],
            area:arr[2],
            school:arr[3],
          });
        }
      }   
    }
  }

  timeonChange=(value, dateString) =>{
    this.setState({
      begintime:dateString[0],
      endtime:dateString[1],
    });    
  }

  moredelete = (key) =>{
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
              num:this.state.dataSource.length,
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
            message.error("获取信息失败");           
          }
        });
      } else {
        message.error("接口获取失败");         
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
            console.log(res.data)
             this.setState({
              dataSource:res.data.processList,
              num:res.data.processList.length,
            });  
          } else {
            message.error("获取信息失败");          
          }
        });
      } else {
        message.error("接口获取失败");       
      }
    });
  }
  
  render() {

    const options =JSON.parse(localStorage.getItem('cascadedlocation'))



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
           <div className="homepage" ><a href="https://datav.aliyun.com/share/d7d63263d774de3d38697367e3fbbdf7" style={{background: '#1890ff', color: 'white',display:"block",width:"100%",borderRadius:'5px'}}>总体信息预览</a></div>
            <SubMenu key="sub1" title={<span><Icon type="clock-circle-o" /><span>流程监控</span></span>}>
                <Menu.Item key="1" className="navbar1" style={{display:this.state.display1}}><Link to="/lowalarm">流量报警</Link></Menu.Item>
                <Menu.Item key="2" style={{display:this.state.display2}}><Link to="/alarmsetting">流量报警设置</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title={<span><Icon type="edit" /><span>设备管理</span></span>}>
                <Menu.Item key="3" style={{display:this.state.display3}}><Link to="/devInfo">设备在线查询</Link></Menu.Item>
                <Menu.Item key="4" style={{display:this.state.display4}}><Link to="/management">设备管理</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" title={<span><Icon type="calendar" /><span>查询管理</span></span>}>
                <Menu.Item key="5" style={{display:this.state.display5}}><Link to="/process">流程查询</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" title={<span><Icon type="warning" /><span>系统管理</span></span>}>
                <Menu.Item key="6" style={{display:this.state.display6}}><Link to="/school">单位管理</Link></Menu.Item>
                <Menu.Item key="7" style={{display:this.state.display7}}><Link to="/contact">区域联系人管理</Link></Menu.Item>
                <Menu.Item key="8" style={{display:this.state.display8}}><Link to="/journal">操作日志查询</Link></Menu.Item>
                <Menu.Item key="9" style={{display:this.state.display9}}><Link to="/highset">高级设置</Link></Menu.Item>
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
            <span  id="mytime" style={{height:"100%",lineHeight:"64px",display:"inline-block",float:"left",borderRadius:'5px',color:'#333',marginLeft:'20px'}}></span>
            <span style={{display:"inline-block",marginLeft:'20%', height:"100%",borderRadius:'5px',fontSize:'25px',fontWeight:'bold'}}>中小学直饮水机卫生监管平台</span>
            <span style={{float:'right',height:'50px',lineHeight:"50px",marginRight:"2%",color:'red',cursor:'pointer'}} onClick={this.out}>退出</span>   
            <div className="Administrator">
                <span></span>{localStorage.getItem('realname')}
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
                          位置选择:<Cascader value={[this.state.province, this.state.city, this.state.area,this.state.school,]} options={options} onChange={this.onChange} changeOnSelect  style={{marginLeft:'20px'}}/>
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
                          <Button  style={{background:"rgba(204, 0, 0, 1)",color:'white',border:'none',marginLeft:'20px'}} >
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

