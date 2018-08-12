$ready = function () {
  new Vue({
    el: '#app',
    data: {
      billName: '',
      iPage: 1,
      allLoaded: false,
      filter: {},
      fieldsArr: [],
      titleField: 'cInvName',
      moreList: [
        {name: '查询', fn: 'set-query'},
        // {name:'推单',fn:'do-push'}
      ],
      fieldsChecked: [],
      groups: [],
      dirArrTmp: [],
      dirArr: [],
      dirCheckedArr: [],
      pAttr: '',
    },
    computed: {
      showPull: function () {
        return !this.allLoaded && this.dirArr.length > 0;
      }
    },
    created:function () {
      clearEnumStorage();
    },
    mounted: function () {
      var t = this;
      this.billName = $_GET['billName'];
      this.titleField = $_GET['titleField'];
      this.dirArrTmp = this.dirArr;
      this.pAttr = 'text';
      addEventListenerW('doFilter', function (ret) {
        if (ret.value.billName === t.billName) {
          t.filter = ret.value.filter;
          t.iPage = 1;
          t.doQuery(1);
        }
      
      });
      this.openQueryFrame();
      // this.handleLoadMore();
    },
    methods: {
      openQueryFrame: function ( ) {
        openQueryFrame(null,{billName:this.billName})
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

      doPush: function () {
        // 推单
        var _this = this;
        var taskData = {
          target: 'task-list',
          products: _this.dirCheckedArr,
          fields: _this.fieldsArr
        };

        gLocalData.push('pushTaskData', taskData);
        changeTo('task-list')
      },
      fieldChecked: function (val) {
        var _this = this;
        this.fieldsChecked = val;
      },
      viewDetail: function (dir) {
        changeTo('base-info-dir-detail', {
          dir: dir,
          fieldsArr: this.fieldsArr,
          titleField: this.titleField
        })
      },
      doLoadMore: function () {
        if (!this.allLoaded) {
          this.iPage++;
        }
        this.doQuery(this.iPage, true)
      },
      handleLoadMore: function () {
        // var t = this;
        // api.addEventListener({
        //   name: 'scrolltobottom',
        //   extra: {
        //     threshold: 0            //设置距离底部多少距离时触发，默认值为0，数字类型
        //   }
        // }, function (ret, err) {
        //   if (JSON.stringify(t.filter) === '{}') {
        //     return false;
        //   }
        //   t.doLoadMore();
        // });
      },
      /*loadMore*/
      loadTop: function () {
        this.doQuery(1);
        this.$refs.loadmore.onTopLoaded();
      },
      loadBottom: function () {
        if (JSON.stringify(this.filter) === '{}') {
          return false;
        }
        this.doLoadMore();
        // this.allLoaded = true;
        this.$refs.loadmore.onBottomLoaded();
      }
    }
  })
}