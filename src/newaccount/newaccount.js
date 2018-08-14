import React, { Component } from 'react';
import {  Icon, Button,Select,Table,Menu,Input,Layout,Cascader} from 'antd';
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import { insert } from "../axios";
import './newaccount.css';




const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
const Option = Select.Option;
const { TextArea } = Input;
const accounttype = ['学校管理员','学校滤芯维护人员','区级管理员','教育局检察员','超级管理员'];

class contact extends Component {
  state = {
    collapsed: false,
    size: 'small',
    province:'',
    city:'',
    area:'',
    school:'',
    name_value:'',
    usertype:'',
    remake:'',
    }

  componentWillMount = () => {
    document.title = "新建账号";
    function showTime(){
      let nowtime=new Date();
      let year=nowtime.getFullYear();
      let month=nowtime.getMonth()+1;
      let date=nowtime.getDate();
      document.getElementById("mytime").innerText=year+"年"+month+"月"+date+" "+nowtime.toLocaleTimeString();
    }
    
    setInterval(showTime,1000);



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
  }
  usertype=(value) =>{
    console.log(value)
    this.setState({
      usertype: value,
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
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  
  submit = () => {
    console.log
    let phone = document.getElementById('phone_num').value;
    let nameval = document.getElementById('name_val').value;
    let remake = document.getElementById('remake').value;
    var telrule = /^[1][3,4,5,7,8][0-9]{9}$/;
    var namerule = /^[\u4E00-\u9FA5A-Za-z]+$/;
    phone.toString();
    console.log(phone)
    this.props.form.validateFields({ force: true }, (error, fieldsValue) => {
      if (!telrule.test(phone)) {
        alert('您输入的手机号码不合法');
        return;
      }
      if (!namerule.test(nameval)) {
        alert('请输入您的真实姓名');
        return;
      }
      if (!error) {
        insert([
          this.state.usertype,
          this.state.province,
          this.state.city,
          this.state.area,
          this.state.school,
          fieldsValue["realname"],
          fieldsValue["username"],
          fieldsValue["password"],
          fieldsValue["tel_inf"],
          fieldsValue["emailvalue"],
          remake,
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

    const options = [{
      value: '浙江',
      label: '浙江',
      disabled:this.state.shpower,
      children: [{
        value: '杭州',
        label: '杭州',
        disabled:this.state.spower,
        children: [{
          value: '西湖区',
          label:  '西湖区', 
          disabled:this.state.qpower,
          children:[{
            value:"学军中学",
            label:"学军中学",
            disabled:this.state.xpower,
          }]     
        },{
          value: '上城区',
          label:  '上城区',
          disabled:this.state.qpower,
          children:[{
            value:'杭州十一中',
            label:'杭州十一中',
            disabled:this.state.xpower,
          },{
            value:'杭州市十中',
            label:"杭州市十中",
            disabled:this.state.xpower,
          },{
            value:'凤凰小学',
            label:"凤凰小学",
            disabled:this.state.xpower,
          },{
            value:'胜利小学',
            label:"胜利小学",
            disabled:this.state.xpower,
          }]
        }],
      }],
    }];


    const provinceOptions = accounttype.map(province => <Option key={province}>{province}</Option>);
    const { getFieldProps, getFieldError, getFieldDecorator } = this.props.form;
    return (   

      <div id="newaccountbody" >
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
            账号管理 / 区域联系人管理 / 新建账号
          </div>
          <div className="tit">
          新建账号
          </div>
        <Content style={{ margin: '24px 16px', background: '#fff', minHeight: 280,marginTop:'10px' }}>
          <div className="current">
            <div className="current_text">
                <div className="explain">
                  <div>
                    <span style={{color:'#000000'}}>尊敬的 </span>
                    <span style={{color:"#1890FF"}}>区域管理员</span>
                    <span style={{color:"#000000"}}> 你好，依据平台设定，您具有以下账号管理权限：</span>
                  </div>
                  <div className='explaintext'>
                  1.创建各饮水 <span style={{color:"#1890FF"}}>单位管理员</span> ，以添加他们获得水量预警信息、设备掉线信息。
                  他们将具有登录平台使用完整的<span style={{color:"#1890FF"}}> 流量监控</span> 模块、
                  完整的 <span style={{color:"#1890FF"}}>设备管理</span> 模块、完整的 <span style={{color:"#1890FF"}}>查询管理</span> 模块、部分的
                  <span style={{color:"#1890FF"}}>账号管理</span> 模块的权限，单位管理员 可创建 <span style={{color:"#1890FF"}}>产品维护员</span> 账号，
                  产品维护员可以使用流程监控的 <span style={{color:"#1890FF"}}>流量告警</span> 功能、
                  设备管理的 <span style={{color:"#1890FF"}}>设备在线查询</span> 功能，单位管理员与产品维护员在平台上的所有操作将计入 <span style={{color:"#1890FF"}}>系统日志</span>。
                  </div>
                </div>
                <div className="content">
                  <div  className='addinput'>
                        <span>账号类型：</span> 
                        <Select defaultValue={accounttype[0]} onChange={this.usertype} style={{width:'60%'}}>
                            {provinceOptions}
                        </Select>
                  </div> 
                  <div  className='addinput'>
                        <span>所属单位：</span> 
                        <Cascader defaultValue={['浙江']} options={options} onChange={this.onChange} changeOnSelect style={{width:"60%"}}/>
                  </div> 
                  <div  className='addinput'>
                        <span>姓名：</span> 
                        <Input placeholder="张三"  id="name_val"
                         {...getFieldProps("realname", {
                           rules: [
                             { required: true, message: "请输入姓名" },
                           ]
                         })}
                         clear
                         error={!!getFieldError("realname")}
                         onErrorClick={() => {
                           alert(getFieldError("realname").join("、"));
                         }}
                         placeholder="请输入姓名"
                         style={{ width:'60%' }}
                         ref={el => (this.autoFocusInst = el)}
                        
                        />
                  </div> 
                  <div  className='addinput'>
                        <span>手机：</span> 
                        <Input placeholder="123745758"  style={{width:'60%'}}
                        id="phone_num"
                        placeholder="请输入您的手机号"
                        data-seed="手机号"
                        value={this.state.phone}
                        {...getFieldProps("tel_inf", {
                        })}
                        ref={el => (this.autoFocusInst = el)}/>
                  </div> 
                  <div  className='addinput'>
                        <span>邮箱：</span> 
                        <Input placeholder="1234567890@qq.com" 
                          {...getFieldProps("emailvalue", {
                            rules: [
                              { required: true, message: "请输入邮箱" },
                            ]
                          })}
                          clear
                          error={!!getFieldError("emailvalue")}
                          onErrorClick={() => {
                            alert(getFieldError("emailvalue").join("、"));
                          }}
                          placeholder="请输入邮箱"
                          style={{ width:'60%' }}
                          ref={el => (this.autoFocusInst = el)}
                        />
                  </div>  
                  <div  className='addinput'>
                        <span>用户名：</span> 
                        <Input placeholder="aaa" 
                          {...getFieldProps("username", {
                            rules: [
                              { required: true, message: "请输入用户名" },
                            ]
                          })}
                          clear
                          error={!!getFieldError("username")}
                          onErrorClick={() => {
                            alert(getFieldError("username").join("、"));
                          }}
                          placeholder="请输入用户名"
                          style={{ width:'60%' }}
                          ref={el => (this.autoFocusInst = el)}
                        />
                  </div> 
                  <div  className='addinput'>
                        <span>初始密码：</span> 
                        <Input placeholder="123456" 
                          {...getFieldProps("password", {
                            rules: [
                              { required: true, message: "请输入密码" },
                            ]
                          })}
                          clear
                          error={!!getFieldError("password")}
                          onErrorClick={() => {
                            alert(getFieldError("password").join("、"));
                          }}
                          placeholder="请输入密码"
                          style={{ width:'60%' }}
                          ref={el => (this.autoFocusInst = el)}
                        />
                  </div>   
                  <div  className='addtextarea'>
                        备注：
                        <TextArea rows={4}  style={{marginTop:'20px'}}  id="remake"
                        placeholder="请输入备注（选填）" 
                        />
                  </div>  
                  <div className="btn">
                        <Button type="primary" style={{marginRight:'20px'}}  onClick={this.submit}>提交</Button>  
                         <Button><a href="">重置</a></Button>
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

