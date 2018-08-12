var _this = null, vm = null;
$ready = function () {
  vm = new Vue({
    el:"#app",
    data:{
      pAttr:'name',
      resource:'',
      field:'',
      args:{},
      pickIndex:-1,
      showSearchRet:true,
      pickedItems:[],
      pickType:0,
      fieldsArr:[
        {name:'name',text:'名称'},
        {name:'group',text:'销售大区'},
        {name:'department',text:'销售部门'},
      ],
      groups:[],
      searchRet:[],
      searchData:[
        {id:'001',name:'内蒙古大雁矿业集团1',group:'商务中心',department:'办公室'},
        {id:'002',name:'又一个有限公司2',group:'商务中心',department:'办公室'},
        {id:'003',name:'另一个企业3',group:'信息',department:'小卖部'},
        {id:'004',name:'还是集团4',group:'其他',department:'神马部'},
        {id:'001',name:'怎么又是有限公司5',group:'商务中心',department:'什么部'},
      ],
      hots:[],
      searhcDatas:{}
    },
    mounted:function() {
      var _this = this;
      frameSetbounces();
      this.searchData = [
        {id:'001',name:'内蒙古大雁矿业集团',group:'商务中心',department:'办公室'},
        {id:'002',name:'又一个有限公司',group:'商务中心',department:'办公室'},
        {id:'003',name:'另一个企业1',group:'信息',department:'小卖部'},
        {id:'004',name:'还是集团',group:'其他',department:'神马部'},
        {id:'001',name:'怎么又是有限公司',group:'商务中心',department:'什么部'},
      ];
      this.resource = $_GET['resource'] || 'all';
      this.args = $_GET['args'];
      this.pickType = $_GET['pickType'] || 0;

      this.field = this.args.field || 'userName';
      this.pickIndex = this.args.index?this.args.index:(this.args.index-0 === 0)?0:-1;

      // this.searchData =gLocalData.get('commonSearchData') || this.searchData;
      /*测试数据 销售订单－发货标定地点*/
      if (this.field ==='address' || this.field === 'sendType' ) {
        this.searchDatas = JSON.parse(gLocalData.get('searchDatas')).sendAddress;
       } else if (this.field ==='userNo' || this.field === 'userName' ) {
        this.searchDatas = JSON.parse(gLocalData.get('searchDatas')).saleUser;
      } else if (this.field === 'code' || this.field === 'baseCode') {
         this.searchDatas = JSON.parse(gLocalData.get('searchDatas')).products;
      } else if (this.field === 'carrierName') {
        this.searchDatas = JSON.parse(gLocalData.get('searchDatas')).suppliers;
      } else if (this.field === 'card' || this.field === 'payBankName') {
        this.searchDatas = JSON.parse(gLocalData.get('searchDatas')).bankDir;
      }
      this.fieldsArr = this.searchDatas.fields;
      this.searchData = this.searchDatas.data;
      this.pAttr = this.searchDatas.titleField || 'name';
      this.searchRet = this.searchData;
      this.initGroups();
    },
    methods:{
      initGroups:function() {
        var _this = this;
        var tmpGroup = {};
        this.searchData.forEach(function(val,i) {
          if (!tmpGroup[val.group]) {
            _this.groups.push({text:val.group})
            tmpGroup[val.group] = 1;
          }
        })
      },
      doSearch:function(data,keyword){
        var _this = this;
        this.showSearchRet = true;
        this.searchRet = this.searchData.filter(function(v,i) {
          var f = false;
          for (var attr in v ) {
            if (v[attr].toString().indexOf(keyword) >= 0) {
              f = true;
              return true;
            }
          }
          return f;
        })
      },
      pickGroup:function (val,index) {
        var _this = this;
        this.searchRet = this.searchData.filter(function(v,i) {
          if (index === -1) {
            return true;
          }
          return v.group === val['text'];
        })
      },
      selectRet:function(ret) {
        var _this = this;
        sendEventW('pickdata',{
          resource:_this.resource,
          field:_this.field,
          index:_this.pickIndex,
          data:ret
        });
        sendEventW('preventReload',{
          preventReload:1,
          targetFrame:_this.resource
        });
        setTimeout(windowCloseThis)
      },
      dirSubmit:function () {
        var _this = this;
        sendEventW('pickdata',{
          pickType:_this.pickType,
          resource:_this.resource,
          field:_this.field,
          index:_this.pickIndex,
          data:_this.pickedItems
        });
        sendEventW('preventReload',{
          preventReload:1,
          targetFrame:_this.resource
        });
        setTimeout(windowCloseThis)
      },
    }
  })
}