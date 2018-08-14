import React, { Component } from 'react';
import { Icon, Button, Select, Table, Menu, Input, Layout, Cascader, Popconfirm, InputNumber, Form, Modal,message } from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import { deleterecord, equipmentdelete, equipmentgets,gets } from '../axios';
import './management.css';
import adminTypeConst from '../config/adminTypeConst';
import QRCode from 'qrcode-react';

const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const dataSource = [];
const number = 15;
for (let i = 0; i < number; i++) {
  dataSource.push({
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
  showModal = (index) => {
    this.setState({
      visible: true,
      phone:this.state.dataSource[index].resPerson.phone,
      name:this.state.dataSource[index].resPerson.name,
      email:this.state.dataSource[index].resPerson.email,
      organization:this.state.dataSource[index].resPerson.organization,
      content:this.state.dataSource[index].resPerson.content,
    });
  }
  state = { visibles: false }
  showcode = (index) => {
    localStorage.setItem('erweima','http://192.168.31.72:3000/mobile?imei='+this.state.IMEI)
    this.setState({
      visibles: true,
      IMEI:this.state.dataSource[index].IMEI,
    });
    
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
      visibles: false,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
      visibles: false,
    });
  }
  constructor(props) {
    super(props);
    this.state = {
      num: number,
      collapsed: false,
      size: 'small',
      selectedRowKeys: [],
      editingKey: '',
      keylist: "",
      dataSource:'',
      province:'',
      city:'',
      area:'',
      school:'',
      IMEI:'666',
    };
    this.columns = [{
      title: '设备编号',
      dataIndex: 'IMEI',
    }, {
      title: '设备位置',
      dataIndex: 'location',
    }, {
      title: '所属地址',
      dataIndex: 'siteName',
    }, {
      title: 'IMSI',
      dataIndex: 'imsi',
    }, {
      title: '信号强度',
      dataIndex: 'rssi',
      render: (text, record, index) => {
        if (20<parseInt(text)) {
          return (
            <div>
              <span style={{color:'green'}}>{text}</span>
            </div>
          )
        }
        if (parseInt(text)<=20) {
          return (
            <div>
              <span style={{color:'red'}}>{text}</span>
            </div>
          )
        }
      }

    },  {
      title: '运行状态',
      dataIndex: 'runningstate',
      render: (text, record, index) => {
        if (text === 0) {
          return (
            <div>
              <span style={{
                display: 'inline-block', width: "10px",
                height: "10px", borderRadius: '50%', background: "red", marginRight: '8px'
              }}></span>
              <span>停止</span>
            </div>
          )
        }
        if (text === 1) {
          return (
            <div>
              <span style={{
                display: 'inline-block', width: "10px",
                height: "10px", borderRadius: '50%', background: "green", marginRight: '8px'
              }}></span>
              <span>运行</span>
            </div>
          )
        }
      }

    },{
      title: '运营商',
      dataIndex: 'apn',
    },{
      title: '责任人联系方式',
      dataIndex: '',
      key: 'x',
      render: (text, record, index) =>
      <div>
    <a onClick={() => this.showModal(index)}
    >详情</a>
        <Modal
          title="联系方式"
          // maskStyle={{ background: "black", opacity: '0.1' }}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          mask={false}
        >
      <p>姓名:{this.state.name}</p>
      <p>电话:{this.state.phone}</p>
      <p>邮箱:{this.state.email}</p>
      <p>地址:{this.state.organization}</p>
      <p>备注:{this.state.content}</p>
        </Modal>
      </div>
    }, {
      title: '初始流量值',
      dataIndex: 'initFlow',
    }, {
      title: '当前流量',
      dataIndex: 'totalFlow',
    }, {
      title: '安装时间',
      dataIndex: 'activiteTime',
      width:'10%'
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record,index) => {
        return (
          <div>
          <a onClick={() => this.showcode(index)} style={{color:'#1890ff'}}
    >生成二维码</a>
        <Modal
          title="生成二维码"
          visible={this.state.visibles}
          // maskStyle={{ background: "black", opacity: '0.1' }}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          mask={false}
          style={{textAlign:'center'}}
        >
        {/* <QRCode value={'http://192.168.31.72:3000/mobile'}/> */}
        <QRCode value={'http://192.168.31.72:3000/mobile?imei='+this.state.IMEI}/>
        <div style={{fontSize:"20px",fontWeight:"bold",color:'#000'}}>{this.state.IMEI}</div>
        </Modal>
            <span style={{ marginLeft: '10px' }}>
              {dataSource.length > 1 ?
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
    if(arr[1] === undefined){
      this.setState({
        province: arr[0],
        city:'',
        area:'',
        school:'',
      })
    }else{
      if(arr[2] === undefined){
        this.setState({
          province: arr[0],
          city:arr[1],
          area:'',
          school:'',
        })
      }else{
        if(arr[3] === undefined){
          this.setState({
            province: arr[0],
            city:arr[1],
            area:arr[2],
            school:'',
          });
        }else{
          this.setState({
            province: arr[0],
            city:arr[1],
            area:arr[2],
            school:arr[3],   
            });  
          };
        }
      }   
    }
  equipmentquerys = () => {
    let querynumber=document.getElementById('querynumber').value;
    console.log(querynumber)
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        equipmentgets([
          this.state.province,
          this.state.city,
          this.state.area,
          this.state.school,
          querynumber,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
            console.log(res.data)
            this.setState({
              dataSource:res.data.deviceList,
              num:res.data.deviceList.length,
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
  onDelete = (key) => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        equipmentdelete([
          key,
          this.state.begintime,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
            message.success("信息删除成功");
            console.log(dataSource)
            const dataSource = [...this.state.dataSource];
            this.setState({
              num: this.state.num - 1,
              dataSource: dataSource.filter(item => item.key !== key)
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
              school:res.data.cascadedlocation[0].children[0].children[0].children[0].value,
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
                display5:'none',
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


            if (!error) {
              equipmentgets([
                res.data.cascadedlocation[0].value,
                res.data.cascadedlocation[0].children[0].value,
                res.data.cascadedlocation[0].children[0].children[0].value,
                res.data.cascadedlocation[0].children[0].children[0].children[0].value,
                '',
              ]).then(res => {
                if (res.data && res.data.status === 1) {
                  console.log(res.data)
                  this.setState({
                    dataSource:res.data.deviceList,
                    num:res.data.deviceList.length,
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

            if(localStorage.getItem('type')=== '1' || localStorage.getItem('type') === '2'){
              this.setState({
                disabled:false,
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



    document.title = "设备管理";
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
    this.setState({
      selectedRowKeys,
      keylist: selectedRowKeys,
    });
  }
  out = () => {
    localStorage.clear()
    window.location.href = "/login/login";
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  // moredelete = (key) =>{
  //   const dataSource = [...this.state.dataSource];
  //   this.props.form.validateFields({ force: true }, (error) => {
  //     if (!error) {
  //       equipmentdelete([
  //         JSON.stringify(this.state.keylist)
  //       ]).then(res => {
  //         if (res.data && res.data.status === 1) {
  //            console.log("信息删除成功");
  //            this.setState({ 
  //             selectedRowKeys: [],
  //             num:this.state.dataSource.length,
  //             dataSource: 
  //             dataSource.filter((item) => {
  //             for (let i = 0; i < key.length; i++) {
  //             if (item.key === key[i]) {
  //             return false
  //             }
  //             }
  //             return true
  //             })
  //           });
  //         } else {
  //           alert("信息删除失败");           
  //         }
  //       });
  //     } else {
  //       alert("删除失败");         
  //     }
  //   });
  // }   


  render() {

    const options =JSON.parse(localStorage.getItem('cascadedlocation'))

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
                <Menu.Item key="6" style={{display:this.state.display6}}><Link to="/school">学校管理</Link></Menu.Item>
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
                <Button type="primary" onClick={this.toggle} style={{ marginLeft: "16px", }}>
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
                      位置选择:<Cascader  disabled={this.state.disabled} value={[this.state.province, this.state.city, this.state.area,this.state.school,]} options={options} onChange={this.onChange} changeOnSelect style={{ marginLeft: '20px' }} />
                      <Button type="primary" style={{ marginRight: '20px' }} onClick={this.equipmentquerys}>查询</Button>
                      <Button>重置</Button>
                      <div className="newadd">
                        <Button type="primary" style={{ marginRight: '20px' }}><Link to="/newadd">新增设备</Link></Button>
                        {/* <Popconfirm title="确定要删除吗?" onConfirm={() => this.moredelete()}>
                          <Button style={{ background: "rgba(204, 0, 0, 1)", color: 'white', border: 'none', }}>
                            批量删除</Button>
                        </Popconfirm> */}
                      </div>
                      <div style={{marginTop:'10px',marginBottm:'10px'}}>
                            设备编号:<Input placeholder="1234567890" style={{width:'15%',marginLeft:'20px'}}  id="querynumber"/>
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
                        dataSource={this.state.dataSource}
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

