var viewHandleVm = {
  el:'#app',
  data:{
    billName:'',
    desc:true,
    moreList:[
      {text:'查询',fn:'to-query'},
    ],
    filter:{},
    enumArr:{},
    fieldsArr:[],
    dirArr:[], //展示列表
    iPage:1,
    allLoaded:false,
    focusIndex:-1,
    imgStyle:{width:'15% !important'},
    topLeft:'',
    trWidth:'',
    selectedTr:[],
    confirmData:'',
    loadStr:'加载更多'
  },
  computed:{
    showPull: function () {
      return !this.allLoaded && this.dirArr.length > 0;
    }
  },
  created:function () {
    clearEnumStorage();
  },
  mounted:function () {
    var t = this;
    this.billName = $_GET['billName'];
    this.doTopScroll();
    this.openQueryFrame();
    this.handleLoadMore();
    addEventListenerW('doFilter', function (ret) {
      t.filter = ret.value.filter;
      t.iPage = 1;
      t.doQuery(1);
    });
  },
  methods:{
    setTbBodyPaddingTop:function () {
      var t = this;
      this.$nextTick(function () {
        var tbHead = t.$refs.tbHead;
        var tbBody = t.$refs.tbBody;
        var tbHeadOffset = $api.offset(tbHead);
        var tbBodyOffset = $api.offset(tbBody);
      })
    },
    openQueryFrame: function () {
      openQueryFrame('view-query-list',{
        billName: this.billName
      })
    },
    doTopScroll:function () {
      var _this = this;
      this.$refs.tbody.onscroll =function (e) {
        _this.topLeft = (0 - this.scrollLeft) + 'px';
      };
      this.$nextTick(function () {
        _this.trWidth = document.documentElement.clientHeight;
      });
    },
    selectData:function (index) {
      
      if (this.dirArr[index]['bSystemSelected'] === 'true') {
        this.$set(this.dirArr[index],'bSystemSelected','');
      } else {
        this.$set(this.dirArr[index],'bSystemSelected','true');
      }
    },
    handleConfirmData:function () {
      this.confirmData = this.formatFieldType(this.fieldsArr,this.dirArr,2,{desFormat:true});
    },
    doConfirm:function () {
      var t = this;
      dialogConfirm('确认选中数据项？',function () {
        t.doConfirmPost();
      })
    },
    doConfirmPost:function () {
      var t = this;
      this.handleConfirmData();
      var confirmPost = {
        cFunName: 'MobileViewBoardOperateBill',
        paramJson: {"BillName": this.billName, "sHeadData": JSON.stringify({ds:this.confirmData})},
        loginInfo: gLocalData.get('loginInfo')
      };
      this.getPostData(confirmPost, function (ret) {
        windowToast(ret.sResult);
        t.iPage = 1;
        t.doQuery(1);
      },null,null,{catchError:function (ret) {
          windowToast(ret.sError);
          t.$set(t,'dirArr',t.formatFieldType(t.fieldsArr,t.dirArr,2));
        }})
    },
    toQuery:function () {
      this.openQueryFrame();
    },
    
    doQuery: function (page, addData, noToast, callback) {
      var t = this;
      t.allLoaded = false;
      var queryPost = {
        cFunName: 'MobileViewBoardBillList',
        paramJson: {"BillName": this.billName, "svVarFilter": JSON.stringify(this.filter), "iPage": page},
        loginInfo: gLocalData.get('loginInfo')
      };
      this.getPostData(queryPost, function (ret) {
        var fieldsArr, pageArr;
        if (ret && ret.length) {
          fieldsArr = ret[0].NewDataSet.ds; //字段
          pageArr =  converseDs(ret[1]); // 数据
          pageArr && (pageArr = t.formatFieldType(fieldsArr,pageArr,2));
          t.viewDataHandle && (pageArr = t.viewDataHandle(pageArr)); //看板数据特殊处理
          if (addData) {
            if (pageArr) {
              t.$set(t,'dirArr',t.dirArr.concat(pageArr));
            } else {
              t.allLoaded = true;
              windowToast('没有更多了!')
            }
          } else {
            t.fieldsArr = fieldsArr;
            t.$set(t,'dirArr',pageArr);
          }
        } else {
          t.$set(t,'dirArr',[]);
        }
        callback && callback(ret);
      }, null, null, {noToast: noToast})
    },
    doLoadMore: function () {
      if (!this.allLoaded) {
        this.iPage++;
      }
      this.doQuery(this.iPage, true)
    },
    handleLoadMore: function () {
      var t = this;
      api.addEventListener({
        name: 'scrolltobottom',
        extra: {
          threshold: 0            //设置距离底部多少距离时触发，默认值为0，数字类型
        }
      }, function (ret, err) {
        if (JSON.stringify(t.filter) === '{}') {
          return false;
        }
        t.doLoadMore();
      });
    },
    rowFocus:function(index) {
      this.focusIndex = index;
    },
    query:function() {
      changeTo('view-plan',{
        isCrossScreen:-2,
        queryType:api.frameName
      });
    },
    orderBy:function(fieldName,fieldType) {
      this.desc = !this.desc;
      if (this.desc) {  //升序
        for(var i = 0; i < this.dirArr.length-1; i++) {
          for (var j = 0; j < this.dirArr.length -1 - i; j++) {
            var m = this.dirArr[j];
            var n = this.dirArr[j+1];
            if (fieldType === 'WSDecimal') {
              if ( m[fieldName]-0 > n[fieldName]-0) {
                var tmp = m;
                this.$set(this.dirArr,j,n);
                this.$set(this.dirArr,j+1,tmp);
              }
            } else {
              if ( m[fieldName] > n[fieldName]) {
                var tmp = m;
                this.$set(this.dirArr,j,n);
                this.$set(this.dirArr,j+1,tmp);
              }
            }
            
          }
        }
      } else { //降序
        for(var i = 0; i < this.dirArr.length-1; i++) {
          for (var j = 0; j < this.dirArr.length -1 - i; j++) {
            var m = this.dirArr[j];
            var n = this.dirArr[j+1];
            if (fieldType === 'WSDecimal') {
              if ( m[fieldName] < n[fieldName]) {
                var tmp = m;
                this.$set(this.dirArr,j,n);
                this.$set(this.dirArr,j+1,tmp);
              }
            } else {
              if ( m[fieldName] < n[fieldName]) {
                var tmp = m;
                this.$set(this.dirArr,j,n);
                this.$set(this.dirArr,j+1,tmp);
              }
            }
            
          }
        }
      }
    }
  },
}