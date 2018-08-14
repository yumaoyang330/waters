import React, { Component } from 'react';
import {  Icon, Button,Select,Table,Menu,Input,Layout,Row, Col,Popconfirm,Tabs ,Cascader } from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import { equipmentadd,getrespersoninfo,gets} from '../axios';
import './newadd.css';




const TabPane = Tabs.TabPane;

function callback(key) {
  console.log(key);
}
const dataSource = [];
for (let i = 0; i <2; i++) {
  dataSource.push({
    key: i,
    flow:i,
  });
}
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const options = [{
  value: '浙江',
  label: '浙江',
  children: [{
    value: '杭州',
    label: '杭州',
    children: [{
      value: '西湖区',
      label:  '西湖区', 
      children:[{
        value:"学军中学",
        label:"学军中学"
      }]     
    },{
      value: '上城区',
      label:  '上城区',
      children:[{
        value:'杭州十一中',
        label:'杭州十一中',
      },{
        value:'杭州市十中',
        label:"杭州市十中"
      },{
        value:'凤凰小学',
        label:"凤凰小学"
      },{
        value:'胜利小学',
        label:"胜利小学"
      }]
    }],
  }],
}];
class newadd extends Component {
  constructor(props) {
    super(props);
   this.columns = [{
    width:'30%',
    dataIndex: 'equipment',
    render: (text, record) => {
      return (
        <div className="gutter-box">
    设备编号:<Input placeholder="123456789012345"  style={{width:'60%',marginLeft:'10px'}} />
    </div>
      );
    },
  }, {
    dataIndex: 'flow',
    width:'30%',
    render: (text, record) => {
      return (
        <div className="gutter-box">
        安装地址:<Input placeholder="25L"  style={{width:'60%',marginLeft:'10px'}} />
        </div>
      );
    },
  }, {
    dataIndex: 'liuliang',
    width:'20%',
    render: (text, record) => {
      return (
        <div className="gutter-box" >
        初始流量:<Input placeholder="20L"  style={{width:'40%',marginLeft:'10px'}} />
        </div>
      );
    },
  }, {
    title: '操作',
    dataIndex: 'operation',
    width:'20%',
    align:'right',
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
        count: 2,
        province:'',
        city:'',
        area:'',
        school:'',
        repairname:"",
        organization:'',
        repairemail:'',
        repairphone:'',
        alertname:"",
        alertorganization:'',
        alertemail:'',
        alertphone:'',
      };    
  }

  componentWillMount = () => {
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
              // school:res.data.cascadedlocation[0].children[0].children[0].children[0].value,
            });    
            if(localStorage.getItem('type')=== '1' || localStorage.getItem('type') === '2'){
              this.setState({
                disabled:false,
              });  
            } 
        //获取维修和报警人员信息接口      
              getrespersoninfo([
                this.state.province,
                this.state.city,
                this.state.area,
                this.state.school,
              ]).then(res => {
                if (res.data && res.data.status === 1) {
                  if(res.data.resPerson.repairInfo[0]=== undefined){
                    this.setState({
                      repairname:' ',
                      repairphone:' ',
                      repairemail:' ',
                      organization:' ',
                    });                    
                  }else{
                    this.setState({
                      repairname: res.data.resPerson.repairInfo[0].name,
                      repairphone:res.data.resPerson.repairInfo[0].phone,
                      repairemail:res.data.resPerson.repairInfo[0].email,
                      organization:res.data.resPerson.repairInfo[0].organization,
                    });                       
                  }
                  if(res.data.resPerson.alertInfo[0]=== undefined){
                    this.setState({
                      alertname:' ' ,
                      alertphone:' ',
                      alertemail:' ',
                      alertorganization:' ',
                    });                    
                  }else{
                    this.setState({
                      alertname: res.data.resPerson.alertInfo[0].name,
                      alertphone:res.data.resPerson.alertInfo[0].phone,
                      alertemail:res.data.resPerson.alertInfo[0].email,
                      alertorganization:res.data.resPerson.alertInfo[0].organization,
                    });                      
                  }
                } else if (res.data && res.data.status === 0){
                  alert("鉴权失败，需要用户重新登录");            
                }else if(res.data && res.data.status === 2){
                  alert("参数提取失败");   
                }else if(res.data && res.data.status === 3){
                  alert("服务器故障，请刷新再试"); 
                }
              });
           
