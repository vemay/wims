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
      repayTypeArr:[
        {value:1,text:'现款'},
        {value:2,text:'货到付款'},
        {value:3,text:'信用额度'},
        {value:4,text:'赊销'},
      ],
      supportTypeArr:[
        {value:1,text:'常规'},
        {value:2,text:'选装'},
        {value:3,text:'订单改制'},
        {value:4,text:'订单定制'},
      ],
      lifeStatusArr:[
        {value:1,text:'正常'},
        {value:2,text:'缺货'},
        {value:3,text:'预订'},
      ],
      costTypeArr:[
        {value:1,text:'运保费'},
        {value:2,text:'装卸费'},
        {value:3,text:'其他用'}
      ],
      /*单据select项结束*/
      isEdit:true,
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
      isEdit:function() {
        this.handleBillData();
      }
    },
    mounted:function () {
      _this = this;
      // myConsole(this.headFieldsArr)
      // this.billName = 'saleBill';
      this.billName = 'yunzaConfirmBill';
      this.checkCurd();
      this.initArgs();
      this.initAttachData();
      this.getPostBillData();
      // this.initBill();
    },

    methods:{
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
        // if (this.bill.list && this.bill.list.length>0) {
        //   newBillItem =  this.bill.list[0].map(function(val,index) {
        //     val.value = '';
        //     return val;
        //   });
        // } else {
        //   newBillItem =  this.bill.initList;
        // }
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
      yunzaConfirmBill:function () {
        return {
          head:{
            no:{tag:'单号',type:1,disabled:true},
            sender:{tag:'发运员',type:1},
            userNo:{
              tag:'客户编码',
              type:11,
              require:{
                field:'userNo',
                rb:[
                  {rf:'userName'},
                  {rf:'userNo'}
                ]
              }},
            userName:{
              tag:'客户名称',
              type:11,
              require:{
                field:'userNo',
                rb:[
                  {rf:'userName'},
                  {rf:'userNo'}
                ]
              }},
            address:{
              tag:'发货标定地点',
              type:11,
              require:{
                field:'address',
                rb:[
                  {rf:'address'},
                  {rf:'sendType'},
                  {rf:'distance'},
                  {rf:'costStandard'}
                ]
              }
            },
            sendType:{tag:'发运方式',type:1,disabled:true},
            distance:{tag:'备案里程',type:1,disabled:true},
            costStandard:{tag:'产品标准运费总额',type:1,disabled:true}

          },
          list:{
            wayBillNo:{tag:'运单编号',type:1},
            costType:{tag:'费用项',type:2,selectArr:this.costTypeArr},
            totalTax: {tag:'含税金额',type:1},
            total: {tag:'无税金额',type:1},
            tax: {tag:'税额',type:1},
            isForeign:{tag:'是否国外费用',type:3},
            carrierName:{
              tag:'承运单位',
              type:11,
              require:{
                field:'carrierName',
                rb:[
                  {rf:'carrierName',bf:'name'}
                ]
              }
            },
            carrierConfirm: {tag:'承运确认人',type:1},
            remark: {tag:'备注',type:1}
          }
        }
      },
      initAttachData:function() { //附加设置数据
        this.attachData = this[this.billName] ();
      },
      handleBillHead:function(head) {
        var _this = this;
        var h = _this.attachData.head;
        head.forEach(function(val,index) {
          val.type = 99;
          val.disabled = !_this.isEdit;
          concatObj(val,h[val.key])
        });
        this.billHandled.head = head;
      },
      handleBillList:function(list) {
        var _this = this;
        var l = _this.attachData.list || [];
        list.forEach(function (val,index) {
          val.forEach(function (v,i) {
            v.type = 99;
            v.disabled = !_this.isEdit;
            concatObj(v,l[v.key])
          })
        });
        this.billHandled.list = list;
      },
      handleBillData:function () { //附加设置
        this.handleBillHead(this.bill.head);
        if (this.bill.list) {
          this.handleBillList(this.bill.list)
        }
      },
      getPostBillData:function() { // 接口数据
        // var data = JSON.parse(gLocalData.get('pushTaskData'));
        // var head = [];
        // if (data.head) {
        //   for (var attr in data.head ) {
        //     head.push({key:attr,value:data.head[attr]})
        //   }
        // }
        // myConsole(head);
        // return false;
        this.bill = {
          head:[
            {key:'no',value:'JK201806660211'},
            {key:'sender',value:'发运员一'},
            {key:'userNo',value:'Uz0211'},
            {key:'userName',value:'王伟刚'},
            {key:'address',value:'河北石家庄'},
            {key:'sendType',value:'快递'},
            {key:'distance',value:'100.00'},
            {key:'costStandard',value:'200.00'}
          ],
          initList:[
            {key:'wayBillNo',value:''},
            {key:'costType',value:''},
            {key:'totalTax',value:''},
            {key:'total',value:''},
            {key:'tax',value:''},
            {key:'isForeign',value:''},
            {key:'carrierName',value:''},
            {key:'carrierConfirm',value:''},
            {key:'remark',value:''}
          ],
          list:[
            // [
            //   {key:'supportType',tag:'供货类型',value:'2'},
            //   {key:'baseCode',tag:'基本型编码',value:'X1110070-06'},
            //   {key:'plantCode',tag:'选装方案号',value:'*02'},
            //   {key:'productName',tag:'产品名称',value:'水套总成'},
            //   {key:'number',tag:'数量',value:'5'},
            //   {key:'unit',tag:'主计量单位',value:'台'},
            //   {key:'standard',tag:'型号规格',value:'A2'},
            //   {key:'priceTax',tag:'原币含税单价',value:'19.0000'},
            //   {key:'price',tag:'原币无税单价',value:'18.0000'},
            //   {key:'totalTax',tag:'原币含税金额',value:'95.00'},
            //   {key:'total',tag:'原币无税金额',value:'90.00'},
            //   {key:'tax',tag:'原币税额',value:'5.00'},
            //   {key:'taxRate',tag:'税率',value:'5.00'},
            //   {key:'requireDate',tag:'要求发货日期',value:'2018-04-03'},
            //   {key:'preRate',tag:'预收比例',value:'5.0000'},
            //   {key:'preMoney',tag:'预收金额',value:'25.0000'},
            //   {key:'packet',tag:'包装工艺',value:false},
            //   {key:'lifeStatus',tag:'产品生命周期',value:'2'}
            // ],
            // [
            //   {key:'supportType',tag:'供货类型',value:'1'},
            //   {key:'baseCode',tag:'基本型编码',value:'S1110070-06'},
            //   {key:'plantCode',tag:'选装方案号',value:'*02'},
            //   {key:'productName',tag:'产品名称',value:'水套总成2222'},
            //   {key:'number',tag:'数量',value:'51'},
            //   {key:'unit',tag:'主计量单位',value:'台'},
            //   {key:'standard',tag:'型号规格',value:'A2'},
            //   {key:'priceTax',tag:'原币含税单价',value:'19.0000'},
            //   {key:'price',tag:'原币无税单价',value:'18.0000'},
            //   {key:'totalTax',tag:'原币含税金额',value:'95.00'},
            //   {key:'total',tag:'原币无税金额',value:'90.00'},
            //   {key:'tax',tag:'原币税额',value:'5.00'},
            //   {key:'taxRate',tag:'税率',value:'5.00'},
            //   {key:'requireDate',tag:'要求发货日期',value:'2018-04-03'},
            //   {key:'preRate',tag:'预收比例',value:'5.0000'},
            //   {key:'preMoney',tag:'预收金额',value:'25.0000'},
            //   {key:'packet',tag:'包装工艺',value:false},
            //   {key:'lifeStatus',tag:'产品生命周期',value:'1'}
            // ]
          ]
        }
        // this.bill = {
        //   head:[
        //     {key:'no',tag:'单号',value:'JK201806660211'},
        //     {key:'userNo',tag:'客户编码',value:'Uz0211'},
        //     {key:'userName',tag:'客户名称',value:'王伟刚'},
        //     {key:'address',tag:'发货标定地点',value:'河北石家庄'},
        //     {key:'sendType',tag:'发运方式',value:'快递'},
        //     {key:'workType',tag:'业务类型',value:2},
        //     {key:'repayType',tag:'回款方式',value:2}
        //    ],
        //    initList:[
        //      {key:'supportType',tag:'供货类型',value:''},
        //      {key:'baseCode',tag:'基本型编码',value:''},
        //      {key:'plantCode',tag:'选装方案号',value:''},
        //      {key:'productName',tag:'产品名称',value:''},
        //      {key:'number',tag:'数量',value:''},
        //      {key:'unit',tag:'主计量单位',value:''},
        //      {key:'standard',tag:'型号规格',value:''},
        //      {key:'priceTax',tag:'原币含税单价',value:''},
        //      {key:'price',tag:'原币无税单价',value:''},
        //      {key:'totalTax',tag:'原币含税金额',value:''},
        //      {key:'total',tag:'原币无税金额',value:''},
        //      {key:'tax',tag:'原币税额',value:''},
        //      {key:'taxRate',tag:'税率',value:''},
        //      {key:'requireDate',tag:'要求发货日期',value:''},
        //      {key:'preRate',tag:'预收比例',value:''},
        //      {key:'preMoney',tag:'预收金额',value:''},
        //      {key:'packet',tag:'包装工艺',value:''},
        //      {key:'lifeStatus',tag:'产品生命周期',value:''}
        //    ],
        //   list:[
        //     // [
        //     //   {key:'supportType',tag:'供货类型',value:'2'},
        //     //   {key:'baseCode',tag:'基本型编码',value:'X1110070-06'},
        //     //   {key:'plantCode',tag:'选装方案号',value:'*02'},
        //     //   {key:'productName',tag:'产品名称',value:'水套总成'},
        //     //   {key:'number',tag:'数量',value:'5'},
        //     //   {key:'unit',tag:'主计量单位',value:'台'},
        //     //   {key:'standard',tag:'型号规格',value:'A2'},
        //     //   {key:'priceTax',tag:'原币含税单价',value:'19.0000'},
        //     //   {key:'price',tag:'原币无税单价',value:'18.0000'},
        //     //   {key:'totalTax',tag:'原币含税金额',value:'95.00'},
        //     //   {key:'total',tag:'原币无税金额',value:'90.00'},
        //     //   {key:'tax',tag:'原币税额',value:'5.00'},
        //     //   {key:'taxRate',tag:'税率',value:'5.00'},
        //     //   {key:'requireDate',tag:'要求发货日期',value:'2018-04-03'},
        //     //   {key:'preRate',tag:'预收比例',value:'5.0000'},
        //     //   {key:'preMoney',tag:'预收金额',value:'25.0000'},
        //     //   {key:'packet',tag:'包装工艺',value:false},
        //     //   {key:'lifeStatus',tag:'产品生命周期',value:'2'}
        //     // ],
        //     // [
        //     //   {key:'supportType',tag:'供货类型',value:'1'},
        //     //   {key:'baseCode',tag:'基本型编码',value:'S1110070-06'},
        //     //   {key:'plantCode',tag:'选装方案号',value:'*02'},
        //     //   {key:'productName',tag:'产品名称',value:'水套总成2222'},
        //     //   {key:'number',tag:'数量',value:'51'},
        //     //   {key:'unit',tag:'主计量单位',value:'台'},
        //     //   {key:'standard',tag:'型号规格',value:'A2'},
        //     //   {key:'priceTax',tag:'原币含税单价',value:'19.0000'},
        //     //   {key:'price',tag:'原币无税单价',value:'18.0000'},
        //     //   {key:'totalTax',tag:'原币含税金额',value:'95.00'},
        //     //   {key:'total',tag:'原币无税金额',value:'90.00'},
        //     //   {key:'tax',tag:'原币税额',value:'5.00'},
        //     //   {key:'taxRate',tag:'税率',value:'5.00'},
        //     //   {key:'requireDate',tag:'要求发货日期',value:'2018-04-03'},
        //     //   {key:'preRate',tag:'预收比例',value:'5.0000'},
        //     //   {key:'preMoney',tag:'预收金额',value:'25.0000'},
        //     //   {key:'packet',tag:'包装工艺',value:false},
        //     //   {key:'lifeStatus',tag:'产品生命周期',value:'1'}
        //     // ]
        //   ]
        // }
        this.handleBillData();
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
          this[backData.dataSource][backData.headField].forEach(function (val,index) {
             if (val.key === backData.sourceField) {
               _this.$set(_this[backData.dataSource][backData.headField][index],'value',backData.backField);
             }
          })
        } else { //表体
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
