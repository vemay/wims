$ready = function () {
  new Vue({
    el:'#app',
    data:{
      workList:[],
      page:1,
      allLoaded:false,
    },
    mounted:function () {
      var t = this;
      frameSetbounces();
      this.getTodoList(1);
      this.handleRefresh();
      this.handleLoadMore();
      this.handleScrollUp();
      addEventListenerW('pushTodo',function () {
        t.getTodoList(1);
      })
    },
    methods:{
      getTodoList:function (page,addData,noToast,callback) {
        var t = this;
        //待审批列表
        var todoListPost = {
          cFunName:'MobileMessage',
          paramJson:{"cType":"TodoTask","cMsgContent":"","sBillName":"","iBillID":0,"iPage":page},
          loginInfo:gLocalData.get('loginInfo')
        };
        this.getPostData(todoListPost,function (ret) {
          if (addData) {
            t.workList = t.workList.concat(ret);
          } else {
            t.workList = ret;
          }
          callback && callback(ret);
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
          t.getTodoList(t.page,false,true,function () {
            api.refreshHeaderLoadDone();
          })
          //在这里从服务器加载数据，加载完成后调用api.refreshHeaderLoadDone()方法恢复组件到默认状态

        });
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
          t.getTodoList(t.page,true,null,function (ret) {
            if (!ret.length) {--t.page;windowToast('没有更多了!');}
          });
        });
      },
      doLoadMore:function () {
        if (!this.allLoaded) {
          this.page ++ ;
        }
        
      },
      clickWork:function (work) {
        var page = '';
        var setting = {};
          //待审批
        page = 'common-check-bill';
        setting = {
          type:'check',
          curd:0,
          param:work
        };
        changeTo(page,{setting:setting})
      },
      handleScrollUp:function () {
        addEventListenerW('swipeup',function () {
          sendEventW('indexListUp')
        })
      }
    }
  })
};