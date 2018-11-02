import React, { Component } from 'react';
import { Icon } from 'antd';



class Headers extends Component {
    state = {
        user: '',
        visible: false,
    };
    out = () => {
        window.location.href = "/login";
        localStorage.clear();
    }
    componentWillMount = () => {
        function showTime() {
            let nowtime = new Date();
            let year = nowtime.getFullYear();
            let month = nowtime.getMonth() + 1;
            let date = nowtime.getDate();
            document.getElementById("mytime").innerText = year + "年" + month + "月" + date + "日 " + nowtime.toLocaleTimeString();
        }
        setInterval(showTime, 1000);

    }
    render() {
        return (
            <div >
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
export default Headers;
