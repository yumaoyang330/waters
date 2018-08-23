import React,{Component} from 'react';
import { Icon, Menu } from 'antd';
import { Link } from 'react-router-dom';


const SubMenu = Menu.SubMenu;

class Layouts extends Component {
    state = {
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
    render() {
        return (
            <div>
                <SubMenu key="sub1" title={<span><Icon type="clock-circle-o" /><span>流程监控</span></span>}>
                    <Menu.Item key="1"><Link to="/lowalarm">流量报警</Link></Menu.Item>
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
            </div>
        )
    }
}

export default Layouts;