import http from './tools';
import * as config from './config';

//登录界面
export const login = (params) => http.post(config.requestIp + '/login', {
	token: localStorage.getItem('token'),
	username: params[0],
	password:params[1],
});


//获取当前用户权限内可以查阅到的省->市->区->单位级联菜单数据
export const gets = (params) => http.post(config.requestIp + '/cascadedlocation/get', {
	token: localStorage.getItem('token'),
});

//获取当前报警事件列表
export const querydevicelist = (params) => http.post(config.requestIp + '/alertmonitor/instantlertlist/get', {
	token: localStorage.getItem('token'),
	beginTime: params[0],
	endTime: params[1],
	province:params[2], 
	city:params[3],
	county:params[4],
	school:params[5],
	IMEI:params[6],
});

//获取历史报警事件列表
export const queryhistorylist = (params) => http.post(config.requestIp + '/alertmonitor/alertlist/get', {
	token: localStorage.getItem('token'),
	beginTime: params[0],
	endTime: params[1],
	province:params[2], 
	city:params[3],
	county:params[4],
	school:params[5],
	IMEI:params[6],
});

//编辑当前事件处理状态
export const updatestatus = (params) => http.post(config.requestIp + '/alertmonitor/alertlist/update', {
	token: localStorage.getItem('token'),
	key: params[0],
	process: params[1],	
});


//编辑设备列表的报警参数
export const updatealarm = (params) => http.post(config.requestIp + '/alertmonitor/flowalertsetting/update', {
	token: localStorage.getItem('token'),
	keyList: params[0],
	preAlertThreshold: params[1],	
	alertThreshold: params[1],
});


//3.1 设备在线查询
//3.1.0 查询该用户管辖内级联数据

//3.1.1 查询设备列表
export const equipmentget = (params) => http.post(config.requestIp + '/devicemanage/devicestatusquery/get', {
	token: localStorage.getItem('token'),
	province:params[0], 
	city:params[1],
	county:params[2],
	school:params[3],
	IMEI:params[4],
	offline:params[5],
});

//3.2.2 删除设备
export const equipmentdelete = (params) => http.post(config.requestIp + '/devicemanage/devicelist/delete', {
	token: localStorage.getItem('token'),
	key: params[0],
});

//3.2.3 新增设备
export const equipmentadd = (params) => http.post(config.requestIp + '/devicemanage/devicelist/add', {
	token: localStorage.getItem('token'),
	province:params[0], 
	city:params[1],
	county:params[2],
	school:params[3],
	location:params[4],
	type:params[5],
	content:params[6],
	preAlertThreshold:params[7],
	alertThreshold:params[8],
	initFlow:params[9],
	IMEI:params[10],
});

//4.查询管理
//4.1.0 获取该用户管辖内级联数据

//4.1.1 查询流程列表
export const processget = (params) => http.post(config.requestIp + '/querymanage/processquery/get', {
	token: localStorage.getItem('token'),
	beginTime: params[0],
	endTime: params[1],
	province:params[2], 
	city:params[3],
	county:params[4],
	school:params[5],
	IMEI:params[6],
});

//4.1.2 批量删除
export const deleterecord = (params) => http.post(config.requestIp + '/querymanage/deleterecord', {
	token: localStorage.getItem('token'),
	keyList: params[0],
});


//5.系统管理
//5.1.0 获取该用户管辖内级联数据
//5.1.1 查询用户数据列表
export const conactget = (params) => http.post(config.requestIp + '/accountmanage/regionalcontactmanage/get', {
	token: localStorage.getItem('token'),
	province: params[0],
	city:params[1], 
	county:params[2],	
	school:params[3],
	userName:params[4],
	phone:params[5],
	userType:params[6],	
});


//5.1.2 删除区域联系人记录
export const userdelete = (params) => http.post(config.requestIp + '/accountmanage/regionalcontactmanage/delete', {
	token: localStorage.getItem('token'),
	key: params[0],
});


//5.1.3 编辑用户数据列表
export const userupdate = (params) => http.post(config.requestIp + '/accountmanage/regionalcontactmanage/update', {
	token: localStorage.getItem('token'),
	key: params[0],
	province: params[1],
	city:params[2], 
	county:params[3],
	school:params[4],
	userName:params[5],
	password:params[6],
	phone:params[7],
	email:params[8],
	userType:params[9],	
});

//5.1.4 新增用户数据
export const insert = (params) => http.post(config.requestIp + '/accountmanage/regionalcontactmanage/insert', {
	token: localStorage.getItem('token'),
	userType: params[0],
	province: params[1],
	city:params[2], 
	county:params[3],
	school:params[4],
	realName:params[5],
	phone:params[6],
	email:params[7],
	userName:params[8],
	password:params[9],
	content:params[10],		
});


//5.2 学校网点管理
//5.2.1 获取目前已有的学校网点（依据当前用户的token权限进行判断）
export const schoolget = (params) => http.post(config.requestIp + '/schoolmanage/schoollist/get', {
	token: localStorage.getItem('token'),
	province: params[0],
	city:params[1], 
	county:params[2],	
});

//5.2.2 删除目前已有的学校网点
export const schooldelete = (params) => http.post(config.requestIp + '/schoolmanage/schoollist/delete', {
	token: localStorage.getItem('token'),
	key: params[0],
});

//5.2.3 新增学校网点
export const schooladd = (params) => http.post(config.requestIp + '/schoolmanage/schoollist/add', {
	token: localStorage.getItem('token'),
	province: params[0],
	city:params[1], 
	county:params[2],
	school:params[3],
	adminName:params[4],
	adminPhone:params[5],
	address:params[6],
	longitude:params[7],
	latitude:params[8],
});


//5.3操作日志查询
//5.3.1 查询操作日志列表
export const querylog = (params) => http.post(config.requestIp + '/accountmanage/logquery/get', {
	token: localStorage.getItem('token'),
	key: params[0],
	province: params[1],
	city:params[2], 
	county:params[3],
	school:params[4],
	realName:params[5],
	phone:params[6],
	email:params[7],
	userName:params[8],
	password:params[9],
	content:params[10],		
});


//5.3.2 删除日志
export const deletes = (params) => http.post(config.requestIp + '/accountmanage/logquery/delete', {
	token: localStorage.getItem('token'),
	key: params[0],
});


//5.4 修改平台通讯地址
export const changeplatformaddress = (params) => http.post(config.requestIp + '/uppersetting/changeplatformaddress', {
	token: localStorage.getItem('token'),
	address: params[0],
});