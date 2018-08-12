$ready = function () {
  new Vue({
    el:'#app',
    data:{
      bills:[
        {icon:'jk-dingdan',text:'我也不知道写什么文件名称',color:''},
        {icon:'jk-feiyong',text:'随便写个吧',color:'#f00'},
        {icon:'jk-gongxu',text:'主要是看功能'},
        {icon:'jk-jiekuan',text:'能在线预览就最好了',color:''},
      ]
    },
    mounted:function () {
      frameSetbounces();
    },
    methods:{

    }
  })
}