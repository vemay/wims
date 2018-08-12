  $ready = function () {
  new Vue({
    el:'#app',
    data:{
      pageType:0, //0 方案列表 1 方案操作
      postData:{},
      // queryType:'',
      tabIndex:0,
      tabs:[
        {name:'default',text:'默认'},
        {name:'personal',text:'个人'},
        {name:'public',text:'公共'},
      ],
      signs:[
        {name:'>='},
        {name:'<='},
        {name:'like'},
        {name:'NoLike'},
        {name:'左匹配'},
        {name:'<>'},
      ],
      moreList:[
        {
          name:'新增方案',
          fn:'addplan'
        },
        {
          name:'修改方案',
          fn:'updateplan',
        },
        {
          name:'删除方案',
          fn:'delplan'
        },
        {
          name:'保存方案',
          fn:'saveplan'
        },
      ],
      fields:[
        {text:'物料名称',name:'name'},
        {text:'型号规格',name:'standard'},
        {text:'仓库名称',name:'store'},
        {text:'储存货位',name:'position'},
        {text:'待改制属性',name:'change'},
        {text:'库存量',name:'stockNum'},
        {text:'库存可用量',name:'stockUseNum'},
        {text:'均衡生产库存量',name:'balanceNum'},
        {text:'借用数量',name:'borrowNum'},
        {text:'在检数量',name:'checkNum'},
        {text:'代储数量',name:'insteadNum'},
        {text:'待出库数量',name:'toPush'}
      ],

      planList:[],
      defaultPlan:{},
      /*方案操作*/
      pickedFields:[],
      allPicked:false,
      isDefault:false,
      isPublic:false,
      isRemain:false,
      planName:'',
      activePlan:{},
      activePlanIndex:-1,
    },

    mounted:function () {
      frameSetbounces();
      this.saveData();
      this.initActivePlan();
      this.getDefaultPlan();
      this.compareChecked();
    },
    methods:{
      saveData:function () {
        var t = this;
        var data = {
          defaultPlan:{},
          planPersonalList:[
            {
              id:1,
              name:'第一个方案',
              type:1,
              isDefault:true,
              list:[
                {field:{text:'库存量',name:'stockNum'},
                  condition: [
                    {sign:'>=',value:500},
                    {sign:'<=',value:800}
                  ]
                },
                {field:{text:'物料名称',name:'name'},
                  condition: [
                    {sign:'like',value:'物料'},
                  ]
                }
              ]
            },
            {
              id:2,
              name:'第二个方案',
              type:1,
              isDefault:true,
              list:[
                {field:{text:'库存量',name:'stockNum'},
                  condition: [
                    {sign:'>=',value:500},
                    {sign:'<=',value:800}
                  ]
                },
                {field:{text:'物料名称',name:'name'},
                  condition: [
                    {sign:'like',value:'物料'},
                  ]
                }
              ]
            },
          ],
          planPublicList:[
            {
              id:3,
              name:'第四个方案',
              type:2,
              isRemain:true,
              list:[
                {field:{text:'库存量',name:'stockNum'},
                  condition: [
                    {sign:'>=',value:500},
                    {sign:'<=',value:800}
                  ]
                },
                {field:{text:'物料名称',name:'name'},
                  condition: [
                    {sign:'like',value:'物料'},
                  ]
                }
              ]
            },
            {
              id:4,
              name:'第三个方案',
              type:2,
              list:[
                {field:{text:'库存量',name:'stockNum'},
                  condition: [
                    {sign:'>=',value:500},
                    {sign:'<=',value:800}
                  ]
                },
                {field:{text:'物料名称',name:'name'},
                  condition: [
                    {sign:'like',value:'物料'},
                  ]
                }
              ]
            }
          ],
        };
        data.planPersonalList.map(function (value,index,arr) {
          if (!(t.defaultPlan.id - 0)) {
            if (value.isDefault) {
              data.defaultPlan = value;
              t.defaultPlan = value;
            }
          } else {
            value.isDefault = !1;
          }
          if (index === arr.length - 1 ) {
            data.planPublicList.map(function (v,i) {
              if (!( t.defaultPlan.id - 0 )) {
                if (v.isDefault) {
                  data.defaultPlan = v;
                  t.defaultPlan = v;
                }
              } else {
                v.isDefault = !1;
              }
              return v;
            });
          }
          return value;
        });
        this.postData = data;
        gLocalData.push('planData',data);
      },

      /*更多操作方法*/
      addPlan:function(){
        changeTo('view-plan-s',{
          type:1
        })
        this.initActivePlan();
        this.showFields();
      },
      updatePlan:function() {

        if (this.activePlanIndex >= 0) {
          this.activePlan = this.planList[this.activePlanIndex];
        } else {
          this.activePlan = this.defaultPlan;
        }
        changeTo('view-plan-s',{
          type:2,
          plan:this.activePlan
        })
      },
      delPlan:function() {
        windowToast('删除方案接口')
      },
      savePlan:function() {
        changeTo('view-plan-s',{
          type:1,
          plan:this.activePlan
        })
      },
      /*删除筛选项 */

      del:function(index,plan) {
        var _this = this;
        if (plan) {
          dialogConfirm('确定要删除此查询条件？',function(ret) {
            if (ret.eventType === 'right') {
              plan.list.splice(index,1);
              _this.showHandle = -1;
            }
          })
        }

      },

      /*更多操作方法结束*/
      showFields:function() {
        //切换 方案列表和方案编辑
        this.pageType = 1;
      },
      switchTab: function (tab,index) {
        // 0 默认 1 个人 2 公共
        this.tabIndex = index;
        this.activePlanIndex = -1;
        switch (index) {
          case 0:
            break;
          case 1:
            this.planList = this.postData.planPersonalList;
            break;
          case 2:
            this.planList = this.postData.planPublicList;
            break;
          default:
            break;
        }
      } ,
      switchPlan:function (plan,index) { //选择方案
        if (this.activePlanIndex === index ) {
          this.activePlanIndex = -1;
        } else {
          this.activePlanIndex = index;
          this.activePlan = plan;
        }
      },

      getDefaultPlan:function() {
        if ($_GET['defaultPlan']) {

        } else {
          this.defaultPlan =  {
            id:0,
            name:'',
            isDefault:false,
            isPublic:false,
            isRemain:false,
            list:[]
          }
        }
      },
      initActivePlan:function () {

        this.activePlan = JSON.stringify(this.postData.defaultPlan) !== '{}'
          ? this.postData.defaultPlan
          :  {
              name:'',
              isDefault:false,
              isPublic:false,
              isRemain:false,
              list:[]
            };
      },

      /*筛选项相关 */
      clearHead:function() {
        this.handleIndex = - 1;
        this.headIndex = -1;
        return this.headData = {
          field:{
            name:'',
            text:'可用过滤项'
          },
          condition:[
            {sign:'选择符',value:''},
            {sign:'选择符',value:''}
          ]
        }
      },
      setField:function(field) {
        this.headData.field.name =  field.name || '';
        this.headData.field.text =  field.text ;
        this.headData.field.text =  field.text ;
      },
      setSign:function(row,index) {
        this.$set(this.headData.condition[index],'sign',row.name) ;
      },
      pickData:function(index,cIndex,field) {
        var _this = this;
        var resource = api.frameName;
        index = index ? index : index === 0 ? 0 : -1;
        var d = _this.planList[_this.activePlanIndex].list.condition;
        addEventListenerW('pickdata',function(ret) {
          if (ret.value.resource === resource){
            _this.$set(_this.planList[_this.activePlanIndex].list[index].condition[cIndex],ret.value.field,ret.value.data.name)
          }
        });

        changeTo('common-dir',{
          index:index,
          resource:resource,
          field:field
        });
        return false;

      },
      toggleHead:function() {
        this.showHead = !this.showHead;
        this.clearHead();
      },
      headSubmit:function() {
        if (this.headIndex === -1) {
          !this.checkEmpty() &&  this.planList[this.activePlanIndex].list.unshift(this.headData);
        } else {
          this.$set(this.planList[this.activePlanIndex].list,this.headIndex,this.headData)
        }
        this.toggleHead();
      },

      checkEmpty:function() {
        var empty = true;
        this.headData.condition.forEach(function(data){
          if (data.value.trim() !== '') {
            empty = false;
            return false;
          }
        });
        return empty;
      },

      doSubmit:function() {
        var _this = this;
        if (this.tabIndex === 0) {
          // gLocalData.push('tmpQuery',{value:_this.defaultPlan});
          // gLocalData.push('tmpQueryType',_this.queryType);
          sendEventW('commonListener',{
            queryData:_this.defaultPlan
          });
          windowCloseThis();
        } else {
          if (this.activePlanIndex >=0 ) {
            sendEventW('commonListener',{
              queryData:_this.activePlan
            });
            windowCloseThis();
          } else {
            windowToast('请选择一个查询方案')
          }
        }
      },
      /*筛选相关 结束*/
      compareChecked:function () {
        var _this = this;
        var arr = [];
        this.activePlan.list.forEach(function (val) {
          arr.push(val.field)
        });
        this.pickedFields = arr;
      },
      pickAll:function() {
        //全选
        var _this = this;
        this.allPicked = !this.allPicked;
        this.pickedFields = this.allPicked ? this.fields :[];
      },

      planSubmit:function () {
        // myConsole(this.pickedFields)
        dialogAlert('保存成功');
        this.pageType = 0;
      }
    }
  })
}