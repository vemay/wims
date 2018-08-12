$ready = function () {
  new Vue({
    el: '#app',
    data: {
      user:'',
      tab:{},
      workedTab:0,
      workTab:[{
        text:'待审批',
        type:'todo'
      },{
        text:'待完成',
        type:'wait'
      }],
      msgCount:0,
      cAccName:'',
      workList:[],
      msgCountListenerNum:0,
      msgCountPause:false
    },
    watch:{
      msgCountListenerNum:{
        handler:function () {
          (!this.msgCountPause) && this.getMsgCount();
        }
      }
    },
    mounted: function () {
      var t= this;
      __init();
      frameSetNobounces();
      preventKeyBack();
      this.clearEnumData();
      this.doCheckItems();
      addEventListenerW('refreshIndex',function () {
        t.closeListGroup();
        t.doCheckItems();
      })
      
    },
    methods: {
      handleGetMsgCount:function () {
        var t = this;
        api.addEventListener({
          name:'viewdisappear'
        }, function(ret, err){
          t.msgCountPause = true;
        });
        api.addEventListener({
          name:'viewappear'
        }, function(ret, err){
          t.msgCountPause = false;
          t.msgCountListenerNum ++;
        });
      },
      getMsgCount:function () {
        var t = this;
        var msgCountPost = {
          cFunName:'MobileWorkFlowTipMessageCount',
          paramJson:{},
          loginInfo:gLocalData.get('loginInfo')
        };
        this.getPostData(msgCountPost,function (ret) {
          t.msgCount = ret.sResult;
          setTimeout(function () {
            t.msgCountListenerNum++;
          },10000);
        },null,null,{noToast:true})
      },
      clearEnumData:function() {
        gLocalData.del('enumData');
      },
      openListGroup:function () {
        var t = this;
        var tab = $api.dom('.work-table-tab');
        var tabOffset = $api.offset(tab);
        var b = tabOffset.t + tabOffset.h + 2; //
        api.openFrameGroup({
          name: 'index-list-group',
          rect: {
            x: 0,
            y: b,
            w: 'auto',
            h: 'auto'
          },
          scroll:true,
          reload:true,
          preload:0,
          frames: [{
            name: 'index-todo-list',
            url: 'index-todo-list.html?t='+Math.random(),
            bgColor:'#f5f7f6'
          }, {
            name: 'index-wait-list',
            url: 'index-wait-list.html?t='+Math.random(),
            bgColor:'#f5f7f6'
          }]
      
        }, function(ret, err) {
          t.workedTab = ret.index;
        });
      },
      closeListGroup:function () {
        api.closeFrameGroup({
          name: 'index-list-group'
        });
      },
      doCheckItems:function () {
        if (checkApiRoot()) {
          this.pageInit();
        }
      },
      pageInit:function () {
        if (checkLogin()) {
          this.getUserInfo();
          this.openListGroup();
          this.handleGetMsgCount();
        }
      },
      getUserInfo:function () {
        this.cAccName = gLocalData.get('cAccName');
        var user = gLocalData.get('user');
        this.user = user?JSON.parse(user):{};
        var alias = this.user.cPerCode || '',
          tag0 = this.user.cDepCode || '',
          tag2 = this.user.cDepCode2 || '',
          tag1 = this.user.cDepCode1 || '';
        bindPush(alias,['tag'])
      },

      changeWorkTab:function (tab,index) {
        this.workList = []; //防止切换列表时滚动位置移动
        this.workedTab = index || 0;
        this.tab = tab;
        api.setFrameGroupIndex({
          name: 'index-list-group',
          index: index,
          scroll:true
        });

      },
      changeUser:function () { //切换用户
        dialogConfirm('确认要切换用户？',function () {
          logOut(null,unBindPush);
          // logOut();
        })
      },
      listDetail:function () { //全部列表
        if (this.workedTab === 0 ) {
          changeTo('index-todo-list')
        } else {
          changeTo('index-wait-list')
        }
      },
      preventToast:function () {
        windowToast('暂未开放')
      }

    }
  })
}