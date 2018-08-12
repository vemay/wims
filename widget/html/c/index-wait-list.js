$ready = function () {
  new Vue({
    el:'#app',
    data:{
      workList:[],
      page:1,
      allLoaded:false,
      bills:[],
      doPush:false,
      pushExtra:{}
    },
    mounted:function () {
      var t = this;
      frameSetbounces();
      this.getWaitList(1);
      this.getWorkList();
      this.handleRefresh();
      this.handleLoadMore();
      addEventListenerW('pushWaitTask',function (ret) { //响应推送
        t.doPush = true;
        t.pushExtra = ret.value;
      })
    },
    methods:{
      getWaitList:function (page,addData,noToast,callback) {
        var t = this;
        //待完成列表
        var waitListPost = {
          cFunName:'MobileMessage',
          paramJson:{"cType":"WaitTask","cMsgContent":"","sBillName":"","iBillID":0,"iPage":page},
          loginInfo:gLocalData.get('loginInfo')
        };
        this.getPostData(waitListPost,function (ret) {
          if (addData) {
            t.workList = t.workList.concat(ret);
          } else {
            t.workList = ret;
          }
          callback && callback(ret);
          // t.$nextTick(t.setTableHeight)
        },null,null,{noToast:noToast})
      },
      handleRefresh:function () {
        var t = this;
        api.setRefreshHeaderInfo({
          loadingImg: '',/*widget://image/refresh.png*/
          bgColor: '#f5f7f6',
          textColor: '#0070ff',
          textDown: '下拉刷新...',
          textUp: '松开刷新...'
        }, function(ret, err) {
          t.page = 1;
          t.getWaitList(t.page,false,true,function () {
            api.refreshHeaderLoadDone();
          })
          //在这里从服务器加载数据，加载完成后调用api.refreshHeaderLoadDone()方法恢复组件到默认状态

        });
      },
      doLoadMore:function () {
        if (!this.allLoaded) {
          this.page ++ ;
        }
      },
      handleLoadMore:function () {
        var t = this;
        api.addEventListener({
          name:'scrolltobottom',
          extra:{
            threshold:0            //设置距离底部多少距离时触发，默认值为0，数字类型
          }
        }, function(ret, err){
          t.page ++ ;
          t.getWaitList(t.page,true,null,function (ret) {
            if (!ret.length) {--t.page ;windowToast('没有更多了!');}
          });
        });
      },
      clickWork:function (work) {
        var f = true;
        this.bills && this.bills.forEach(function (value) {
          if (value.BillName === work.BillName && value.bHidden-0 !== 1) {
            f = false;
          }
        });
        if (f) {
          windowToast('该单据功能暂未开放');
          return false;
        }
        //待完成
        var page = 'bill_'+work.BillName;
        // page = 'common-check-bill';
        var param = {
          curd:0,
          billId:work.BillID,
          billName:work.BillName,
          title:work.BillType
        };
        changeTo(page,param);
      },
      getWorkList:function () {
        var t = this;
        var workListPost = {
          cFunName:'MobileAllViewList', //todo 无视权限显示所有待完成MobileAllViewList/MobileViewList
          paramJson:{},
          loginInfo:gLocalData.get('loginInfo')
        };
        this.getPostData(workListPost,function (ret) {
          t.bills = converseDs(ret);
          if (t.doPush) { //响应推送
            t.clickWork(t.pushExtra);
          }
        })
      }
    }
  })
}