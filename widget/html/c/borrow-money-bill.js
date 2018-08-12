var _this;
var vm;
$ready = function () {
  vm = new Vue({
    el:'#app',
    data:{
      billHandled:{},
      type:'normal',
      /*更多菜单*/
      moreList:[],
      moreShow:false,
      moreParams:{},
      /*更多菜单结束*/
      /*单据select项*/
      workTypeArr:[
        {value:1,text:'销售'},
        {value:2,text:'寄售'},
        {value:3,text:'样品'},
      ],
      payTypeArr:[
        {value:'A',text:'现款'},
        {value:'B',text:'货到付款'},
        {value:'C',text:'信用额度'},
        {value:'D',text:'赊销'},
      ],

      /*单据select项结束*/
      isEdit:!1,
      bill:{},
      saveData:{},
      curd:true,
      /*数据项*/
      currentPageIndex:0,
      gt:true,
      beforePageIndex:-1,
      /*数据项*/
      billName:''
    },

    watch:{
      currentPageIndex:function () {
        this.gt = this.currentPageIndex > this.beforePageIndex;
        this.beforePageIndex = this.currentPageIndex;
      },
    },

    mounted:function () {
      _this = this;
      setTitle('借款单');
      this.checkCurd();
      this.initArgs();
      // this.getPostBillData();
      // this.initBill();
    },

    methods:{
      getMoneyUpper:function () {
        //大写金额
        if (this.bill && this.bill.head && this.bill.head.fLoanMoney)
          this.bill.head.cCapMoney = convertCurrency(this.bill.head.fLoanMoney);
      },
      /*数据项*/
      handlePage:function (index) {
        this.currentPageIndex = index;
      },

      /*数据项结束*/
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
      createBillItem:function(){
        var newBillItem = [];
        newBillItem =  this.bill.initList;
        return JSON.parse(JSON.stringify(newBillItem));
      },
      initBill:function() {
        this.currentPageIndex = 0;
        this.bill.head =  this.bill.head.map(function(val,index) {
          val.value = '';
          return val ;
        });

        if (this.bill.list) {
          var newBillList = [];
          newBillList[0] = this.bill.list[0].map(function(val,index) {
            val.value = '';
            return val;
          })
        }
        this.bill.list = newBillList;
      },
      saleBill:function () {
        return {
          head: {
            no: {type: 1, disabled: true},
            userNo: {
              type: 11, require: {
                field: 'userNo',
                  requireType:1,
                  rb: [
                  {rf: 'userNo'},
                  {rf: 'userName'}
                ]
              }
            },
            userName: {
              type: 11, require: {
                field: 'userNo',
                  requireType:1,
                  rb: [
                  {rf: 'userNo'},
                  {rf: 'userName'}
                ]
              }
            },
            address: {
              type: 11, require: {
                field: 'address',
                  requireType:1,
                  rb: [
                  {rf: 'address'},
                  {rf: 'sendType'}
                ]
              }
            },
            sendType: {
              type: 11, require: {
                field: 'address',
                  requireType:1,
                  rb: [
                  {rf: 'address'},
                  {rf: 'sendType'}
                ]
              }
            },
            workType: {type: 2, selectArr: _this.workTypeArr},
            repayType: {type: 2, selectArr: _this.repayTypeArr}
          },
          list:{
            supportType:{type:2,selectArr:this.supportTypeArr},
            baseCode:{
              type:11,
              require:{
                field:'baseCode',
                  requireType:2,
                  rb:[
                  {rf:'baseCode',bf:'code'},
                  {rf:'productName',bf:'text'}
                ]
              }},
            plantCode:{},
            productName:{
              type:11,
              require:{
                field:'baseCode',
                requireType:2,
                rb:[
                  {rf:'baseCode',bf:'code'},
                  {rf:'productName',bf:'text'}
                ]
              }
            },
            number:{type:1},
            unit:{type:1,disabled:true},
            standard:{type:1,disabled:true},
            priceTax:{type:1},
            price:{type:1},
            totalTax:{type:1,disabled:true},
            total:{type:1,disabled:true},
            tax:{type:1,disabled:true},
            taxRate:{type:1},
            requireDate:{type:4},
            preRate:{type:1},
            preMoney:{type:1},
            packet:{type:3},
            lifeStatus:{type:2,selectArr:this.lifeStatusArr}
          }
        }
      },

      getPostBillData:function() { // 接口数据
        var _this = this;
        var postObj = {"sLoginInfo":"","sBillName":"Bill_GL_Loan","iMainID":"-1"};
        this.getPostData(postObj,function (ret) {
          _this.bill = {head:ret.NewDataSet.ds};
        },function (err) {
          myConsole(err)
        },'http://192.168.80.69:8080/LoginService.asmx/GetBillInfo');
        // return false;
        // setTimeout(function () {
        //   _this.bill = {
        //     head:{
        //       cCode:'12315453',
        //       cPerName:'XXX',
        //       fLoanMoney:1200,
        //       cCapMoney:'',
        //       cPayType:1,
        //       cConBankName:'中国农业银行',
        //       cAccountName:'600266665999566',
        //       cCurrencyName:'泰铢',
        //       fExchRate:'啥啥原因',
        //       dPlanBackDate:'2018-06-15 16:30:30',
        //       cDate:'2018-07-15 16:30:30',
        //       TimeSTP:1550.22
        //     }}
        // },5000)


        //   initList:[
        //     {key:'wayBillNo',value:''},
        //     {key:'costType',value:''},
        //     {key:'totalTax',value:''},
        //     {key:'total',value:''},
        //     {key:'tax',value:''},
        //     {key:'isForeign',value:''},
        //     {key:'carrierName',value:''},
        //     {key:'carrierConfirm',value:''},
        //     {key:'remark',value:''}
        //   ],
        //   list:[
        //   ]
        // }
      },
      initData:function() {
        var postObj = {};
        this.getPostData(postObj,function (ret) {
          alertMy(ret)
        },function (err) {
          myConsole(err)
        })
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
      addBillItem:function () {
        var newBillItem = this.createBillItem();
        this.bill.list.push(newBillItem);
        this.currentPageIndex = this.bill.list.length - 1;
        this.handleBillData();
      },
      /*页面类型*/
      checkCurd:function () {
        if($_GET['curd'] && $_GET['curd'] !== undefined) {
          this.curd = $_GET['curd']
        } else {
          this.curd = true;
        }
        if(this.curd - 0 !== 0) {

        } else {
          setHeadRightBtn('refresh')
        }
      },
      delBillItem:function(selectPages) {
        var _this = this;
        _this.bill.list = _this.bill.list.filter(function(val,index) {
          var f = true;
          selectPages.forEach(function(v,i) {
            if (index === v.text - 1) {
              f = false;
              return f;
            }
          });
          return f;
        });
        this.handleBillData();
      },
      pickDataCallBack:function(backData) {
        var _this = this;
        if(backData.index < 0) { //表头
          //backdata默认值dataSource = 'bill'   headField = 'head'   sourceField = 字段名 backField 返回值
          _this.$set(_this[backData.dataSource][backData.headField],[backData.sourceField],backData.backField);
        } else { //表体
          //backdata默认值dataSource = 'bill'   listField = 'list'   sourceField = 字段名 backField 返回值
          this[backData.dataSource][backData.listField][backData.index-0].forEach(function (val,index) {
            if (val.key === backData.sourceField) {
              _this.$set(_this[backData.dataSource][backData.listField][backData.index-0][index],'value',backData.backField);
            }
          })
        }
      }

    }
  })
}
