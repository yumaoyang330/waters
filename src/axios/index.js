import http from './tools';
import React from 'react';
import { Redirect } from 'react-router-dom'
import * as config from './config';

// const url='http://112.124.6.31:9090';
// const url='http://192.168.31.158:9090';
const url='http://watersupervision.terabits.cn:9090';

//1.1登录界面
export const login = (params) => myapi(url + '/login', {
	username: params[0],
	password: params[1],
});


//2.1.0获取当前用户权限内可以查阅到的省->市->区->单位级联菜单数据
export const gets = (params) => myapi(url + '/cascadedlocation/get', {
	token: localStorage.getItem('token'),
});

//2.1.1获取当前报警事件列表
export const querydevicelist = (params) => myapi(url + '/alertmonitor/instantalertlist/get', {
	token: localStorage.getItem('token'),
	beginTime: params[0],
	endTime: params[1],
	province: params[2],
	city: params[3],
	county: params[4],
	school: params[5],
	deviceId: params[6],
});

//2.1.2编辑当前事件处理状态
export const updatestatus = (params) => myapi(url + '/alertmonitor/instantalertlist/update', {
	token: localStorage.getItem('token'),
	key: params[0],
	alertStatus: params[1],
	process: params[2],
});


//2.1.3获取历史报警事件列表
export const queryhistorylist = (params) => myapi(url + '/alertmonitor/historicalalertlist/get', {
	token: localStorage.getItem('token'),
	beginTime: params[0],
	endTime: params[1],
	province: params[2],
	city: params[3],
	county: params[4],
	school: params[5],
	deviceId: params[6],
});



//2.2流量报警设置
//2.2.0查询该用户管辖内级联数据

//2.2.1查询设备列表
export const querydevicelists = (params) => myapi(url + '/alertmonitor/flowalertsetting/get', {
	token: localStorage.getItem('token'),
	province: params[0],
	city: params[1],
	county: params[2],
	school: params[3],
	deviceId: params[4],
});

//2.2.2编辑设备列表的报警参数
export const updatealarm = (params) => myapi(url + '/alertmonitor/flowalertsetting/update', {
	token: localStorage.getItem('token'),
	keyList: params[0],
	preAlertThreshold: params[1],
	alertThreshold: params[2],
});


//3.1 设备在线查询
//3.1.0 查询该用户管辖内级联数据

//3.1.1 查询设备列表
export const equipmentget = (params) => myapi(url + '/devicemanage/devicestatusquery/get', {
	token: localStorage.getItem('token'),
	province: params[0],
	city: params[1],
	county: params[2],
	school: params[3],
	deviceId: params[4],
	offline: params[5],
});


//3.2设备管理
//3.2.1 查询设备列表
export const equipmentgets = (params) => myapi(url + '/devicemanage/devicelist/get', {
	token: localStorage.getItem('token'),
	province: params[0],
	city: params[1],
	county: params[2],
	school: params[3],
	deviceId: params[4],
});

//3.2.2 删除设备
export const equipmentdelete = (params) => myapi(url + '/devicemanage/devicelist/delete', {
	token: localStorage.getItem('token'),
	keyList: params[0],
});

//3.2.3 新增设备
export const equipmentadd = (params) => myapi(url + '/devicemanage/devicelist/add', {
	token: localStorage.getItem('token'),
	deviceInsertDTO: params,
});

//3.2.4 新增设备页面通过本批设备所属单位查询设备报警通知用户的信息以及维修通知用户的信息
export const getrespersoninfo = (params) => myapi(url + '/devicemanage/devicelist/add/getrespersoninfo', {
	token: localStorage.getItem('token'),
	province: params[0],
	city: params[1],
	county: params[2],
	school: params[3],
});


//3.2.5 查询设备消息日志
export const getdevicelog = (params) => myapi(url + '/devicemanage/devicelog/get', {
	token: localStorage.getItem('token'),
	province: params[0],
	city: params[1],
	county: params[2],
	school: params[3],
	beginTime: params[4],
	endTime: params[5],
	deviceId: params[6],
});

//3.3 移动端页面接口
export const getdevicepropsbydeviceid = (params) => myapi(url + '/mobile/getdevicepropsbydeviceid', {
	deviceId: params[0],
});


//3.4 检测报告
//3.4.1 检测报告查看
export const getlatestreportbydeviceid = (params) => myapi(url + '/report/getlatestreportbydeviceid', {
	token: localStorage.getItem('token'),
	deviceId: params[0],
});

