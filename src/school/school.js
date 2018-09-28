import React, { Component } from 'react';
import { Icon, Button, Select, Table, Menu, Layout, Popconfirm, Cascader, Modal, message } from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import './school.css';
import { schooldelete, querylog, schoolget, gets } from '../axios';
import adminTypeConst from '../config/adminTypeConst';





const dataSource = [];
for (let i = 0; i < 15; i++) {
  dataSource.push({
    key: i,
    flow: i,
    equipment: `行政楼${i}楼饮水点`,
    age: '张三',
    liuliang: `${i}`,
    address: `London ${i}`,
    status: '正在处理'
  });
}
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;

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
      title: '单位名称',
      dataIndex: 'school',
    }, {
      title: '设备数量',
      dataIndex: 'deviceQuantity',
    },{
      title: '详细地址',
      dataIndex: 'address',
    }, {
      title: '创建时间',
      dataIndex: 'gmtCreate',
    }, {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record, index) => {
        return (
          dataSource.length > 1 ?
            (
              <Popconfirm title="确定要删除吗?" onConfirm={() => this.onDelete(record.key, index)}>
                <a href="javascript:;">删除</a>
              </Popconfirm>
            ) : null
        );
      },
    }];
    this.state = {
      province: '',
      city: '',
      area: '',
      num: '',
      collapsed: false,
      size: 'small',
      selectedRowKeys: [],
      dataSource: '',
      count: 2,
      display1: '',
      display2: '',
      display3: '',
      display4: '',
      display5: '',
      display6: '',
      display7: '',
      display8: '',
      display9: '',
    };
  }


  componentWillMount = () => {


    this.props.form.validateFields({ force: true }, (error) => {

      if (!error) {
        gets([
          localStorage.getItem('token'),
        ]).then(res => {
          if(localStorage.getItem('token')===null){
            window.location.href = "/login";
          }
          if (res.data && res.data.status === 1) {
            localStorage.setItem('cascadedlocation', JSON.stringify(res.data.cascadedlocation))
            this.setState({
              province: res.data.cascadedlocation[0].value,
              city: res.data.cascadedlocation[0].children[0].value,
              area: res.data.cascadedlocation[0].children[0].children[0].value,
            });
            if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER){
              this.setState({
                city:'',
                area:'',
                school:'',
              });
            }
            if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER){
              this.setState({
                school:'',
              });
            }
            if (!error) {
              schoolget([
                this.state.province,
                this.state.city,
                this.state.area,
              ]).then(res => {
                if (res.data && res.data.status === 1) {
                  console.log(res.data.schoolList[0])
                  this.setState({
                    dataSource: res.data.schoolList,
                    num: res.data.schoolList.length,
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
              message.error("接口获取失败");
            }


            if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_SCHOOL_MANAGER) {
              this.setState({
                display2: 'none',
                display6: 'none',
                display9: 'none',
                disabled: true,
              });
            }
            if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_SCHOOL_MANTAINER) {
              this.setState({
                display2: 'none',
                display3: 'none',
                display4: 'none',
                display6: 'none',
                display7: 'none',
                display8: 'none',
                display9: 'none',
                display10: 'none',
                disabled: true,
              });
            }

            if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER) {
              this.setState({
                disabled: false,
                display3: 'none',
                display4: 'none',
                display9: 'none',
              });
            }
            if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER) {
              this.setState({
                disabled: false,
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


    document.title = "操作日志查询";
    function showTime() {
      let nowtime = new Date();
      let year = nowtime.getFullYear();
      let month = nowtime.getMonth() + 1;
      let date = nowtime.getDate();
      document.getElementById("mytime").innerText = year + "年" + month + "月" + date + " " + nowtime.toLocaleTimeString();
    }

    setInterval(showTime, 1000);
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
        schooldelete([
          key
        ]).then(res => {
          if (res.data && res.data.status === 1) {

            this.props.form.validateFields({ force: true }, (error) => {
              if (!error) {
                gets([
                  localStorage.getItem('token'),
                ]).then(res => {
                  if (res.data && res.data.status === 1) {
                    localStorage.setItem('cascadedlocation', JSON.stringify(res.data.cascadedlocation));
                    setTimeout(() => {
                      window.location.href = "/school";
                    }, 1000);

                  }
                })
              }
            })


            message.success("信息删除成功");
            console.log(dataSource)
            const dataSource = [...this.state.dataSource];
            this.setState({
              num: dataSource.length,
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
        message.error("获取信息失败");
      }
    });
  }
  out = () => {
    localStorage.clear()
    window.location.href = "/login";
  }



  onChange = (date, dateString) => {
    let arr = [];
    for (var i in dateString) {
      arr.push(dateString[i].label);
    }
    if (arr[1] === undefined) {
      this.setState({
        province: arr[0],
        city: '',
        area: '',
      })
    } else {
      if (arr[2] === undefined) {
        this.setState({
          province: arr[0],
          city: arr[1],
          area: '',
        })
      } else {
        if (arr[3] === undefined) {
          this.setState({
            province: arr[0],
            city: arr[1],
            area: arr[2],
          });
        }
      }
    }
  }

  schoolbtn = () => {
    this.props.form.validateFields({ force: true }, (error) => {
      if (!error) {
        schoolget([
          this.state.province,
          this.state.city,
          this.state.area,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
            console.log(res.data.schoolList[0])
            this.setState({
              dataSource: res.data.schoolList,
              num: res.data.schoolList.length,
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
        message.error("获取信息失败");
      }
    });
  }

  render() {
    const equipmentlook = () => {
      return localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER
    }
    const options = JSON.parse(localStorage.getItem('cascadedlocation'))

    const judgeRenderDataV = () => {
      return localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER || localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER
    }
    const { dataSource } = this.state;
    const columns = this.columns;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div id="schoolbody" >
        <Layout>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <div className="logo" />
            <div className="Lowalar-left">
              <Menu
                defaultSelectedKeys={['6']}
                defaultOpenKeys={['sub4']}
                mode="inline"
                theme="dark"
                inlineCollapsed={this.state.collapsed}
              >
                {
                  judgeRenderDataV() ? (
                    <div className="homepage" style={{ display: this.state.display10 }}>
                      <a href="http://datav.aliyun.com/share/d7d63263d774de3d38697367e3fbbdf7"
                        style={{ background: '#1890ff', color: 'white', display: "block", width: "100%", borderRadius: '5px' }}>总体信息预览</a>
                    </div>
                  ) : null
                }

                <SubMenu key="sub1" title={<span><Icon type="clock-circle-o" /><span>流程监控</span></span>}>
                  <Menu.Item key="1" style={{ display: this.state.display1 }}><Link to="/lowalarm">流量报警</Link></Menu.Item>
                  <Menu.Item key="2" style={{ display: this.state.display2 }}><Link to="/alarmsetting">流量报警设置</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title={<span><Icon type="edit" /><span>设备管理</span></span>}>
                  <Menu.Item key="3" style={{ display: this.state.display3 }}><Link to="/devInfo">设备在线查询</Link></Menu.Item>
                  <Menu.Item key="4" style={{ display: this.state.display4 }}><Link to="/management">设备管理</Link></Menu.Item>
                  <Menu.Item key="10" style={{ display: this.state.display10 }}><Link to="/equipmentlog">设备日志查询</Link></Menu.Item>
                </SubMenu>
                <SubMenu key="sub3" title={<span><Icon type="calendar" /><span>查询管理</span></span>}>
                  <Menu.Item key="5" style={{ display: this.state.display5 }}><Link to="/process">流程查询</Link></Menu.Item>
                </SubMenu>
                {
                  equipmentlook() ? (
                    <SubMenu key="sub4" title={<span><Icon type="warning" /><span>系统管理</span></span>}>
                      <Menu.Item key="6" style={{ display: this.state.display6 }}><Link to="/school">单位管理</Link></Menu.Item>
                      <Menu.Item key="7" style={{ display: this.state.display7 }}><Link to="/contact">区域联系人管理</Link></Menu.Item>
                      <Menu.Item key="8" style={{ display: this.state.display8 }}><Link to="/journal">操作日志查询</Link></Menu.Item>
                    </SubMenu>
                  ) : (
                      <SubMenu key="sub4" title={<span><Icon type="warning" /><span>系统管理</span></span>}>
                        <Menu.Item key="6" style={{ display: this.state.display6 }}><Link to="/school">单位管理</Link></Menu.Item>
                        <Menu.Item key="7" style={{ display: this.state.display7 }}><Link to="/contact">区域联系人管理</Link></Menu.Item>
                        <Menu.Item key="8" style={{ display: this.state.display8 }}><Link to="/journal">操作日志查询</Link></Menu.Item>
                        <Menu.Item key="9" style={{ display: this.state.display9 }}><Link to="/highset">高级设置</Link></Menu.Item>
                      </SubMenu>)
                }
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
              <span id="mytime" style={{ height: "100%", lineHeight: "64px", display: "inline-block", float: "left", borderRadius: '5px', color: '#333', marginLeft: '20px' }}></span>
              <span style={{ display: "inline-block", marginLeft: '20%', height: "100%", borderRadius: '5px', fontSize: '25px', fontWeight: 'bold' }}>中小学直饮水机卫生监管平台</span>
              <span style={{ float: 'right', height: '50px', lineHeight: "50px", marginRight: "2%", color: 'red', cursor: 'pointer' }} onClick={this.out}>退出</span>
              <div className="Administrator">
                <span></span>{localStorage.getItem('realname')}
              </div>
            </Header>
            <div className="nav">
              系统管理 / 单位管理
          </div>
            <div className="tit">
              单位管理
          </div>
            <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280, marginTop: '10px' }}>
              <div className="current">
                <div className="curr">
                  <div className="current_text">
                    <div className="current_textt">
                      位置选择:<Cascader disabled={this.state.disabled} value={[this.state.province, this.state.city, this.state.area, this.state.school,]} defaultValue={['zhejiang', 'hangzhou', 'xihu']} options={options} onChange={this.onChange} changeOnSelect style={{ marginLeft: '20px' }} />
                      <span style={{ float: 'right' }}>
                        <Button type="primary" style={{ marginRight: '10px', marginLeft: '20px' }} onClick={this.schoolbtn}>查询</Button>
                        <Button>重置</Button>
                        <Button type="primary" style={{ border: 'none', marginLeft: '20px' }}><Link to="/addschool">新建</Link></Button>
                      </span>
                    </div>
                    <div className="derive" >
                      <Icon type="info-circle-o" />
                      &nbsp; &nbsp;已加载<span style={{ marginLeft: 8, color: 'rgba(0, 51, 255, 0.647058823529412)', fontWeight: 'bold' }}>
                        {hasSelected ? `   ${selectedRowKeys.length}  ` : ''}
                      </span>条记录
                                列表记录总计： <span style={{ color: 'rgba(0, 51, 255, 0.647058823529412)', fontWeight: 'bold' }}>{this.state.num}</span> 条
                            {/* <Button type="primary" style={{ float: 'right', marginTop: '3px' }}>数据导出</Button> */}
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <Table dataSource={dataSource} columns={columns}
                        rowSelection={rowSelection} />
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

