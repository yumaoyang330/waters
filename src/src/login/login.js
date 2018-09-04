import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox} from 'antd';
import { login } from "../axios";
import { createForm } from 'rc-form';
import { Link } from 'react-router-dom';
import './login.css';

const FormItem = Form.Item;

class logins extends Component {
  state={
    username:'',
    password:'',
    token:110,
  }
  login_btn = () => {
    console.log(1)
    this.setState({
      btn_disabled: true,
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        login([
          values.userName,
          values.password,
          this.state.token,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
            window.location.href = "/lowalarm/lowalarm";
            console.log(res.data.headimgurl)
          } else {
            if (res.data.result === 0) {
              alert("用户名不存在");
            }
            else if (res.data.result === 1) {
              alert("密码错误");
            } 
            this.setState({
              btn_disabled: false,
            });
          }
        });
      } else {
        alert("请填好所有选项");
        this.setState({
          btn_disabled: false,
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
          <a className="login-form-forgot" href="">忘记密码</a>
          <Button type="primary" htmlType="submit" className="login-form-button"  >
          <Link to="/home">登录</Link>
          </Button>
          <a href="" style={{display:'block',textAlign:'right'}}>联系管理员</a>
        </FormItem>
      </Form>
</div>    
    )
  }
}

export default logins = createForm()(logins);
