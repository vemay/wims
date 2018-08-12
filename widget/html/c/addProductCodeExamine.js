var _this;
var vm;
$ready = function () {
  vm = new Vue({
    el:'#app',
    data:{
      type:'normal',
      showHandle:true,
      status:'',
      startTime:'',
      endTime:'',
      moreList:[],
      moreShow:false,
      moreParams:{},
      headFieldsArr:[
        {
          name:'recordType',
          text:'备案类型',
          type:2,
          getSearch:0,
          searchArg:{},
          selectArr:[
            {name:'新增',id:1},
            {name:'变更',id:2},
          ]
        },
        {
          name:'department',
          text:'申请部门',
          type:1,
          getSearch:1,
          searchArg:{},
        },
        {
          name:'user',
          text:'申请人',
          type:1,
          getSearch:1,
          searchArg:{},
        },
        {
          name:'reason',
          text:'申请原因',
          type:1,
          getSearch:0,
          searchArg:{},
        },

      ],
      fieldsArr:[
         /*
        * type: 1 普通input 2 下拉列表 3 时间选择
        *
        * */
         {name:'type',
           text:'产品品种名称',
           type:1,
           getSearch:1,
           searchArg:{}
         },
         {name:'unit',
           text:'主计量单位',
           type:1,
           getSearch:1,
           searchArg:{}
         },
         {name:'lifeStatus',
           text:'标准供货周期',
           type:2,
           getSearch:0,
           searchArg:{},
           selectArr:[
             {name:'常规',id:1},
             {name:'停产',id:2},
             {name:'缺货',id:3}
           ]
         },
         {
           name:'initStandard',
           text:'出厂质量执行标准',
           type:1,
           getSearch:0,
         }
         // {name:'unit',text:'主计量单位',type:1,getSearch:1,searchArg:{},selectArr:[]},
         // {name:'struct',text:'结构定额'},
         // {name:'initStandard',text:'出厂质量执行标准'},
         // {name:'lifeStatus',text:'生命周期状态'},
         // {name:'basePrice',text:'产品底价'},
         // {name:'initPrice',text:'出厂价'},
         // {name:'supportGulp',text:'供货渠道'},
         // {name:'minInterest',text:'产品底价毛利率'},
         // {name:'requireDetail',text:'必填项缺失明细'}
       ],
      isEdit:true,
      bills:{},
      saveData:{},
      curd:true,
      /*推单*/
      pushTaskData:{}
    },

    mounted:function () {
      _this = this;
      this.pushTaskData = JSON.parse(gLocalData.get('pushTaskData'));
      // myConsole(this.pushTaskData);
      // myConsole(this.fieldsArr[0])
      frameSetbounces();
      this.checkCurd();
      this.initArgs();
      this.initBill();
      this.getBillsData();
      this.pickData();
    },

    methods:{
      initArgs:function() {
        this.type = $_GET['type'] || 'normal';
        switch (this.type) {
          case 'check':
            // this.moreShow = false;
            break;
          default:
            break;
        }
      },
      createNewItem:function(){
        return {
        }
      },
      initBill:function() {
        this.bills = {
          head:{
            no: '',
            user: '',
            address: '河北石家庄',
            sendType: '汽运',
            workType: 2,
            repayType: 2
          },
          billList: []
        }
      },
      getBillsData:function() {
        this.bills = {
          head:{
            type: '',
            user: '',
            department: '',
            reason:''
          },
          billList: []
        };
        this.bills.head = this.pushTaskData.head;
        this.bills.billList = this.pushTaskData.products;
      },
      /*更多操作*/
      listclick:function(btn) {
        this.status = btn.name;
      },
      add:function() {
        this.initBill();
        this.isEdit = true;
      },
      giveup:function() {
        var  _this = this;
        dialogAlert({
          type:'confirm',
          content:'确定要放弃所做更改吗'
        },function(ret) {
          if (ret.eventType === 'right') {
            _this.reload();
          }
        })
      },
      submit:function() {
        dialogAlert({content:'提交成功'},function(){
          _this.reload();
        })
      },
      update:function () {
        this.isEdit = true;
      },
      /*更多操作结束*/
      addNewItem:function () {
        this.bills.billList.push(this.createNewItem());
        this.bills.billList.push(this.createNewItem());
      },
      /*时间操作*/
      requireDateFocus:function(index) {
        setDateTime(null,this.getRequireDate,{index:index})
      },

      getRequireDate:function (str,params) {
        this.$set(this.bills.billList[params.index],'requireDate',str);
      },

      /*时间操作结束*/
      /*翻页*/
      listenSwipe:function() {
        addEventListenerW('swipeleft',function(ret) {
          windowToast('下一条')
        })
        addEventListenerW('swiperight',function(ret) {
          windowToast('上一条')
        })
      },
      /*页面类型*/
      checkCurd:function () {
        if($_GET['curd'] && $_GET['curd'] !== undefined) {
          this.curd = $_GET['curd']
        } else {
          this.curd = true;
        }
        if(this.curd - 0 !== 0) {
          this.listenSwipe();
        } else {
          setHeadRightBtn('refresh')
        }
      },
      delBill:function(data) {
        var _this = this;
        if (this.isEdit) {
          dialogAlert({
            type:'confirm',
            content:'确认要删除该条数据吗'
          },function(ret) {
            if (ret.eventType === 'right') {
              _this.bills.billList.splice(data.index,1);
            }
          })
        }
      },
      pickData:function(dataPage,index,field) {
        index = index ? index : index === 0 ? 0 : -1;
        var resource = api.frameName;
        changeTo(dataPage,{
          resource:resource,
          index:index,
          field:field
        });
        addEventListenerW('pickdata',function(ret){
          var data = ret.value.data;
          if (ret.value.resource === resource) {
            if (ret.value.index < 0) { //表头
              _this.bills.head[ret.value.field] = data.name;
            } else {
              //表体
              _this.$set(_this.bills.billList[ret.value.index],ret.value.field,data.name)
            }
          }
        })
      }
    }
  })
}