              if(localStorage.getItem('type')=== '1'){
                this.setState({
                  display2:'none',
                  display3:'none',
                  display4:'none',
                  display5:'none',
                  display6:'none',
                  display7:'none',
                  display8:'none',
                  display9:'none',
                  disabled:true,
                });    
              }
              if(localStorage.getItem('type')=== '2'){
                this.setState({
                  display2:'none',
                  display6:'none',
                  display9:'none',
                  disabled:true,
                });    
              }
              if(localStorage.getItem('type')=== '3'){
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
              if(localStorage.getItem('type')=== '4'){
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
              if(localStorage.getItem('type')=== '8'){
                this.setState({
                  disabled:false,
                });    
              }



          } else {
            alert("提交信息失败");           
          }
        });
      } else {
        alert("请填好所有选项");           
      }


    });

    document.title = "新增设备";
    function showTime(){
      let nowtime=new Date();
      let year=nowtime.getFullYear();
      let month=nowtime.getMonth()+1;
      let date=nowtime.getDate();
      document.getElementById("mytime").innerText=year+"年"+month+"月"+date+" "+nowtime.toLocaleTimeString();
    }
    
    setInterval(showTime,1000);
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
    console.log(dataSource)
    const dataSource = [...this.state.dataSource];
    this.setState({ 
      dataSource: dataSource.filter(item => item.key !== key)
    });
  }     
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
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
        city:'',
        area:'',
        school:'',
      },function(){
        this.props.form.validateFields({ force: true }, (error) => {
          if (!error) {
            getrespersoninfo([
              this.state.province,
              this.state.city,
              this.state.area,
              this.state.school,
            ]).then(res => {
              if (res.data && res.data.status === 1) {
                  if(res.data.resPerson.repairInfo[0]=== undefined){
                    this.setState({
                      repairname:' ',
                      repairphone:' ',
                      repairemail:' ',
                      organization:' ',
                    });                    
                  }else{
                    this.setState({
                      repairname: res.data.resPerson.repairInfo[0].name,
                      repairphone:res.data.resPerson.repairInfo[0].phone,
                      repairemail:res.data.resPerson.repairInfo[0].email,
                      organization:res.data.resPerson.repairInfo[0].organization,
                    });                       
                  }
                  if(res.data.resPerson.alertInfo[0]=== undefined){
                    this.setState({
                      alertname:' ' ,
                      alertphone:' ',
                      alertemail:' ',
                      alertorganization:' ',
                    });                    
                  }else{
                    this.setState({
                      alertname: res.data.resPerson.alertInfo[0].name,
                      alertphone:res.data.resPerson.alertInfo[0].phone,
                      alertemail:res.data.resPerson.alertInfo[0].email,
                      alertorganization:res.data.resPerson.alertInfo[0].organization,
                    });                      
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
          }
        });  
      });
    }else{
      if(arr[2] === undefined){
        this.setState({
          province: arr[0],
          city:arr[1],
          area:'',
          school:'',
        },function(){
          this.props.form.validateFields({ force: true }, (error) => {
            if (!error) {
              getrespersoninfo([
                this.state.province,
                this.state.city,
                this.state.area,
                this.state.school,
              ]).then(res => {
                if (res.data && res.data.status === 1) {
                    if(res.data.resPerson.repairInfo[0]=== undefined){
                      this.setState({
                        repairname:' ',
                        repairphone:' ',
                        repairemail:' ',
                        organization:' ',
                      });                    
                    }else{
                      this.setState({
                        repairname: res.data.resPerson.repairInfo[0].name,
                        repairphone:res.data.resPerson.repairInfo[0].phone,
                        repairemail:res.data.resPerson.repairInfo[0].email,
                        organization:res.data.resPerson.repairInfo[0].organization,
                      });                       
                    }
                    if(res.data.resPerson.alertInfo[0]=== undefined){
                      this.setState({
                        alertname:' ' ,
                        alertphone:' ',
                        alertemail:' ',
                        alertorganization:' ',
                      });                    
                    }else{
                      this.setState({
                        alertname: res.data.resPerson.alertInfo[0].name,
                        alertphone:res.data.resPerson.alertInfo[0].phone,
                        alertemail:res.data.resPerson.alertInfo[0].email,
                        alertorganization:res.data.resPerson.alertInfo[0].organization,
                      });                      
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
            }
          });           
        });
      }else{
        if(arr[3] === undefined){
          this.setState({
            province: arr[0],
            city:arr[1],
            area:arr[2],
            school:'',
          },function(){
            this.props.form.validateFields({ force: true }, (error) => {
              if (!error) {
                getrespersoninfo([
                  this.state.province,
                  this.state.city,
                  this.state.area,
                  this.state.school,
                ]).then(res => {
                  if (res.data && res.data.status === 1) {
                      if(res.data.resPerson.repairInfo[0]=== undefined){
                        this.setState({
                          repairname:' ',
                          repairphone:' ',
                          repairemail:' ',
                          organization:' ',
                        });                    
                      }else{
                        this.setState({
                          repairname: res.data.resPerson.repairInfo[0].name,
                          repairphone:res.data.resPerson.repairInfo[0].phone,
                          repairemail:res.data.resPerson.repairInfo[0].email,
                          organization:res.data.resPerson.repairInfo[0].organization,
                        });                       
                      }
                      if(res.data.resPerson.alertInfo[0]=== undefined){
                        this.setState({
                          alertname:' ' ,
                          alertphone:' ',
                          alertemail:' ',
                          alertorganization:' ',
                        });                    
                      }else{
                        this.setState({
                          alertname: res.data.resPerson.alertInfo[0].name,
                          alertphone:res.data.resPerson.alertInfo[0].phone,
                          alertemail:res.data.resPerson.alertInfo[0].email,
                          alertorganization:res.data.resPerson.alertInfo[0].organization,
                        });                      
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
              }
            });              
          });
        }else{
          this.setState({
            province: arr[0],
            city:arr[1],
            area:arr[2],
            school:arr[3],
          },function(){
            this.props.form.validateFields({ force: true }, (error) => {
              if (!error) {
                getrespersoninfo([
                  this.state.province,
                  this.state.city,
                  this.state.area,
                  this.state.school,
                ]).then(res => {
                  if (res.data && res.data.status === 1) {
                      if(res.data.resPerson.repairInfo[0]=== undefined){
                        this.setState({
                          repairname:' ',
                          repairphone:' ',
                          repairemail:' ',
                          organization:' ',
                        });                    
                      }else{
                        this.setState({
                          repairname: res.data.resPerson.repairInfo[0].name,
                          repairphone:res.data.resPerson.repairInfo[0].phone,
                          repairemail:res.data.resPerson.repairInfo[0].email,
                          organization:res.data.resPerson.repairInfo[0].organization,
                        });                       
                      }
                      if(res.data.resPerson.alertInfo[0]=== undefined){
                        this.setState({
                          alertname:' ' ,
                          alertphone:' ',
                          alertemail:' ',
                          alertorganization:' ',
                        });                    
                      }else{
                        this.setState({
                          alertname: res.data.resPerson.alertInfo[0].name,
                          alertphone:res.data.resPerson.alertInfo[0].phone,
                          alertemail:res.data.resPerson.alertInfo[0].email,
                          alertorganization:res.data.resPerson.alertInfo[0].organization,
                        });                      
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
              }
            });  
          });
        }
      } 
        
    }

  }


  equipmentsubmit = () => {
    let  type=document.getElementById('equipmenttype').value;
    let  content=document.getElementById('content').value;
    let  prealert=document.getElementById('preAlertThreshold').value;
    let  alerts=document.getElementById('alertThreshold').value;
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        equipmentadd([
          this.state.province,
          this.state.city,
          this.state.area,
          this.state.school,
          type,
          content,
          prealert,
          alerts,
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
  render() {
    const { dataSource } = this.state;
    const columns = this.columns;
    return (  
      <div id="newaddbody" >
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
            <div className="homepage"><Link to="/homepage" style={{color:'white'}}>总体信息预览</Link></div>
            <SubMenu key="sub1" title={<span><Icon type="clock-circle-o" /><span>流程监控</span></span>}>
                <Menu.Item key="1"><Link to="/Lowalarm">流量报警</Link></Menu.Item>
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
            <span  id="mytime" style={{height:"100%",borderRadius:'5px',color:'#333',marginLeft:'20px'}}></span>
            <div className="Administrator">
              <Icon type="search" />
                <Icon type="bell" />
                <span></span>{localStorage.getItem('realname')}
            </div>        
        </Header>
        <div className="nav">
        设备管理 / 设备管理 / 新增设备
        </div>
        <div className="tit">
        新增设备
        </div>
        <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280,marginTop:'10px' }}>
        <div className="current">
                <div className="curr">
                        <div className="current_text">
                            <div  className='addinput'>
                            本批设备所属单位：<Cascader 
                            value={[this.state.province, this.state.city, this.state.area,this.state.school]}
                            changeOnSelect options={options} onChange={this.onChange} 
                            style={{display:'inline-block',width:'60%',textAlign:'left'}} 
                            />
                              </div> 
                              <div className='addinput'>          
                              &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本批设备型号：<Input placeholder="美的净水器V2018"  style={{width:'60%'}} id="equipmenttype" />
                              </div>   
                              <div className='addinput'>         
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本批设备备注：<Input placeholder="本批设备寿命年限为3年" style={{width:'60%'}} id="content" />
                               </div> 
                          <div className='bjz'>
                              <Row gutter={16}>
                              <Col className="gutter-row" span={12}>
                                <div className="gutter-box">
                                预报警值:<Input placeholder="20L"  style={{width:'60%',marginLeft:'10px'}} id="preAlertThreshold"/>
                                </div>
                              </Col>
                              <Col className="gutter-row" span={12}>
                                <div className="gutter-box">
                                报警值:<Input placeholder="25L"  style={{width:'60%',marginLeft:'10px'}} id="alertThreshold"/>
                                </div>
                              </Col>
                            </Row>
                          </div>   
                          <div className='number'>  
                            <Table  dataSource={dataSource} columns={columns} pagination={false} />
                            <span onClick={this.handleAdd} className="numadd" style={{color:'#1890FF'}}>新增</span>                      
                          </div>    
                          <div className="inform" >
                           <p>报警通知:<span style={{display:'inline-block',width:'60px',textAlign:'center'}}>{this.state.alertname}</span>
                           <span style={{display:'inline-block',paddingLeft:'10px',paddingRight:'10px'}}>{this.state.alertphone} </span>
                           <span style={{display:'inline-block',paddingLeft:'10px',paddingRight:'10px'}}>{this.state.alertorganization} </span>
                           <span style={{display:'inline-block',paddingLeft:'10px',paddingRight:'10px'}}>{this.state.alertemail} </span></p>
                           <p>维修通知:<span style={{display:'inline-block',width:'60px',textAlign:'center'}}>{this.state.repairname}</span>
                           <span style={{display:'inline-block',paddingLeft:'10px',paddingRight:'10px'}}>{this.state.repairphone} </span>
                           <span style={{display:'inline-block',paddingLeft:'10px',paddingRight:'10px'}}>{this.state.organization} </span>
                           <span style={{display:'inline-block',paddingLeft:'10px',paddingRight:'10px'}}>{this.state.repairemail} </span>
                                </p>
                          </div>
                          <div className="btn">
                        <Button type="primary" style={{marginRight:'20px'}} onClick={this.equipmentsubmit}>提交</Button>  
                         <Button>重置</Button>
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

export default newadd = createForm()(newadd);

