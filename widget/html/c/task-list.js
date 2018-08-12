$ready = function () {
  new Vue({
    el:'#app',
    data:{
      title:'产品目录推单',
      taskList:[
        {icon:'jk-dingdan',text:'新增产品编码审批表',color:''},
        {icon:'jk-feiyong',text:'计划信息备案表',color:'#f00'},
        {icon:'jk-gongxu',text:'外协业务信息备案表'},
        {icon:'jk-beiliao',text:'安全认证信息备案表',color:''},
        {icon:'jk-dingdan',text:'销售计划员备案表',color:''},
        {icon:'jk-feiyong',text:'保管员备案表',color:'#f00'},
        {icon:'jk-gongxu',text:'产品主研工程师备案表'},
        {icon:'jk-beiliao',text:'产品停产停用审批表',color:''},
        {icon:'jk-gongxu',text:'产品定价备案表'},
      ],
      taskData:{}
    },
    mounted:function () {
      frameSetbounces();
      this.taskData = gLocalData.get('pushTaskData')?JSON.parse(gLocalData.get('pushTaskData')) : {};
      // myConsole(this.taskData)
    },
    methods:{
      handleTask:function ( t , i ) {
        this.taskData.target = 'addProductCodeExamine';
        this.taskData.head = {
          type:1,
          user:'王伟刚',
          department:'信息',
          reason:'什么原因来着'
        };
        gLocalData.push('pushTaskData',this.taskData);
        if (i > 5) {
          changeTo('addProductCodeExamine',{
            title:'新增产品编码审批表'
          });
          return false;
        }
        changeTo('common-push-bill',{
          title:'新增产品编码审批表'
        })
      }
    }
  })
}