# rbac-audit-manager
基于rbac 审批流通用后台管理




//  用户集合：users
{
    "userId" : 1000001,//用户ID，自增长
    "userName" : "admin",//用户名称
    "userPwd" : "e10adc3949ba59abbe56e057f20f883e",//用户密码，md5加密
    "userEmail" : "admin@imooc.com",//用户邮箱
    "mobile":13788888888,//手机号
    "sex":0,//性别 0:男  1：女 
    "deptId":[ObjectId("")],//部门
    "job":"前端架构师",//岗位
    "state" : 1,// 1: 在职 2: 离职 3: 试用期
    "role": 0, // 用户角色 0：系统管理员  1： 普通用户
    "roleList" : [ObjectId("")], //系统角色
    "createTime" : ISODate("2021-01-17T13:32:06.381Z"),//创建时间
    "lastLoginTime" : ISODate("2021-01-17T13:32:06.381Z"),//更新时间
}

// 菜单集合：menus
{
		"menuType":1,//菜单类型 1:菜单 2:按钮
    "menuName":"系统管理",//菜单名称
    "menuCode":"",//菜单标识符，只有按钮类型才有，用于确定按钮权限
    "path":"/system",//菜单路由
    "icon":"el-icon-setting",//菜单图标
    "component":"",//组件地址
    "parentId":[null],//父菜单ID
}

// 部门集合：depts
{
    "parentId":[null],//父对象Id，一级部门默认为null
    "deptName":"前端开发部",
    "userId":1000001,//负责人，用户ID
    "userName":"Jack",//部门负责人
    "userEmail":"jack@163.com",//同上
}

// 角色集合：roles
{
    "roleName":"产品经理",//角色名称
    "remark":"产品专用",//备注信息
    "permissionList":{
    		"checkedKeys":[ObjectId("")],//选中的子菜单
    		"halfCheckedKeys":[ObjectId("")],//半选中的父菜单
    },//权限列表
}

// 自增集合：counters
{
	"_id":"userId",//增长字段
	"sequence_value":1000001//增长值
}

// 审批流集合：leaves
{
		"orderNo":"XJ2020030522001",//申请单号
		"applyType":1,//申请类型  1:事假 2：调休 3:年假
    "startTime":"2020-11-20 19:29:42",//开始时间
    "endTime":"2020-11-20 19:29:42",//结束时间
    "applyUser":{//申请人信息
    	"userId":1000001,
    	"userName":"Jack",
    	"userEmail":"admin@163.com"
    },
    "leaveTime":"2天",//休假时间
    "reason":"生病",//休假原因
    "auditUser":'BaiDu，Ali，JD，CaiWu',//完整审批人
    "curAuditUserName":"BaiDu",//当前审批人
    "applyState":1,// 1:待审批 2:审批中 3:审批拒绝 4:审批通过 5:作废
    "auditFlows":[//审批流
        {userId: 1000005, userName: "BaiDu", userEmail: "BaiDu@163.com"},
        {userId: 1000008, userName: "Ali", userEmail: "Ali@163.com"},
        {userId: 1000009, userName: "JD", userEmail: "JD@163.com"}
    ],
    "auditLogs":[
    		{
    			userId: 1000005, 
    			userName: "BaiDu", 
    			createTime: "2020-11-20 19:29:42",
    			remark"同意",
    			action:"审核通过"
    		},
    		{
    			userId: 1000008, 
    			userName: "Ali", 
    			createTime: "2020-11-20 19:29:42",
    			remark"同意",
    			action:"审核拒绝"
    		},
    ],
}


