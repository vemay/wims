$ready = function () {
  new Vue({
    el:'#app',
    data:{
      fieldsArr:[
        {name:'text',text:'产品名称'},
        {name:'type',text:'产品品种名称'},
        {name:'unit',text:'主计量单位'},
        {name:'struct',text:'结构定额'},
        {name:'initStandard',text:'出厂质量执行标准'},
        {name:'lifeStatus',text:'生命周期状态'},
        {name:'basePrice',text:'产品底价'},
        {name:'initPrice',text:'出厂价'},
        {name:'supportGulp',text:'供货渠道'},
        {name:'minInterest',text:'产品底价毛利率'},
        {name:'requireDetail',text:'必填项缺失明细'}
      ],
      moreList:[
        {name:'查询',fn:'do-query'},
        {name:'推单',fn:'do-push'}
      ],
      fieldsChecked:[{name:'type',text:'产品品种名称'}],
      hots:[
        {id:'11',text:'三通轴变更'},
        {id:'12',text:'手把架总成变更'}
      ],
      groups:[
        {text:'气动顶锚杆钻机变更'},
        {text:'气动顶锚杆钻机'},
        {text:'临时支护'},
        {text:'混凝土喷射机'},
        {text:'液压顶锚杆钻机'},
        {text:'张拉机具及辅具'},
        {text:'其他支具机具'},
        {text:'测试'}
      ],
      dirArrTmp:[],
      dirArr:[
        {id:'11',name:'zhihu',text:'三通轴变更',type:'气动顶锚杆钻机变更',standard:'1102C-02C',code:'X000066 I-04',date:'2018-05-03',initPrice:'25.0000',basePrice:'10.0000',unit:'台',lifeStatus:'常规',initStandard:'I-113X1133--1'},
        {id:'12',name:'zhihu',text:'手把架总成变更',type:'气动顶锚杆钻机变更',standard:'1102C-02C',code:'X000066 I-04',date:'2018-05-03',price:'25.0000',basePrice:'10.0000',unit:'台',lifeStatus:'停用',initStandard:'I-113X1133--1'},
        {id:'13',name:'zhihu',text:'气手柄',type:'气动顶锚杆钻机',standard:'1102C-02C',code:'X000066 I-04',date:'2018-05-03',initPrice:'25.0000',basePrice:'10.0000',unit:'台',lifeStatus:'常规',initStandard:'I-113X1133--1'},
        {id:'14',name:'zhihu',text:'支架',type:'临时支护',standard:'1102C-02C',code:'X000066 I-04',date:'2018-05-03',initPrice:'25.0000',basePrice:'10.0000',unit:'台',lifeStatus:'常规',initStandard:'I-113X1133--1'},
        {id:'15',name:'zhihu',text:'支架－部件',type:'临时支护',standard:'1102C-02C',code:'X000066 I-04',date:'2018-05-03',initPrice:'25.0000',basePrice:'10.0000',unit:'台',lifeStatus:'常规',initStandard:'I-113X1133--1'},
        {id:'16',name:'zhihu',text:'支架－部件-零件',type:'临时支护',standard:'1102C-02C',code:'X000066 I-04',date:'2018-05-03',initPrice:'25.0000',basePrice:'10.0000',unit:'台',lifeStatus:'常规',initStandard:'I-113X1133--1'},
      ],
      dirCheckedArr:[],
      pAttr:''
    },
    computed:{
      searchData:function() {
        return this.dirArr;
      }
    },
    mounted:function () {
      this.dirArrTmp = this.dirArr;
      this.pAttr = 'text';
      this.openQueryFrame();
      sendEventToWin('setTitle',{
        title:'支护变更'
      })
    },
    methods:{
      openQueryFrame:function () {
        api.openFrame({
          name: 'dir-query',
          url: 'dir-query.html',
          bgColor:'rgba(0,0,0,0.6)',
          rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
          },
          animation:{
            type:'fade',
            subType:'from_right',
            duration:100
          },
          pageParam: {
            name: 'test'
          }
        });
      },
      doQuery:function () {
        changeTo('view-plan')
      },
      doPush:function () {
        var _this = this;
        var taskData = {
            target:'task-list',
            products:_this.dirCheckedArr,
            fields:_this.fieldsArr
        };

        gLocalData.push('pushTaskData',taskData);
        changeTo('task-list')
      },

      pickGroup:function (val,index) {
        var _this = this;
        this.dirCheckedArr = []; //清空已选项
        this.dirArr = this.dirArrTmp.filter(function(v,i) {
          if (index === -1) {
            return true;
          }
          return v.type === val['text'];
        })
      },
      doSearch:function(val,keyword){
        var _this = this;
        this.dirArr = this.dirArrTmp.filter(function(v,i) {
          var f = false;
          for (var attr in v ) {
            if (v[attr].indexOf(keyword) >= 0) {
              f = true;
              return true;
            }
          }
          return f;
        })
      },
      fieldChecked:function (val) {
        var _this = this;
        this.fieldsChecked = val;
      },
      viewDetail:function(dir) {
        changeTo('view-dir-detail')
      }
    }
  })
}