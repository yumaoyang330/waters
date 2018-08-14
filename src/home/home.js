// import React, { Component } from 'react';
// import { Form, Icon, Input, Button, Cascader } from 'antd';
// import { login } from "../axios";
// import { Link } from 'react-router-dom';
// import { createForm } from 'rc-form';
// import { Map, Marker } from 'react-amap';
// import $ from 'jquery';
// import './home.css';
// import Highcharts from 'highcharts/highstock';


// const styleC = {
//     background: `url('http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png')`,
//     backgroundSize: 'contain',
//     backgroundRepeat: 'no-repeat',
//     backgroundPosition: 'center',
//     width: '30px',
//     height: '40px',
//     color: '#000',
//     textAlign: 'center',
//     lineHeight: '40px'
//   }


// const FormItem = Form.Item;
// const myDate = new Date();
// const position = { longitude: 120.113906, latitude:30.24691 };
// const options = [{
//     value: 'zhejiang',
//     label: '浙江省',
//     children: [{
//       value: 'hangzhou',
//       label: '杭州市',
//       children: [{
//         value: 'xihu',
//         label: '西湖区',
//         children:[{
//           value: 'shidai',
//           label: '时代小学',
//         }]
//       }],
//     }],
//   }, {
//     value: 'jiangsu',
//     label: '江苏省',
//     children: [{
//       value: 'nanjing',
//       label: '南京市',
//       children: [{
//         value: 'zhonghuamen',
//         label: '中华门',
//       }],
//     }],
//   }];
// const mapEvents = 
//   {
//   created: (mapInstance) => {
//     console.log(mapInstance);
//   },
//   click: (longitude) => {
//     position.longitude=longitude.lnglat.Q;
//     position.latitude=longitude.lnglat.N;
//     console.log(position.longitude);
//     console.log(position.latitude);
//     console.log('You clicked map');
//   },
// }
// function onChange(date, dateString) {
//     console.log(date,dateString);

//   }








// const YOUR_AMAP_KEY='076cb00b4c9014e47f9b19e1da93daca';

// $(function() {
//   Highcharts.setOptions({

//       chart: {
        
//           backgroundColor: {
//               linearGradient: [0, 0, 500, 500],
//               stops: [
//                   [0, 'rgb(255, 255, 255)'],
//                   [1, 'rgb(240, 240, 255)']
//               ]
//           },
//           borderWidth: 2,
//           plotBackgroundColor: 'rgba(255, 255, 255, .9)',
//           plotShadow: true,
//           plotBorderWidth: 1
//       }
      
//   });




// Highcharts.theme = {
//   colors:['#058DC7','#50B432','#ED561B','#DDDF00','#24CBE5','#64E572',
//            '#FF9655','#FFF263','#6AF9C4'],
//   chart:{
//     backgroundColor: {
//           linearGradient:[0,0,500,500],
//           stops:[
//               [0,'rgb（255,255,255）'],
//               [1,'rgb（240,240,255）']
//           ]
//       },
//   },
//   title:{
//     style:{
//       color:'white',
//       font:'bold 16px“Trebuchet MS”,Verdana,sans-serif'
//       }
//   },
//   legend:{
//       itemStyle:{
//           font:'9pt Trebuchet MS,Verdana,sans-serif',
//           color:'white'
//       },
//       itemHoverStyle:{
//           color:'gray'
//       }   
//   }
// };
// //应用主题
// Highcharts.setOptions(Highcharts.theme);


// var chart3 = new Highcharts.Chart({
     
