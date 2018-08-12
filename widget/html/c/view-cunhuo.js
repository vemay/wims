$ready = function () {
  new Vue({
    el:'#app',
    data:{
      billName:'',
      desc:true,
      moreList:[
        {text:'查询',fn:'to-query'},
        {text:'其他',fn:'do-confirm'},
    
      ],
      fieldsArr:[],
      dirArr:[],
      iPage:1,
      allLoaded:false,
      focusIndex:-1,
      imgStyle:{width:'15% !important'},
      topLeft:'',
      trWidth:'',
      selectedTr:[]
    },
    computed:{
      showPull: function () {
        return !this.allLoaded && this.dirArr.length > 0;
      }
    },
    mounted:function () {
      var t = this;
      this.billName = $_GET['billName'];
      this.doTopScroll();
      this.openQueryFrame();
      this.handleLoadMore();
      addEventListenerW('doFilter', function (ret) {
        t.filter = ret.value.filter;
        t.doQuery(1);
      });
    },
    methods:{
      openQueryFrame: function () {
        api.openFrame({ //筛选列表
          name: 'dir-query-list',
          url: 'dir-query-list.html?v=' + Math.random(),
          bgColor: 'rgba(0,0,0,0)',
          reload: true,
          rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
          },
          animation: {
            type: 'none',
            subType: '',
            duration: 0
          },
          pageParam: {
            billName: this.billName
          }
        });
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
      doConfirm:function () {
        myConsole(this.fieldsArr)
        // myConsole(this.selectedTr);
      },
      toQuery:function () {
        this.openQueryFrame();
      },
    
      doQuery: function (page, addData, noToast, callback) {
        var t = this;
        t.allLoaded = false;
        var queryPost = {
          cFunName: 'MobileApproveBillList',
          paramJson: {"BillName": this.billName, "svVarFilter": JSON.stringify(this.filter), "iPage": page},
          loginInfo: gLocalData.get('loginInfo')
        };
        this.getPostData(queryPost, function (ret) {
          var fieldsArr, pageArr;
          if (ret && ret.length) {
            fieldsArr = ret[0].NewDataSet.ds; //字段
            pageArr =  converseDs(ret[1]); // 数据
            pageArr && (pageArr= t.formatFieldType(fieldsArr,pageArr,2));
            if (addData) {
              if (pageArr) {
                t.dirArr = t.dirArr.concat(pageArr);
              } else {
                t.allLoaded = true;
                windowToast('没有更多了!')
              }
            } else {
              t.fieldsArr = fieldsArr;
              t.dirArr = pageArr;
            }
          } else {
            t.dirArr = [];
          }
          callback && callback(ret);
        }, null, null, {noToast: noToast})
      },
      doLoadMore: function () {
        this.iPage++;
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
          t.doLoadMore();
        });
      },
      rowFocus:function(index) {
        this.focusIndex = index;
      },
      field:function() {
        changeTo('common-dir',{
          isCrossScreen:1
        });
      },
      query:function() {
        changeTo('view-plan',{
          isCrossScreen:-2,
          queryType:api.frameName
        });
      },
      orderBy:function(field) {
        this.desc = !this.desc;
        if (this.desc) {  //升序
          for(var i = 0; i < this.datas.length-1; i++) {
            for (var j = 0; j < this.datas.length -1 - i; j++) {
              var m = this.datas[j];
              var n = this.datas[j+1];
              if ( m[field] > n[field]) {
                var tmp = m;
                this.$set(this.datas,j,n);
                this.$set(this.datas,j+1,tmp);
              }
            }
          }
        } else { //降序
          for(var i = 0; i < this.datas.length-1; i++) {
            for (var j = 0; j < this.datas.length -1 - i; j++) {
              var m = this.datas[j];
              var n = this.datas[j+1];
              if ( m[field] < n[field]) {
                var tmp = m;
                this.$set(this.datas,j,n);
                this.$set(this.datas,j+1,tmp);
              }
            }
          }
        }
      }
    },
  })
};