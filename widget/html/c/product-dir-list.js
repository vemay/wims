$ready = function () {
  new Vue({
    el:'#app',
    data:{
      dirArr:[
        {id:'1',name:'zhihu',text:'支护变更'},
        {id:'2',name:'zhihu',text:'钻机'},
        {id:'3',name:'zhihu',text:'泵类'},
        {id:'4',name:'zhihu',text:'钻具类'},
        {id:'5',name:'zhihu',text:'综采'},
        {id:'6',name:'zhihu',text:'采掘机械类'},
        {id:'7',name:'zhihu',text:'运输机械类'},
        {id:'8',name:'zhihu',text:'非矿山类设备'},
        {id:'9',name:'zhihu',text:'其他类'},
        {id:'y',name:'zhihu',text:'样品样机类'},
      ]
    },
    mounted:function () {
      frameSetbounces();
    },
    methods:{

    }
  })
}