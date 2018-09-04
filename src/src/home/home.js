import React, { Component } from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { login } from "../axios";
import { Link } from 'react-router-dom';
import { createForm } from 'rc-form';
import $ from 'jquery';
import './home.css';
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import Highcharts3D from 'highcharts/highcharts-3d';
// import * as Highcharts from 'highcharts';
import * as Exporting from 'highcharts/modules/exporting';

const FormItem = Form.Item;
const myDate = new Date();




$(function() {
  Highcharts.setOptions({

      chart: {
        
          backgroundColor: {
              linearGradient: [0, 0, 500, 500],
              stops: [
                  [0, 'rgb(255, 255, 255)'],
                  [1, 'rgb(240, 240, 255)']
              ]
          },
          borderWidth: 2,
          plotBackgroundColor: 'rgba(255, 255, 255, .9)',
          plotShadow: true,
          plotBorderWidth: 1
      }
      
  });
  var chart1 = new Highcharts.Chart({
      chart: {
         type: 'spline',
          renderTo: 'container',
      },
      title: {
        text: '2014 某网站各浏览器浏览量占比'
},
tooltip: {
        headerFormat: '{series.name}<br>',
        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
},
plotOptions: {
        pie: {
                allowPointSelect: true,  // 可以被选择
                cursor: 'pointer',       // 鼠标样式
                dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                }
        }
},
series: [{
        type: 'pie',
        name: '浏览器访问量占比',
        data: [
                ['Firefox',   45.0],
                ['IE',       26.8],
                {
                        name: 'Chrome',
                        y: 12.8,
                        sliced: true,  // 默认突出
                        selected: true // 默认选中 
                },
                ['Safari',    8.5],
                ['Opera',     6.2],
                ['其他',   0.7]
        ]
}]
  });
 var chart3 = new Highcharts.Chart({
      chart: {
         type: 'spline',
          renderTo: 'container3',
      },
      title: {
        text: '各时段报警数量统计'
    },
    xAxis:{
      title:{
          text:'x轴标题'
      }
   },
   yAxis:{
      title:{
          text:'数量/个'
      }
   },
      xAxis: {
          type: 'datetime'
      },
      labels: {
        style: {                         // 标签全局样式
            color: "#ff0000",
            fontSize: '12px',
            fontWeight: 'normal',
            fontFamily: ''        
        }
    },
      series: [{
          data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
          pointStart: Date.UTC(2010, 0, 1),
          pointInterval: 3600 * 1000 // one hour
      }]
  });

  var chart2 = new Highcharts.Chart({
      chart: {
          renderTo: 'container2',
          type: 'column'
      },
      title: {
        text: '各校区报警数量统计'
    },
    xAxis:{
      title:{
          text:'x轴标题'
      }
   },
   yAxis:{
      title:{
          text:'数量/个'
      }
   },
      xAxis: {
          type: 'datetime'
      },
      series: [{
          data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
          pointStart: Date.UTC(2010, 0, 1),
          pointInterval: 3600 * 1000 // one hour
      }]
  });




});


class logins extends Component {
  state={
    username:'',
    password:'',
    token:110,
    time:myDate,
  }
  render() {
    return ( 
      <div id="homebody" >
       <div className="top">
        <span>2018/7/5 15:23</span>
        <span className="title">中小学直饮水机卫生监管平台</span> 
        <span> <Link to="/lowalarm">进入平台</Link></span>
       </div>
       <div>
       <div className="clearfix">
       <div id="container" style={{width:'30%',height:'400px',float:'left',marginLeft:'2.5%'}}></div>
       <div id="container1" style={{width:'30%',height:'400px',float:'left',marginLeft:'2.5%'}}></div>
       <div id="container2" style={{width:'30%',height:'400px',float:'left',marginLeft:'2.5%'}}></div>
       </div>
       <div id="container3" style={{height:'400px',marginTop:'20px'}}></div>
       {/* <div id="container3" style="min-width:400px;height:400px"></div> */}

       {/* <div id="container" style="height: 500px; min-width: 310px; max-width: 480px; margin: 0 auto"></div> */}
       {/* <div id="container" style="min-width:400px;height:400px"></div> */}
       </div>
      </div>    
    )
  }
}

export default logins = createForm()(logins);