//       chart: {
//          type: 'spline',
//           renderTo: 'container3',  
//           // backgroundColor:'rgb(86, 96, 123)'
//       },
//       title: {
//         text: '各时段用水量统计'
// },
// yAxis: {
//         title: {
//                 text: '用水量/L',
//         },
//         plotLines:[{
//           color:'red',           //线的颜色，定义为红色
//           dashStyle:'solid',     //默认值，这里定义为实线
//           value:3,               //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
//           width:2                //标示线的宽度，2px
//       }]
// },
// legend: {
//         layout: 'vertical',
//         align: 'right',
//         verticalAlign: 'middle'
// },
// plotOptions: {
//         series: {
//                 label: {
//                         connectorAllowed: false
//                 },
//                 pointStart: 2010
//         },
//       //   line: {
//       //     dataLabels: {
//       //         enabled: true,
//       //         formatter: function() {
//       //             return this.x + "   " + this.y;
//       //         },
//       //         // format: "{x}      {y}"
//       //     }
//       // }
// },
// credits:{
//   enabled: false // 禁用版权信息
// },
// series: [{
//         name: '周平均用水量',
//         data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
//         dashStyle: 'longdash',
//         symbolHeight:16,
// }, {
//         name: '月平均用水量',
//         data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
// }, {
//         name: '季度平均用水量',
//         data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
// }, {
//         name: '年平均用水量',
//         data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
// }],
// responsive: {
//         rules: [{
//                 condition: {
//                         maxWidth: 500
//                 },
//                 chartOptions: {
//                         legend: {
//                                 layout: 'horizontal',
//                                 align: 'center',
//                                 verticalAlign: 'bottom'
//                         }
//                 }
//         }]
// }
//   });

  
// //   var chart2 = new Highcharts.Chart({
// //       chart: {
// //           renderTo: 'container2',
// //           type: 'column'
// //       },
// //       title: {
// //         text: '报警维护情况简介'
// //     },
// //     xAxis:{
// //       title:{
// //           text:'x轴标题'
// //       }
// //    },
// //    yAxis:{
// //       title:{
// //           text:'数量/个'
// //       }
// //    },
// //     xAxis: {
// //         type: 'datetime'
// //     },
// //     series: [{
// //         data: [1, 3, 0, 2, 2, 4, 1, 0, 2, 1, 1, 0],
// //         pointStart: Date.UTC(2010, 0, 1),
// //         pointInterval: 3600 * 1000 // one hour
// //     }]
// //   });




// });
// window.onload = function(){    
//     var speed=30; //数字越大速度越慢
//     var tab=document.getElementById("demo");
//     var tab1=document.getElementById("demo1");
//     var tab2=document.getElementById("demo2");
//     tab2.innerHTML=tab1.innerHTML; //克隆demo1为demo2
//     // console.log(tab2.offsetTop) //576
//     // console.log(tab.scrollTop)
//     // console.log(tab1.offsetHeight)
//     function Marquee(){
//     if(tab2.offsetTop-tab.scrollTop<=0){//当滚动至demo1与demo2交界时
//         // console.log(tab.scrollTop)
//         // console.log(111)
//         tab.scrollTop+=tab1.offsetHeight
//     }  //demo跳到最顶端   
//     else{
//         // console.log(tab.scrollTop)
//         // console.log(tab2.offsetTop-tab.scrollTop)
//         // console.log(222)

//         tab.scrollTop++;
//     }
//     }
//     var MyMar=setInterval(Marquee,speed);
//     tab.onmouseover=function() {clearInterval(MyMar)};//鼠标移上时清除定时器达到滚动停止的目的
//     tab.onmouseout=function() {MyMar=setInterval(Marquee,speed)};//鼠标移开时重设定时器   
//     setTimeout(Marquee, 2000); 

    
//     function changeColor(){
//       var color="#0f0|#00f|#880|#808|#088|yellow|green|blue";
//       color=color.split("|");
//       document.getElementById("blink").style.color=color[parseInt(Math.random() * color.length)];
//       }
//       setInterval(changeColor,500);

//     var speed=50
//     var colee2=document.getElementById("colee2");
//     var colee1=document.getElementById("colee1");
//     var colee=document.getElementById("colee");
//     colee2.innerHTML=colee1.innerHTML
//     colee.scrollTop=colee.scrollHeight
//     function Marquee2(){
//     if(colee1.offsetTop-colee.scrollTop>=0)
//     colee.scrollTop+=colee2.offsetHeight
//     else{
//     colee.scrollTop--
//     }
//     }
//     var MyMar2=setInterval(Marquee2,speed)
//     colee.onmouseover=function() {clearInterval(MyMar2)}
//     colee.onmouseout=function() {MyMar2=setInterval(Marquee2,speed)}


