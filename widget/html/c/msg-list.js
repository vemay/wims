$ready = function () {
  new Vue({
    el:'#app',
    data:{
      moreList:[
        {name:'delete', text:'删除选中项', fn:'del'}
      ],
      dirCheckedArr:[],
      dirArr:[],
      page:1,
    },
    mounted:function () {
      frameSetbounces();
      this.getMsgList();
      this.handleRefresh();
      this.handleLoadMore();
    },
    methods:{
      getMsgList:function (page,addData,noToast,callback) {
        var t = this;
        var msgCountPost = {
          cFunName:'MobileWorkFlowTipMessage',
          paramJson:{"iPage":this.page},
          loginInfo:gLocalData.get('loginInfo')
        };
        this.getPostData(msgCountPost,function (ret) {
          ret  =  converseDs(ret[0]);
          if (addData) {
            if (ret) {
              t.dirArr = t.dirArr.concat(ret);
            }
          } else {
            if (!ret) {windowToast('暂无通知消息');return false;}
            t.dirArr = ret;
          }
          callback && callback(ret);
        },null,null,{noToast:noToast})
     
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
      del:function () {
        var t = this;
        dialogConfirm('确认删除选中消息？',function () {
          t.doConfirmPost();
        })
      },
      doConfirmPost:function () {
        var t = this;
        // this.handleConfirmData();
        var msgDelPost = {
          cFunName: 'MobileDeleteWorkFlowTipMessage',
          paramJson: {"sHeadData": JSON.stringify({ds:this.dirArr})},
          loginInfo: gLocalData.get('loginInfo')
        };
        this.getPostData(msgDelPost, function (ret) {
          windowToast(ret.sResult);
          t.page = 1;
          t.getMsgList(1);
        })
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
          t.getMsgList(t.page,false,true,function () {
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
          t.getMsgList(t.page,true,null,function (ret) {
            if (!ret.length) {--t.page;windowToast('没有更多了!');}
          });
        });
      },
    }
  })
}