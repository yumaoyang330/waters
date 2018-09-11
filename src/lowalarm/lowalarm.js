import React, { Component } from 'react';
import { Icon, Button, Tabs, Select, DatePicker, Table, Menu, Cascader, Modal, Layout, Row, Col, Popconfirm, InputNumber, Form, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import { querydevicelist, gets, queryhistorylist, updatestatus, deleterecord } from '../axios';
import './../mock/mock';
import moment from 'moment';
import './lowalarm.css';
import statustext from './../status'
import statusnum from './../statusnum'
import alerts from './../alerts'
import adminTypeConst from '../config/adminTypeConst';
import Layouts from '../component/layout';





var now = new Date();
var date = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
var hour = date.getHours();
var minute = date.getMinutes();
var second = date.getSeconds();


var date1 = new Date();
var year1 = date1.getFullYear();
var month1 = date1.getMonth() + 1;
var day1 = date1.getDate();
var hour1 = date1.getHours();
var minute1 = date1.getMinutes();
var second1 = date1.getSeconds();



const statustypes = ['未处理', '处理完成'];
const myDate = new Date();
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { RangePicker } = DatePicker;

var nowMonth = myDate.getMonth(); //当前月 
var nowYear = myDate.getFullYear()
const begtime = new Date(nowYear, nowMonth, 1);
function handleBlur() {
  console.log('blur');
}

// function handleFocus() {
//   console.log('focus');
// }
const dateFormat = 'YYYY/MM/DD HH:mm:ss';


const data = [];
const number = 0;
for (let i = 0; i < 0; i++) {
  data.push({
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



class lowalarm extends Component {

  state = { visible: false }
  showModal = (key) => {
    for (var i = 0; i < this.state.datas.length; i++) {
      if (this.state.datas[i].key === key) {
        this.setState({
          visible: true,
          phone: this.state.datas[i].resPerson.phone,
          name: this.state.datas[i].resPerson.name,
          email: this.state.datas[i].resPerson.email
        });
      }
    }
  }
  showModals = (key) => {
    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].key === key) {
        this.setState({
          visible: true,
          phone: this.state.data[i].resPerson.phone,
          name: this.state.data[i].resPerson.name,
          email: this.state.data[i].resPerson.email
        });
      }
    }
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
        school: '',
      })
    } else {
      if (arr[2] === undefined) {
        this.setState({
          province: arr[0],
          city: arr[1],
          area: '',
          school: '',
        })
      } else {
        if (arr[3] === undefined) {
          this.setState({
            province: arr[0],
            city: arr[1],
            area: arr[2],
            school: '',
          });
        } else {
          this.setState({
            province: arr[0],
            city: arr[1],
            area: arr[2],
            school: arr[3],
          });
        };
      }
    }
  }
  timeonChange = (data, dateString) => {
    this.setState({
      begintime: dateString[0],
      endtime: dateString[1],
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
    const statusOptions = statustypes.map(type => <Option key={type}>{type}</Option>);
    this.columns1 = [
      {
        title: '设备编号',
        dataIndex: 'deviceId',
      },{
        title: '所属单位',
        dataIndex: 'siteName',
      }, {
        title: '设备位置',
        dataIndex: 'location',
      }, {
        title: '流量大小',
        dataIndex: 'flow',
      }, {
        title: '报警级别',
        dataIndex: 'alertStatus',
      }, {
        title: '处理阶段',
        dataIndex: 'process',
        render: (text, record, index) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <Select defaultValue={[text]} onChange={this.handleChange} disabled={false} >
                  {statusOptions}
                </Select>
              ) : (
                  <Select defaultValue={[text]} onChange={this.handleChange} disabled={true} >
                    {statusOptions}
                  </Select>
                )
              }</div>
          )
        }
      }, {
        title: '责任人',
        dataIndex: 'resPerson.name',
      }, {
        title: '责任人联系方式',
        keys: 'x',
        render: (text, record, index) =>
          <div>
            <a onClick={() => this.showModal(record.key)}
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
            </Modal>
          </div>
      }, {
        title: '报警时间',
        dataIndex: 'gmtCreate',
      }, {
        title: '总流量',
        dataIndex: 'totalFlow',
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: '15%',
        render: (text, record, index) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.key, index)}
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
                  <a onClick={(index) => this.edit(record.key, index)} disabled={this.state.ztbj}>编辑状态</a>
                )}
            </div>
          );
        },
      }];

    this.columns = [{
      title: '设备编号',
      dataIndex: 'deviceId',
    },{
      title: '所属单位',
      dataIndex: 'siteName',
    }, {
      title: '设备位置',
      dataIndex: 'location',
    }, {
      title: '流量大小',
      dataIndex: 'flow',
    }, {
      title: '报警级别',
      dataIndex: 'alertStatus',
    }, {
      title: '处理阶段',
      dataIndex: 'process',
    }, {
      title: '责任人',
      dataIndex: 'resPerson.name',
    }, {
      title: '责任人联系方式',
      dataIndex: '',
      key: 'x',
      render: (text, record, index) =>
        <div>
          <a onClick={() => this.showModals(record.key)}
          >详情</a>
          <Modal
            title="联系方式"
            maskStyle={{ background: "black", opacity: '0.1' }}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            mask={false}
          >
            <p>姓名:{this.state.name}</p>
            <p>电话:{this.state.phone}</p>
            <p>邮箱:{this.state.email}</p>
          </Modal>
        </div>
    }, {
      title: '报警时间',
      dataIndex: 'gmtCreate',
    }];
  }

  handleChange = (date, dateString) => {
    console.log(date)
    this.setState({
      statustext: date,
      statusnum: statustext[date],
      selecttype: statusnum[date],
    });
  }
  getdqlist = () => {
    const dqbh = document.getElementById('dqimei').value;
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
            for (var i = 0; i < res.data.alertEventList.length; i++) {
              if (res.data.alertEventList[i].process === 0) {
                res.data.alertEventList[i].process = "未处理"
              }
              if (res.data.alertEventList[i].process === 2) {
                res.data.alertEventList[i].process = "正在处理"
              }
              if (res.data.alertEventList[i].process === 3) {
                res.data.alertEventList[i].process = "处理完成"
              }

              if (res.data.alertEventList[i].alertStatus === 1) {
                res.data.alertEventList[i].alertStatus = "预报警"
              }
              if (res.data.alertEventList[i].alertStatus === 2) {
                res.data.alertEventList[i].alertStatus = "报警"
              }
            }
            this.setState({
              datas: res.data.alertEventList,
              num1: res.data.alertEventList.length,
            });
          } else {
            message.error("获取信息失败");
          }
        });
      } else {
        message.error("获取接口失败");
      }
    });
  }

  getlslist = () => {
    const lsbh = document.getElementById('lsimei').value;
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
            for (var i = 0; i < res.data.alertEventList.length; i++) {
              if (res.data.alertEventList[i].process === 0) {
                res.data.alertEventList[i].process = "未处理"
              }
              if (res.data.alertEventList[i].process === 2) {
                res.data.alertEventList[i].process = "正在处理"
              }
              if (res.data.alertEventList[i].process === 3) {
                res.data.alertEventList[i].process = "处理完成"
              }
              if (res.data.alertEventList[i].alertStatus === 0) {
                res.data.alertEventList[i].alertStatus = "预报警"
              }
              if (res.data.alertEventList[i].alertStatus === 1) {
                res.data.alertEventList[i].alertStatus = "预报警"
              }
              if (res.data.alertEventList[i].alertStatus === 2) {
                res.data.alertEventList[i].alertStatus = "报警"
              }
              this.setState({
                data: res.data.alertEventList,
                num: res.data.alertEventList.length,
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
  }

  edit(key, text, record, index) {
    console.log(key)
    for (var i = 0; i < this.state.datas.length; i++) {
      if (this.state.datas[i].key === key) {
        console.log(this.state.datas[i].process)
        console.log(statusnum[this.state.datas[i].process])
        this.setState({
          selecttype: statusnum[this.state.datas[i].process],
        });
      }
    }
    this.setState({
      editingKey: key,
      statustype: false,
    });
  }
  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };

  save(form, key) {
    for (var i = 0; i < this.state.datas.length; i++) {
      if (this.state.datas[i].key === key) {
        this.setState({
          statustype: true,
          alertStatus: alerts[this.state.datas[i].alertStatus],
        });
      }
    }
    this.setState({
      statustype: true,
    });
    const newData = [...this.state.datas];
    const index = newData.findIndex(item => key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item
      });
      this.setState({
        datas: newData, editingKey: '',
        email: newData[index].email,
      }, () => {
        console.log(newData[0])
        this.props.form.validateFields({ force: true }, (error) => {
          if (!error) {
            console.log(this.state.selecttype)
            if (this.state.selecttype === '3') {
              this.setState({
                alertStatus: '0',
              },function(){
                updatestatus([
                  key,
                  this.state.alertStatus,
                  this.state.selecttype,
                ]).then(res => {
                  if (res.data && res.data.status === 1) {
                    message.success("信息编辑成功");
                    this.setState({
                      statustype: true,
                    });
                    setTimeout(() => {
                      window.location.href = "/lowalarm";
                    }, 1000);
                  } else {
                    message.error("信息编辑失败");
                    this.setState({
                      statustype: false,
                    });
                  }
                });
              });
            }else{
              updatestatus([
                key,
                this.state.alertStatus,
                this.state.selecttype,
              ]).then(res => {
                if (res.data && res.data.status === 1) {
                  message.success("信息编辑成功");
                  this.setState({
                    statustype: true,
                  });
                  // setTimeout(() => {
                  //   window.location.href = "/lowalarm";
                  // }, 1000);
                } else {
                  message.error("信息编辑失败");
                  this.setState({
                    statustype: false,
                  });
                }
              });
            }  
          } else {
            message.error("获取接口失败");
            this.setState({
              statustype: false,
            });
          }
        });

      });
    } else {
      newData.push(this.state.datas);
      this.setState({ datas: newData, editingKey: '' });
    }
  }
  cancel = () => {
    this.setState({
      editingKey: '',
      statustype: true,
    });
  };

  componentWillMount = () => {
    console.log(localStorage.getItem('type'))
    console.log(data.cascadedlocation)
    if (data.cascadedlocation === undefined) {
      this.setState({

      });
    }
    document.title = "流量报警";
    function showTime() {
      let nowtime = new Date();
      let year = nowtime.getFullYear();
      let month = nowtime.getMonth() + 1;
      let date = nowtime.getDate();
      document.getElementById("mytime").innerText = year + "年" + month + "月" + date + " " + nowtime.toLocaleTimeString();
    }
    setInterval(showTime, 1000);

    this.state = {
      collapsed: false,
      keylist: '',
      datas: '',
      size: 'small',
      num: number,
      selecttype: '',
      num1: number,
      name: '1',
      email: '2',
      phone: '3',
      disabled: false,
      selectedRowKeys: [],
      selectedRowKeys1: [],
      endtime: year1 + '-' + month1 + '-' + day1 + ' ' + hour1 + ':' + minute1 + ':' + second1,
      begintime: year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second,
      statustype: true,
      data, editingKey: '',
      lsbegin: begtime,
      lsend: myDate,
      province: '',
      city: '',
      area: '',
      school: '',
      disabledpro: true,
      display1: '',
      display2: '',
      display3: '',
      display4: '',
      display5: '',
      display6: '',
      display7: '',
      display8: '',
      display9: '',
      process: '',
    };

    this.props.form.validateFields({ force: true }, (error) => {

      if (!error) {
        gets([
          localStorage.getItem('token'),
        ]).then(res => {
          if(localStorage.getItem('token')===null){
            window.location.href = "/login";
          }
          if (res.data && res.data.status === 1) {
            this.setState({
              province: res.data.cascadedlocation[0].value,
              city: res.data.cascadedlocation[0].children[0].value,
              area: res.data.cascadedlocation[0].children[0].children[0].value,
              school: res.data.cascadedlocation[0].children[0].children[0].children[0].value,
            });
            if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER) {
              this.setState({
                city: '',
                area: '',
                school: '',
              });
            }
            if (localStorage.getItem('type') === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER) {
              this.setState({
                school: '',
              });
            }
            this.props.form.validateFields({ force: true }, (error) => {
              if (!error) {
                querydevicelist([
                  this.state.begintime,
                  this.state.endtime,
                  res.data.cascadedlocation[0].value,
                  this.state.city,
                  this.state.area,
                  this.state.school,
                  '',
                ]).then(res => {
                  if (res.data && res.data.status === 1) {
                    for (var i = 0; i < res.data.alertEventList.length; i++) {
                      if (res.data.alertEventList[i].process === 0) {
                        res.data.alertEventList[i].process = "未处理"
                      }
                      if (res.data.alertEventList[i].process === 2) {
                        res.data.alertEventList[i].process = "正在处理"
                      }
                      if (res.data.alertEventList[i].process === 3) {
                        res.data.alertEventList[i].process = "处理完成"
                      }
                      if (res.data.alertEventList[i].alertStatus === 1) {
                        res.data.alertEventList[i].alertStatus = "预报警"
                      }
                      if (res.data.alertEventList[i].alertStatus === 2) {
                        res.data.alertEventList[i].alertStatus = "报警"
                      }
                      this.setState({
                        datas: res.data.alertEventList,
                        num1: res.data.alertEventList.length,
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


            if (!error) {
              queryhistorylist([
                this.state.lsbegin,
                this.state.lsend,
                this.state.province,
                this.state.city,
                this.state.area,
                this.state.school,
                '',
              ]).then(res => {
                if (res.data && res.data.status === 1) {

                  for (var i = 0; i < res.data.alertEventList.length; i++) {
                    if (res.data.alertEventList[i].process === 0) {
                      res.data.alertEventList[i].process = "未处理"

                    }
                    if (res.data.alertEventList[i].process === 2) {
                      res.data.alertEventList[i].process = "正在处理"
                    }
                    if (res.data.alertEventList[i].process === 3) {
                      res.data.alertEventList[i].process = "处理完成"
                    }

                    if (res.data.alertEventList[i].alertStatus === 1) {
                      res.data.alertEventList[i].alertStatus = "预报警"
                    }
                    if (res.data.alertEventList[i].alertStatus === 2) {
                      res.data.alertEventList[i].alertStatus = "报警"
                    }
                    this.setState({
                      data: res.data.alertEventList,
                      num: res.data.alertEventList.length,
                    });
                  }
                } else {
                  message.error("获取信息失败");
                }
              });
            } else {
              message.error("获取接口失败");
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
                ztbj: true,
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
        message.error("获取接口失败");

      }
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
  out = () => {
    localStorage.clear()
    window.location.href = "/login";
  }
  render() {
    console.log()
    const options = JSON.parse(localStorage.getItem('cascadedlocation'))
    const { selectedRowKeys } = this.state;
    const {
      dataSource,
      loading,
      pagination,
    } = this.props;

    const paginationProps = {
      simple: false,
      ...pagination,
    }
    // paginationProps.showTotal=()=>{
    //   return '共' +pagination.total+'条'
    //   this.setState({
    //     num1:pagination.total,
    //   });
    // }

    const { selectedRowKeys1 } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const judgeRenderDataV = () => {
      return localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_COUNTY_MANAGER || localStorage.getItem("type") === adminTypeConst.ADMIN_TYPE_SUPER_MANAGER
    }
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
                <SubMenu key="sub4" title={<span><Icon type="warning" /><span>系统管理</span></span>}>
                  <Menu.Item key="6" style={{ display: this.state.display6 }}><Link to="/school">单位管理</Link></Menu.Item>
                  <Menu.Item key="7" style={{ display: this.state.display7 }}><Link to="/contact">区域联系人管理</Link></Menu.Item>
                  <Menu.Item key="8" style={{ display: this.state.display8 }}><Link to="/journal">操作日志查询</Link></Menu.Item>
                  <Menu.Item key="9" style={{ display: this.state.display9 }}><Link to="/highset">高级设置</Link></Menu.Item>
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
              <span id="mytime" style={{ height: "100%", lineHeight: "64px", display: "inline-block", float: "left", borderRadius: '5px', color: '#333', marginLeft: '20px' }}></span>
              <span style={{ display: "inline-block", marginLeft: '20%', height: "100%", borderRadius: '5px', fontSize: '25px', fontWeight: 'bold' }}>中小学直饮水机卫生监管平台</span>
              <span style={{ float: 'right', height: '50px', lineHeight: "50px", marginRight: "2%", color: 'red', cursor: 'pointer' }} onClick={this.out}>退出</span>
              <div className="Administrator">
                <span></span>{localStorage.getItem('realname')}
              </div>

            </Header>
            <div className="nav">
              流程监控 / 流量报警
        </div>
            <div className="tit">
              报警查询
        </div>
            <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280, marginTop: '10px' }}>
              <div className="current">
                <div className="curr">
                  <Tabs onChange={this.tabchange} type="card">
                    <TabPane tab="当前" key="1">
                      <div className="current_text">
                        <div className="current_textt">
                          位置选择:<Cascader disabled={this.state.disabled} value={[this.state.province, this.state.city, this.state.area, this.state.school,]} options={options} onChange={this.onChange} changeOnSelect style={{ marginLeft: '20px' }} />
                        </div>
                        <div className="current-time">
                          时间选择:
                              <RangePicker
                            style={{ marginLeft: '20px', marginRight: '20px' }}
                            defaultValue={[moment(this.state.begintime, dateFormat), moment(this.state.endtime, dateFormat)]}
                            format={dateFormat}
                            ranges={{ 今天: [moment().startOf('day'), moment().endOf('day')], '本月': [moment().startOf('month'), moment().endOf('month')] }}
                            onChange={this.endtimeonChange}
                            disabled
                          />
                          设备编号:<Input placeholder="请输入设备编号" style={{ width: '10%', marginLeft: '10px' }} id="dqimei" />
                          <span style={{ float: 'right' }}>
                            <Button type="primary" onClick={this.getdqlist} style={{ marginRight: '10px' }}>查询</Button>
                            <Button onClick={this.get}>重置</Button>
                          </span>
                        </div>
                        <div className="derive">
                          <Icon type="info-circle-o" />
                          &nbsp; &nbsp;已选择<span style={{ marginLeft: 8, color: 'rgba(0, 51, 255, 0.647058823529412)', fontWeight: 'bold' }}>
                            {hasSelecteds ? `   ${selectedRowKeys1.length}  ` : ''}
                          </span>条记录
                                列表记录总计： <span style={{ color: 'rgba(0, 51, 255, 0.647058823529412)', fontWeight: 'bold' }}>{this.state.num1}</span> 条
                            {/* <Button type="primary" style={{ float: 'right', marginTop: '3px' }}>数据导出</Button> */}
                        </div>
                        <div style={{ marginTop: '10px' }}>
                          <Table rowSelection={rowSelection1} columns={columns1} dataSource={this.state.datas} pagination={paginationProps} />
                        </div>
                      </div>
                    </TabPane>
                    <TabPane tab="历史" key="2">
                      <div className="current_text">
                        <div className="current_textt">
                          位置选择:<Cascader disabled={this.state.disabled} value={[this.state.province, this.state.city, this.state.area, this.state.school,]} options={options} onChange={this.onChange} changeOnSelect style={{ marginLeft: '20px' }} />
                        </div>
                        <div className="current-endtime" style={{ marginTop: '10px', height: '40px', lineHeight: '40px' }}>
                          时间选择:
                              <RangePicker
                            style={{ marginLeft: '20px', marginRight: '20px' }}
                            defaultValue={[moment().startOf('month'), moment(this.state.endtime, dateFormat)]}
                            format={dateFormat}
                            ranges={{ 今天: [moment().startOf('day'), moment().endOf('day')], '本月': [moment().startOf('month'), moment().endOf('month')] }}
                            onChange={this.timeonChange}
                          />
                          设备编号:<Input placeholder="请输入设备编号" style={{ width: '10%', marginLeft: '10px' }} id="lsimei" />
                          <span style={{ float: 'right' }}>
                            <Button type="primary" onClick={this.getlslist} style={{ marginRight: '10px' }}>查询</Button>
                            <Button onClick={this.get}>重置</Button>
                          </span>
                        </div>
                        <div className="derive">
                          <Icon type="info-circle-o" />
                          &nbsp; &nbsp;已加载<span style={{ marginLeft: 8, color: 'rgba(0, 51, 255, 0.647058823529412)', fontWeight: 'bold' }}>
                            {hasSelected ? `   ${selectedRowKeys.length}  ` : ''}
                          </span>条记录
                                列表记录总计： <span style={{ color: 'rgba(0, 51, 255, 0.647058823529412)', fontWeight: 'bold' }}>{this.state.num}</span> 条
                            {/* <Button type="primary" style={{ float: 'right', marginTop: '3px' }}>数据导出</Button> */}
                        </div>
                        <div style={{ marginTop: '10px' }}>
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