//     setInterval("document.getElementById('timenow').innerHTML =new Date().toLocaleString();", 1000);
// }


// class logins extends Component {
// constructor() {
//     super();
//     // Good Practice
//     this.mapCenter = { longitude: 120.175573,latitude: 30.25539 };
//     this.markerPosition = {longitude: 120.175573,latitude: 30.25539 };
//     }
//   state={
//     username:'',
//     password:'',
//     token:110,
//     time:myDate,
//   }
//   componentWillMount = () => {
//     document.title = "平台展示页";
//   }

//   render() {
//     return ( 
//       <div id="homebody" >
//        <div className="top">
//         <span className="current" id="timenow"></span>
//         <span className="title">中小学直饮水机卫生监管平台</span> 
//         <span> <Link to="/lowalarm">进入平台</Link></span>
//        </div>
//        <div>
//        <div className="clearfix">
//        <div id="container" style={{width:'30%',height:'500px',float:'left',marginLeft:'2.5%'}}>
//             <h3  style={{textAlign:'center',fontSize:'20px',color:'white'}}>24小时报警情况总览</h3>
//             <h4 style={{fontWeight:'bold',color:'#f46e65',marginBottom:'20px',textAlign:'center'}}>今日报警总量：<span className="En">08</span></h4>
//             <div id="demo" style={{overflow:'hidden',height:'400px',width:'100%'}}>
//             <div id="demo1">
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1051 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1052 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1053 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1054 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1055 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1056 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1057 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1058 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1059 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1060 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1061 </p>
//             </div>
//             <div id="demo2"></div>
//             </div>
//        </div>
//        <div id="container1" style={{width:'30%',height:'500px',float:'left',marginLeft:'2.5%',paddingTop:"2%"}}>
//             <div style={{width:'100%',height:'300px'}} >
//                 <Map 
//                     amapkey={YOUR_AMAP_KEY}
//                     events={mapEvents}
//                     center={this.mapCenter}
//                     zoom={20}
//                     >
//                     <Marker  position={{longitude:120.179335, latitude: 30.219246}}  >
                        
//                     </Marker>
//                     <Marker  position={{longitude: 120.181391248024, latitude: 30.24845048169603}}  >
                        
//                         </Marker>
//                     <Marker  position={{longitude:120.160833, latitude: 30.302786}}  >
                        
//                         </Marker>
//                     <Marker position={{longitude: 120.175573,latitude: 30.25539}} >
//                         <div style={styleC}>{this.state.value}</div>
//                     </Marker>
//                     {/* <Marker position={{longitude: 120.180424, latitude:30.24845048169603 }} >
//                         <div>{this.state.value} 杭州时代小学</div>
//                     </Marker> */}
//                 </Map>
//              </div>
//              <div className="maintext" id="blink">总体概况: 本设备总共安装于<span>4</span>个学校，总共安装<span>4</span>台设备,设备运行整体良好，最近24小时，累计报警<span>3</span>台设备，其中已修复
//              <span>2</span>台，剩余<span>2</span>台设备仍在维修中！</div>
//        </div>
//        <div id="container2" style={{width:'30%',height:'500px',float:'left',marginLeft:'2.5%'}}>      
//             <h3  style={{textAlign:'center',fontSize:'20px',color:'white'}}>24小时维护情况统计</h3>
//             <h4 style={{fontWeight:'bold',color:'#f46e65',marginBottom:'20px',textAlign:'center'}}>今日累计维护：<span >10</span></h4>
//             <div id="colee" style={{overflow:'hidden',height:'400px',width:'100%'}}>
//             <div id="colee1">
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1051 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1052 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1053 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1054 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1055 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1056 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1057 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1058 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1059 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1060 </p>
//                     <p>时间： 22:05:00 | 用户：浙大玉泉校区 | 编号：1061 </p>
//             </div>
//             <div id="colee2"></div>
//             </div>
//        </div>
//        </div>
//        <div id="container3" style={{height:'400px',marginTop:'20px'}}></div>
//        </div>
//       </div>    
//     )
//   }
// }



// export default logins = createForm()(logins);

