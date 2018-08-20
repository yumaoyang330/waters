import React, { Component } from 'react';
import './mobile.css';
import {Toast } from 'antd-mobile';
import { getdevicepropsbydeviceid } from '../axios';


export default class Devicedisplay extends Component{

    constructor(props) {
        super(props);
        this.state = {
            school: '',
            imei: '',
            type: '',
            location:'',
            editingKey: '',
            keylist: "",
            dataSource:'',
            province:'',
            city:'',
            area:'',
            school:'',
            lastTime:'',
            instantFlow:'',
            alertThreshold:'',
            IMEI:'666',
          };

    }

    componentWillMount=() => {
        document.title="设备信息展示";
        let url = window.location.href;
        url = url.split('=', 2);
        url = url[1].split('&', 2);

        getdevicepropsbydeviceid([
            url[0]
        ]).then(res => {
            if (res.data && res.data.status === 1) {
            console.log(res.data.mobileInfo)
            this.setState({
                school:res.data.mobileInfo.school,
                imei:res.data.mobileInfo.imei,
                type:res.data.mobileInfo.type,
                location:res.data.mobileInfo.location,
                filterProvider:res.data.mobileInfo.filterProvider,
                name:res.data.mobileInfo.resPerson.name,
                organization:res.data.mobileInfo.resPerson.organization,
                phone:res.data.mobileInfo.resPerson.phone,
                alertThreshold:res.data.mobileInfo.alertThreshold,
                instantFlow:res.data.mobileInfo.instantFlow,
                lastTime:res.data.mobileInfo.lastTime,
                alertStatus:res.data.mobileInfo.alertStatus,
              },function(){
                  if(this.state.alertStatus===2){
                     this.setState({
                        color:'red',
                        weight:"bold",
                        size:'18px'
                     })
                  }
              });  
               
            } else if (res.data && res.data.status === 0) {
            Toast.fail("鉴权失败，需要用户重新登录");
            } else if (res.data && res.data.status === 2) {
            Toast.fail("参数提取失败");
            } else if (res.data && res.data.status === 3) {
            Toast.fail("服务器故障，请刷新再试");
            }
        });
    }

    
    render(){
        return(
            <div style={{height: document.body.scrollHeight,width:"100%",background:'#47C2FF'}}>
            <div id="mainbody" >
                <div className="main" >
                    <div className="banner">
                    </div>
                    <div className="title">
                        <img src={require('./tit.png')} alt="" style={{width:'8%',verticalAlign:"center",marginRight:'.1rem'}}/>
                        设备信息
                    </div>
                    <div className="list">
                        <li>所属单位：  <span  style={{float:"right"}}>{this.state.school}</span></li>
                        <li>品牌型号：  <span  style={{float:"right"}}>{this.state.type}</span></li>
                        <li>品牌编号：  <span  style={{float:"right"}}>{this.state.imei}</span></li>
                        <li>位置信息：  <span  style={{float:"right"}}>{this.state.location}</span></li>
                        <li>供应商&nbsp;&nbsp;&nbsp;：  <span  style={{float:"right"}}>{this.state.filterProvider}</span></li>
                        <li>额定总进水量：  <span  style={{float:"right"}}>{this.state.alertThreshold}</span></li>
                    </div>
                    <div className="title">
                        <img src={require('./tit2.png')} alt="" style={{width:'8%',verticalAlign:"center",marginRight:'.1rem'}}/>
                        滤芯更换状况
                    </div>
                    <div className="list">
                        <li>滤芯上次维护时间：  <span  style={{float:"right"}}>{this.state.lastTime}</span></li>
                        <li>目前用水量：<span  style={{float:"right",color:this.state.color,fontWeight:this.state.weight,fontSize:this.state.size}}>{this.state.instantFlow}</span></li>
                    </div>
                    <div className="title">
                        <img src={require('./tit3.png')} alt="" style={{width:'8%',verticalAlign:"center",marginRight:'.1rem'}}/>
                        饮用水检测信息
                    </div>
                    <div className="list" style={{borderBottom:'none'}}>
                        <li>最新一次检测时间：  <span  style={{float:"right"}}></span></li>
                        <li>检测结果&nbsp;&nbsp;&nbsp;：<span  style={{float:"right"}}></span></li>
                        <li>检测单位&nbsp;&nbsp;&nbsp;：<span  style={{float:"right"}}>上城区疾控中心</span></li>
                    </div>
                </div>
                <div className="footer">
                <div className="foot">
                主管单位:<img src={require('./foot1.png')} alt="" className="footimg" />上城区教育局
                <span style={{width:'1px',height:'.2rem',background:'white',marginLeft:'.1rem',marginRight:'.1rem'}} className="shu"></span>
                监管单位:<img src={require('./foot2.png')} alt=""  className="footimg"/>上城区卫计监督所
                </div>
                <div  className="foot">
                技术支持:<img src={require('./foot3.png')} alt="" className="footimg"/>钛比科技
                </div>
                </div>
            </div>
            </div>
        )
    }
}