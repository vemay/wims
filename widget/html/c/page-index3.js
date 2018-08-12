/*
* mint-ui load-more
* */

$ready = function () {
  new Vue({
    el: '#app',
    data: {
      user:'',
      autoFill:true,
      allLoaded:false,
      topDropText:'测试文字',
      msg:'',
      tab:{},
      workedTab:0,
      workTab:[{
        text:'待审批',
        type:'todo'
      },{
        text:'待完成',
        type:'wait'
      }],
      workList:[],
      iPage:1,
    },
    mounted: function () {          var t = this;
      var t= this;
      frameSetNobounces();
      this.doCheckItems();
      addEventListenerW('refreshIndex',function () {
        t.doCheckItems();
      })



    },
    methods: {
      doCheckItems:function () {
        if (checkApiRoot()) {
          this.pageInit();
        }
      },
      pageInit:function () {
        checkLogin();
        this.getUserInfo();
        this.changeWorkTab(this.workTab[0],0);
      },
      getUserInfo:function () {
        var user = gLocalData.get('user');
        this.user = user?JSON.parse(user):{};
      },
      setTableHeight:function () {
        var tableBody = $api.dom('.table-body');
        var tableBodyOffset = $api.offset(tableBody);
        tableBody.style.height = (api.winHeight - tableBodyOffset.t)+'px';
        tableBody.style.height = (api.winHeight - tableBodyOffset.t - 80)+'px';
      },
      changeWorkTab:function (tab,index) {
        this.workList = []; //防止切换列表时滚动位置移动
        this.workedTab = index || 0;
        this.tab = tab;
        this.iPage = 1;
        if (this.workedTab-0 === 0 ) {
          this.getTodoList(this.iPage);
        } else {
          this.getWaitList(this.iPage);
        }
      },
      getTodoList:function (page,addData) {
        var t = this;
        //待审批列表
        var waitListPost = {
          cFunName:'MobileMessage',
          paramJson:{"cType":"TodoTask","cMsgContent":"","sBillName":"","iBillID":0,"iPage":page},
          loginInfo:gLocalData.get('loginInfo')
        };
        this.getPostData(waitListPost,function (ret) {
          if (addData) {
            t.workList = t.workList.concat(ret);
          } else {
            t.workList = ret;
          }
          // t.$nextTick(t.setTableHeight)
        })
      },
      getWaitList:function (page,addData) {
        //待完成列表
        var t = this;
        var loginInfo = gLocalData.get('loginInfo');
        var todoPost = {
          cFunName:'MobileMessage',
          paramJson:{"cType":"WaitTask","cMsgContent":"","sBillName":"","iBillID":0,"iPage":page},
          loginInfo:loginInfo
        };
        // myConsole(todoPost)
        //
        this.getPostData(todoPost,function (ret) {
          if (addData) {
            t.workList = t.workList.concat(ret);
          } else {
            t.workList = ret;
          }
          // t.setTableHeight();
        })
      },
      clickList:function (item) {
        var page = '';
        var setting = {};
        if (this.workedTab === 0) {
          //待审批
          page = 'common-check-bill';
          setting = {
            type:'check',
            curd:0,
            param:item
          }
        } else {
          //待完成  todo
          page = 'common-check-bill';
          setting = {
            type:'check',
            curd:0,
            param:item
          }
        }
        changeTo(page,{setting:setting})
      },
      changeUser:function () { //切换用户
        dialogConfirm('确认要切换用户？',function () {
          logOut();
        })
      },
      loadMoreList:function () {
        this.iPage ++ ;
        if (this.workedTab-0 === 0 ) {
          this.getTodoList(this.iPage,true);
        } else {
          this.getWaitList(this.iPage,true);
        }
      },
      /*load-more*/
      loadTop:function () {
        // 刷新
        // var tab = this.tab;
        // var i = this.workedTab;
        // this.changeWorkTab(tab,i);
        this.$refs.loadmore.onTopLoaded();
      },
      loadBottom:function () {
        // 加载更多数据
        // this.list = this.list.concat(this.list);
        // this.allLoaded = true;// 若数据已全部获取完毕
        this.loadMoreList();
        this.$refs.loadmore.onBottomLoaded();
      },
      /*load-more-end*/
    }
  })
}