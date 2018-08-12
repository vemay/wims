var _this;
var vm;
$ready = function () {
  vm = new Vue({
    el:'#app',
    data:{
      apiText:'',
      apiIp:'',
      apiPort:'',
      apiList:[],
      apiIndex:-1,
      showNew:false
    },
    mounted:function () {
      setHeadLeftBtnNone();
      this.initConfig();
    },

    methods:{
      initConfig:function () {
        this.apiList = gLocalData.get('api_list')?JSON.parse(gLocalData.get('api_list')) : [];
      },
      clickAdd:function () {
        this.showNew = true;
        this.apiIndex = -1;
      },
      doSave:function() {
        if (!this.apiIp) {
          dialogAlert('IP地址不能为空');
          return false;
        }
        this.apiText =  (this.apiText === '')?this.apiIp:this.apiText;
        var currentApi = {api_ip:this.apiIp,api_port:this.apiPort,api_text:this.apiText};
        if (this.apiIndex > -1) {
          this.$set(this.apiList,[this.apiIndex],currentApi);
        } else {
          this.apiList.push(currentApi);
          this.apiIndex = this.apiList.length-1;
        }
        gLocalData.push('api_list',JSON.stringify(this.apiList));
        dialogAlert('保存成功');
        this.showNew = false;
      },
      doSubmit:function () {
        if (this.showNew) {
          windowToast('请先保存或取消当前设置');
          return false;
        } else {
          if (this.apiIndex === -1) {
            if (!this.apiIp) {
              dialogAlert('请选择一个配置');
              return false;
            }
          } else {
            this.apiText = this.apiList[this.apiIndex].api_text;
            this.apiIp = this.apiList[this.apiIndex].api_ip;
            this.apiPort = this.apiList[this.apiIndex].api_port;
          }
        }
        
        // gLocalData.push('api_index',this.apiIndex);
        gLocalData.push('api_ip',this.apiIp);
        gLocalData.push('api_port',this.apiPort);
        dialogAlert('设置完成',function () {
          logOut(1);
          sendEventW('refreshIndex');
          closeToWin('root')
        })
      },
      doCancel:function () {
        this.apiText = '';
        this.apiIp = '';
        this.apiPort = '';
        this.showNew = false;
      },
      selectApi:function (index) {
        this.showNew = false;
        this.apiIndex=index;
      },
      editApi:function (index) {
        this.showNew = true;
        this.apiIndex = index;
        this.apiText = this.apiList[index].api_text;
        this.apiIp = this.apiList[index].api_ip;
        this.apiPort = this.apiList[index].api_port;
      },
      delApi:function (index) {
        var t = this;
        dialogConfirm('确认删除配置'+this.apiList[index].api_text,function () {
          t.apiList.splice(index,1);
          gLocalData.push('api_list',JSON.stringify(t.apiList));
          t.apiIndex = -1;
        })
      }
    }
  })
};
