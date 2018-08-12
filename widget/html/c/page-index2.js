$ready = function () {
  new Vue({
    el: '#app',
    data: {
      allLoaded:false,
      topDropText:'测试文字',
      msg:'111',
      tab:'check',
      workedTab:0,
      workTab:[{
        text:'待审批'
      },{
        text:'待完成'
      }],
      workList:[],
      waitList:[],
      todoList:[]
    },
    mounted: function () {
      // checkApiRoot();
      addEventListenerW('refreshIndex',function () {
        window.location.reload()
      });
      checkLogin();
      this.changeWorkTab();
      //列表高度


      frameSetNobounces();
    },
    methods: {
      getWaitList:function () {
        var t = this;
        //待审批列表
        var waitListPost = {
          cFunName:'MobileMessage',
          paramJson:{"cType":"WaitTask","cMsgContent":"","sBillName":"","iBillID":0},
          loginInfo:gLocalData.get('loginInfo')
        };
        this.getPostData(waitListPost,function (ret) {
          myConsole(ret);
          t.workList = ret;
        })
      },
      getTodoList:function () {
        //待完成列表
        var t = this;
        var loginInfo = gLocalData.get('loginInfo');
        var todoPost = {
          cFunName:'MobileMessage',
          paramJson:{"cType":"TodoTask","cMsgContent":"","sBillName":"","iBillID":0,"iPage":1},
          loginInfo:loginInfo
        };
        // myConsole(todoPost)
        //
        this.getPostData(todoPost,function (ret) {
          myConsole(ret)
          t.todoList = ret;
        })
      },
      changeWorkTab:function (tab,index) {
        this.workedTab = index || 0;
        if (this.workedTab === 0 ) {
          this.getWaitList();
        } else if (this.workedTab === 1) {
          this.getTodoList();
        }
      },
      clickList:function () {
        var page = '';
        var setting = {};

        if (this.workedTab === 0) {
          page = 'borrow-money-bill';
          setting = {
            type:'check',
            curd:0
          }
        } else {
          page = 'common-bill';
          setting = {
            type:'',
            curd:1
          }
        }
        changeTo(page,setting)
      },
      changeUser:function () {
        dialogConfirm('确认要切换用户？',function () {
          logOut();
        })
      },
      /*load-more*/
      loadTop:function () {
        // 加载更多数据
        this.$refs.loadmore.onTopLoaded();
      },
      loadBottom:function () {
        // 加载更多数据
        // this.list = this.list.concat(this.list);
        // this.allLoaded = true;// 若数据已全部获取完毕
        this.$refs.loadmore.onBottomLoaded();
      },
      /*load-more-end*/

    }
  })
}