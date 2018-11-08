import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox, Modal, message } from 'antd';
import { login } from "../axios";
import { createForm } from 'rc-form';
import { Link } from 'react-router-dom';
import './login.css';

const FormItem = Form.Item;


class logins extends Component {
  componentWillMount = () => {
    let url = window.location.href;
    url = url.split('=', 2);
    if (url[1] != '' && url[1] != null&& url[1] != undefined) {
      login([
        'scqwjs',
        '12345600',
      ]).then(res => {
        if (res.data && res.data.status === 1) {
          if (res.data.cascadedlocation[0].value === undefined) {
            res.data.cascadedlocation[0].value = ""
          }
          if (res.data.cascadedlocation[0].children[0].value === undefined) {
            res.data.cascadedlocation[0].children[0].value = ""
          }
          if (res.data.cascadedlocation[0].children[0].children[0].value === undefined) {
            res.data.cascadedlocation[0].children[0].children[0].value = ""
          }
          window.location.href = "/lowalarm";
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('type', res.data.type);
          localStorage.setItem('realname', res.data.realName);
          localStorage.setItem('cascadedlocation', JSON.stringify(res.data.cascadedlocation));
        }
      });
    }
    document.title = "登录页面";
    localStorage.clear();
  }
  state = {
    username: '',
    password: '',
    visible: false,
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
      if (values.userName === "") {
        message.error("请输入账号");
      }
      else if (values.password === "") {
        message.error("请输入密码");
      }
      if (!err) {
        login([
          values.userName,
          values.password,
        ]).then(res => {
          if (res.data && res.data.status === 1) {
            console.log(res.data.cascadedlocation)
            if (res.data.cascadedlocation[0].value === undefined) {
              res.data.cascadedlocation[0].value = ""
            }
            if (res.data.cascadedlocation[0].children[0].value === undefined) {
              res.data.cascadedlocation[0].children[0].value = ""
            }
            if (res.data.cascadedlocation[0].children[0].children[0].value === undefined) {
              res.data.cascadedlocation[0].children[0].children[0].value = ""
            }
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('type', res.data.type);
            localStorage.setItem('realname', res.data.realName);
            localStorage.setItem('cascadedlocation', JSON.stringify(res.data.cascadedlocation));
            if (res.data.type === 4) {
              window.location.href = "/devInfo";
            } else {
              window.location.href = "/lowalarm";
            }
          }
          else {
            if (res.data && res.data.status === 23) {
              message.error("不存在此用户");
            }
            if (res.data && res.data.status === 2) {
              message.error("密码错误");
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
        <img src="http://watersupervision.terabits.cn:7000/picture/logo.png" alt="" style={{ width: '10%', marginTop: "20px", marginLeft: '20px' }} />
        <div style={{ position: "absolute", top: "0", left: "0", right: '0', bottom: '0', height: '346px', margin: 'auto' }}>
          <Form onSubmit={this.handleSubmit} className="login-form" style={{ padding: '40px', background: 'white', borderRadius: '10px', paddingTop: '30px' }}>
            <div className="title">中小学直饮水机卫生监管平台</div>
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="账号" autocomplete="off" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码"  autocomplete="off"/>
              )}
            </FormItem>
            <FormItem style={{ marginBottom: '0' }} >
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>记住密码</Checkbox>
              )}
              <Button type="primary" htmlType="submit" className="login-form-button"  >
                登录
          </Button>
              {/* <a  style={{display:'block',textAlign:'right'}}  onClick={this.showModal}>联系管理员</a> */}
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
          <div className="footer" >
                主管单位:<img src={require('./foot1.png')} alt="" className="footimg" />上城区教育局&nbsp;&nbsp;&nbsp;&nbsp;
                监管单位:<img src={require('./foot2.png')} alt="" className="footimg" />上城区卫计监督所&nbsp;&nbsp;&nbsp;&nbsp;
                方案支持:<img src={require('./foot4.png')} alt="" className="footimg" />中国移动&nbsp;&nbsp;&nbsp;&nbsp;
                技术支持:<img src={require('./foot3.png')} alt="" className="footimg" />钛比科技&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        </div>

      </div>
    )
  }
}

export default logins = createForm()(logins);

