   // 使用 Mock
   import Mock from 'mockjs';

   // 配置拦截 ajax 的请求时的行为，支持的配置项目有 timeout。
   Mock.setup({
       timeout: '200 - 400'
   })

   // Mock响应模板
   Mock.mock('/data',{
           'list|10':[{
            'jibie|+1':1,// 序号 属性值自动加 1，初始值为 1
            'equipment':/\d{1,10}/,// 商户ID
            'flow|1':['标准版','企业版','试用版'],// 产品版本 随机选取 1 个元素
            'liuliang':/\d{1,10}/,// 门店编码
            'age':'@cname',// 门店名称
            'jd|1':['试用','使用','续用'],//状态 随机选取 1 个元素
            'address':'@date("MM-dd hh:mm")',// 有效日期
           }]
   })
Mock.mock(/devicemanage\/devicestatusquery\/get/,function(res){
   
})
//    Mock.mock(/\/todoList.mock/,{
//     'code':0,
//        '/data':{
//            'list|10':[{
//             'jibie|+1':1,// 序号 属性值自动加 1，初始值为 1
//             'equipment':/\d{1,10}/,// 商户ID
//             'flow|1':['标准版','企业版','试用版'],// 产品版本 随机选取 1 个元素
//             'liuliang':/\d{1,10}/,// 门店编码
//             'age':'@cname',// 门店名称
//             'jd|1':['试用','使用','续用'],//状态 随机选取 1 个元素
//             'address':'@date("MM-dd hh:mm")',// 有效日期
//            }]
//         },
//         'message':'操作成功',
//         'systemDate':new Date().getTime()
//    })