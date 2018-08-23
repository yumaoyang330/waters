import React, { Component } from 'react';
import { Icon, Button } from 'antd';



class Heads extends Component {
  state = {
    collapsed: false,
  };
  toggle = () => {
    console.log(666)
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  out = () => {
    localStorage.clear()
    window.location.href = "/login";
  }

  render() {
    return (
      <div>
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
      </div>
    )
  }
}

export default Heads;