//3.4.2 历史报告查看
export const gethistoricalreportbydeviceid = (params) => myapi(url + '/report/gethistoricalreportbydeviceid', {
	token: localStorage.getItem('token'),
	deviceId: params[0],
});


//3.4.3 检测报告新增
export const addreportbydeviceid = (params) => myapi(url + '/report/addreportbydeviceid', {
	token: localStorage.getItem('token'),
	deviceId: params[0],
	gmtcreate: params[1],
	testresult: params[2],
	testorg: params[3],
});



//4.查询管理
//4.1.0 获取该用户管辖内级联数据

//4.1.1 查询流程列表
export const processget = (params) => myapi(url + '/querymanage/processquery/get', {
	token: localStorage.getItem('token'),
	beginTime: params[0],
	endTime: params[1],
	province: params[2],
	city: params[3],
	county: params[4],
	school: params[5],
	deviceId: params[6],
});

//4.1.2 批量删除
export const deleterecord = (params) => myapi(url + '/querymanage/deleterecord', {
	token: localStorage.getItem('token'),
	keyList: params[0],
});


//5.系统管理
//5.1.0 获取该用户管辖内级联数据
//5.1.1 查询用户数据列表
export const conactget = (params) => myapi(url + '/accountmanage/regionalcontactmanage/get', {
	token: localStorage.getItem('token'),
	province: params[0],
	city: params[1],
	county: params[2],
	school: params[3],
	userName: params[4],
	phoneNumber: params[5],
	userType: params[6],
});


//5.1.2 删除区域联系人记录
export const userdelete = (params) => myapi(url + '/accountmanage/regionalcontactmanage/delete', {
	token: localStorage.getItem('token'),
	key: params[0],
});


//5.1.3 编辑用户数据列表
export const userupdate = (params) => myapi(url + '/accountmanage/regionalcontactmanage/update', {
	token: localStorage.getItem('token'),
	key: params[0],
	province: params[1],
	city: params[2],
	county: params[3],
	school: params[4],
	userName: params[5],
	password: params[6],
	phone: params[7],
	email: params[8],
	userType: params[9],
});

//5.1.4 新增用户数据
export const insert = (params) => myapi(url + '/accountmanage/regionalcontactmanage/insert', {
	token: localStorage.getItem('token'),
	userType: params[0],
	province: params[1],
	city: params[2],
	county: params[3],
	school: params[4],
	realName: params[5],
	userName: params[6],
	password: params[7],
	phone: params[8],
	email: params[9],
	content: params[10],
});


//5.2 学校网点管理
//5.2.1 获取目前已有的学校网点（依据当前用户的token权限进行判断）
export const schoolget = (params) => myapi(url + '/schoolmanage/schoollist/get', {
	token: localStorage.getItem('token'),
	province: params[0],
	city: params[1],
	county: params[2],
});

//5.2.2 删除目前已有的学校网点
export const schooldelete = (params) => myapi(url + '/schoolmanage/schoollist/delete', {
	token: localStorage.getItem('token'),
	keyList: params[0],
});

//5.2.3 新增学校网点
export const schooladd = (params) => myapi(url + '/schoolmanage/schoollist/add', {
	token: localStorage.getItem('token'),
	province: params[0],
	city: params[1],
	county: params[2],
	school: params[3],
	adminName: params[4],
	adminPhone: params[5],
	address: params[6],
	longitude: params[7],
	latitude: params[8],
});


//5.3操作日志查询
//5.3.1 查询操作日志列表
export const querylogs = (params) => myapi(url + '/accountmanage/logquery/get', {
	token: localStorage.getItem('token'),
	beginTime: params[0],
	endTime: params[1],
	province: params[2],
	username: params[3],
	userType: params[4],
	city: params[5],
	county: params[6],
	school: params[7],
});


//5.3.2 删除日志
export const deletes = (params) => myapi(url + '/accountmanage/logquery/delete', {
	token: localStorage.getItem('token'),
	keyList: params[0],
});


//5.4 修改平台通讯地址
export const changeplatformaddress = (params) => myapi(url + '/uppersetting/changeplatformaddress', {
	token: localStorage.getItem('token'),
	address: params[0],
});

async function myapi(url, param) {
	const res = await http.post(url, param);
	if (res.data.status === 0) {
		// return <Redirect to={"/login"}/>
		// window.location.href = "/login";
	}
	else return res;
	// return http.post(url,param);	
}