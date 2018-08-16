import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox,Modal} from 'antd';
import { login } from "../axios";
import { createForm } from 'rc-form';
import { Link } from 'react-router-dom';
import './login.css';

const FormItem = Form.Item;


class logins extends Component {
  componentWillMount = () => {
    document.title = "登录页面";
    localStorage.clear();
  }
  state={
    username:'',
    password:'',
   visible: false ,
  }
  login_btn = () => {
    console.log(1)
    this.setState({
      btn_disabled: true,
    });
  };

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
  showModal = () => {
    console.log(1)
    this.setState({
      visible: true,
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        login([
          values.userName,
          values.password,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
            console.log(res.data)
            // console.log(res.data.cascadedlocation[0])
            // console.log(res.data.cascadedlocation[0].value)
            // console.log(res.data.cascadedlocation[0].children[0].value)
            // console.log(res.data.cascadedlocation[0].children[0].children[0].value)
            if(res.data.cascadedlocation[0].value===undefined){
              res.data.cascadedlocation[0].value=""
            }
            if(res.data.cascadedlocation[0].children[0].value===undefined){
              res.data.cascadedlocation[0].children[0].value=""
            }
            if(res.data.cascadedlocation[0].children[0].children[0].value===undefined){
              res.data.cascadedlocation[0].children[0].children[0].value=""
            }
            localStorage.setItem('token',res.data.token);
            localStorage.setItem('type',res.data.type);
            localStorage.setItem('realname',res.data.realName);
            localStorage.setItem('cascadedlocation',JSON.stringify(res.data.cascadedlocation));
            if(res.data.type===4){
              window.location.href = "/devInfo";
            }else{
              window.location.href = "/lowalarm";
            }
            
          }else{
            if (res.data.status === 0) {
              alert("不存在此用户");
            }
          if (res.data.status === 1) {
              alert("密码错误");
            } 
          }

        });
      }
    });
  } 
  render() {
    const { getFieldDecorator } = this.props.form;
    return ( 
      <div id="loginmbody" >
       <div className="title">中小学直饮水机卫生监管平台</div>
        <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
           <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="账号"/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>记住密码</Checkbox>
          )}
          <Button type="primary" htmlType="submit" className="login-form-button"  >
              登录
          </Button>
          <a  style={{display:'block',textAlign:'right'}}  onClick={this.showModal}>联系管理员</a>
          <Modal
            title="管理员信息"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p>姓名：</p>
            <p>联系电话：</p>
            <p>地址：</p>
          </Modal>
        </FormItem>
      </Form>
</div>    
    )
  }
}

export default logins = createForm()(logins);

