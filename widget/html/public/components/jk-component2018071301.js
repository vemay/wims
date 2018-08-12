/**
 * Created by Administrator on 2017/12/23.
 */
/*右上角更多列表*/
Vue.component('jk-more-list',{
  template:'<transition name="more-list">' +
  '<div class="more-mask" v-show="moreShow" @click="closeMask">' +
              ' <transition name="more" >'+
                '<div class="handle-list-common" v-show="moreShow">'+
                  '<div class="more-arrow"></div>'+
                  '<div class="handle-item click-effect" v-for="more in moreList" @click="doHandle(more)">'+
                    '<p class="text">{{more.name}}</p>'+
                  '</div>'+
                '</div>' +
              '</transition>'+
            '</div>' +
  '</transition>',
  props:{
    moreList:{
      default:function(){
        return [
          {name:'新增',fn:'add'},
          {name:'放弃',fn:'giveup'},
          {name:'维护',fn:'update'},
          {name:'提交',fn:'submit'}
        ]}
    }
  },
  data:function(){
    return {
      moreShow:false
    }
  },
  mounted:function(){
    var _this = this;
    sendEventW('setRightBtn',{
      win:api.frameName,
      data:{
        rbtn:'more',
      }
    });
    addEventListenerW('handleMore',function(ret,err){
      if (ret.value.win === api.winName) {
        _this.moreShow = !_this.moreShow;
      }
    });
  },
  methods:{
    closeMask:function () {
      this.moreShow = false;
    },
    doHandle:function (item) {
      this.$emit('listclick',item);
      this.$emit(item.fn,item)
    },
  }
});
/*右上角更多列表结束*/

/*搜索栏 － 用于选择用户或字段*/


Vue.component('jk-search-bar',{
  template:'<div class="search-bar" id="search-bar">'+
            '<div class="search-content">'+
                '<div class="search-words">'+
                    '<div class="search-icon"><i class="icon iconfont jk-search"></i></div>'+
                    '<input type="text" class="search-input" :placeholder="placeholder" v-model="keyword" @focus="searchFocus" @blur="searchBlur" ref="search">'+
                    '<div class="search-icon search-cancel"  @click="keyword=\'\'" v-show="showClear"><i class="icon iconfont jk-clear"></i></div>'+
                '</div>'+
                '<div class="search-cancel" @click="cancelSearch">取消</div>'+
            '</div>'+
            '<div class="search-ret">'+
               '<div class="ret-list"  v-if="showRetList" v-cloak>'+
                    '<div class="ret-row click-effect" v-for="ret in rets" v-if="rets"  @click="doSearch(ret,ret[ret.attr])">'+
                        '<div class="ret-text ">{{ret[ret.attr]}}</div>'+
                        '<div class="kind" >'+
                            '<span class="kind-text" @click.stop="doSearch(ret,ret[pAttr])">{{ret[pAttr]}}</span>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<div class="ret-default" v-if="showRetDefault" v-cloak>'+
                    '<div class="ret-row" v-if="showRetEmpty">'+
                        '<div class="ret-text text-center">没有找到相关类目</div>'+
                    '</div>'+
                    '<div class="ret-title" v-if="showHot">常用</div>'+
                    '<div class="ret-row click-effect" v-if="showHot" v-for="hot in hots" @click="doSearch(hot,hot[pAttr])">'+
                        '<div class="ret-text ">{{hot[pAttr]}}</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>',
  props:{
    resource:'',
    field:'',
    pAttr:{
      default:'name'
    },
    placeholder:{
      default:'请输入要搜索的部门名称'
    },
    showHot:{default:false},
    searchData:{
      default:function() {
        return [
          {
            id:1,
            name:'冀凯河北机电科技有限公司'
          },
          {
            id:'M01',
            name:'办公室',
          },
          {
            id:'M0101',
            name:'办公室直属组',
          },{
            id:'M0102',
            name:'商务中心',
          },
          {
            id:'M0103',
            name:'餐饮部后厨组',
          },
          {
            id:'M0104',
            name:'车辆中心',
          },
          {
            id:'M0105',
            name:'网络中心',
          },{
            id:'M02',
            name:'人力资源部'},

          {
            id:'M0201',
            name:'人力资源部招录组',
          },
          {
            id:'M0202',
            name:'人力资源部人事组',
          },
          {
            id:'M0203',
            name:'人力资源部考核办',
          },
          {
            id:'M0204',
            name:'安全保卫科',
            value:'人人人人人'
          }
        ]
      }
      // type:'Array'
    },
    hots:{
      default:function() {
        return [
          {
            id:'M0101',
            name:'办公室直属组'
          },
          {
            id:'M0104',
            name:'车辆中心'
          },
          {
            id:'M0204',
            name:'安全保卫科',
          }
        ]
      }
    }
  },
  data:function () {
    return {
      retArr:[],
      keyword:'',
      rets:[],
      showRetList:false,
      showRetDefault:false,
      showRetEmpty:false,
      showClear:false,
      searchWord:'',
      inputFocus:false
    }
  },
  mounted:function() {
    var _this = this;

    // this.dataToArr(this.searchData);
    // this.$refs.search.focus();
  },
  watch:{
    keyword:function() {
      this.showClear = (this.keyword !== '');
      if (this.searchWord === this.keyword && this.keyword !== '') { //确定搜索后不再显示列表
        this.showNothing();
        return false;
      }
      this.searchWord = '';
      this.getRets();
    }
  },
  methods:{
    dataToArr:function(data,pData) {
      pData = pData || {name:''};
      data.forEach(function(val,index) {
        _this.retArr.push({name:val.name,id:val.id,pName:pData.name})
        if (val['children'] && val['children'].length > 0) {
          _this.dataToArr(val['children'],val);
        }
      });
    },
    showDefault:function(){
      this.showRetDefault = true;
      this.showRetEmpty = false;
      this.showRetList = false;
    },
    showEmpty:function(){
      this.showRetDefault = true;
      this.showRetEmpty = true;
      this.showRetList = false;
    },
    showList:function() {
      this.showRetList = true;
      this.showRetDefault = false;
      this.showRetEmpty = false;
    },
    showNothing:function(){
      this.showRetList = false;
      this.showRetDefault = false;
      this.showRetEmpty = false;
    },
    searchFocus:function(){
      this.inputFocus = true;
      this.$emit('searchfocus');
      this.getRets();
    },
    searchBlur:function() {
      this.inputFocus = false;
      this.$emit('searchblur');
    },
    getRets:function() { //搜索树
      var _this = this;
      var rets = [];
      this.retArr = JSON.parse(JSON.stringify({value:this.searchData})).value;
      this.retArr.forEach(function(item) {
        for(var at in item ) {
          var attrValue = item[at]+'';
          if (attrValue.indexOf(_this.keyword) >= 0){
            var itemTmp = JSON.parse(JSON.stringify(item));
            itemTmp['attr'] = at;
            rets.push(itemTmp);
          };
        }
      })

      if (this.keyword === '' ) {
        if (this.inputFocus) {
          this.showDefault();
        } else {
          this.showNothing();
        }
        return false;
      }
      if (rets.length === 0) {
          this.showEmpty();
      }else {
        this.rets = rets;
        this.showList();
      }

    },
    cancelSearch:function() {
      var _this = this;
      this.keyword = '';
      this.showNothing();
      this.$emit('cancelsearch');

      // windowCloseThis();
    },
    doSearch:function(row,keyword) {
      var _this = this;
      this.keyword = keyword;
      this.searchWord = keyword;
      this.$emit('search',row,keyword);
      this.showNothing();
    }
  }
});
/*搜索栏 － 用于选择用户或字段 结束*/

/*筛选+搜索 目录*/

// groups: 分类数组
//search-data 搜索关键字列表
// hots常用热词
// p-attr 右侧显示数据键名
// pick-group 选择分类事件
// do-search 点击搜索结果事件

Vue.component('jk-dir',{
  template:' <div class="jk-dir"  v-cloak>\n' +
  '            <div class="jk-dir-handle">\n' +
  '                <div class="jk-dir-filter"\n' +
  '                     :class="{active:showFilterRet}"\n' +
  '                     v-show="!showSearch && showFilter"\n' +
  '                     @click="toggleFilterRet"\n' +
  '                ><span class="filter-title">' +
  '                   <span v-if="pickedField.text">{{pickedField.text}}</span>' +
  '                   <span v-if="!pickedField.text">筛选</span>' +
  '                   </span>\n' +
  '                    <i class="icon iconfont jk-arrow-down"></i>\n' +
  '                </div>\n' +
  '                <div class="jk-dir-search">\n' +
  '                   <div class="search-bar" id="search-bar">'+
  '                   <div class="search-content">'+
  '                   <div class="search-words">'+
  '                   <div class="search-icon"><i class="icon iconfont jk-search"></i></div>'+
  '                   <input type="text" class="search-input" :placeholder="placeholder" v-model="keyword" @focus="searchFocus" @blur="searchBlur" ref="search">'+
'                    <div class="search-icon search-cancel"  @click="keyword=\'\'" v-show="showClear"><i class="icon iconfont jk-clear"></i></div>'+
'                    </div>'+
  '                   <div class="search-cancel" @click="cancelSearch">取消</div>'+
  '                   </div>'+
  '                   <div class="search-ret">'+
  '                   <div class="ret-list"  v-if="showRetList" v-cloak>'+
  '                   <div class="ret-row click-effect" v-for="ret in rets" v-if="rets"  @click="doSearch(ret,ret[ret.attr])">'+
  '                   <div class="ret-text ">{{ret[ret.attr]}}</div>'+
  '                   <div class="kind" >'+
  '                   <span class="kind-text" @click.stop="doSearch(ret,ret[pAttr])">{{ret[pAttr]}}</span>'+
  '                   </div>'+
  '                   </div>'+
  '                   </div>'+
  '                   <div class="ret-default" v-if="showRetDefault" v-cloak>'+
  '                   <div class="ret-row" v-if="showRetEmpty">'+
  '                   <div class="ret-text text-center">没有找到相关类目</div>'+
  '                   </div>'+
  '                   <div class="ret-title" v-if="showHot">常用</div>'+
  '                   <div class="ret-row click-effect" v-if="showHot" v-for="hot in hots" @click="doSearch(hot,hot[pAttr])">'+
  '                   <div class="ret-text ">{{hot[pAttr]}}</div>'+
  '                   </div>'+
  '                   </div>'+
  '                   </div>'+
  '                   </div>'+
//   '                    <jk-search-bar\n' +
//   '                            :hots="hots"' +
// '                              :search-data="searchData"\n' +
// '                              :p-attr="pAttr"\n' +
//   '                            v-on:searchfocus="searchFocus"\n' +
//   '                            v-on:cancelsearch="searchCancel"\n' +
//   '                            v-on:search="doSearch">\n' +
//   '                    </jk-search-bar>\n' +
  '                </div>\n' +
  '            </div>\n' +
  '            <div class="jk-dir-ret" v-show="showRet">\n' +
  '                <transition name="filter-box" enter-active-class="animated fadeInDown">\n' +
  '                <div class="filter-box " v-show="showFilterRet" >\n' +
  '                    <div class="filter-item "\n' +
  '                         :class="{active:pickedFieldIndex === index}"\n' +
  '                         v-for="(field,index) in groups"\n' +
  '                         @click.stop="pickField(field,index)"\n' +
  '                    >{{field.text}}</div><!--:class="{\'filter-show-ani\':showFilterRet}"-->\n' +
  '                </div>\n' +
  '                </transition>\n' +
  '            </div>\n' +
  '        </div>',
  props:{
    /*search*/
    resource:'',
    field:'',
    pAttr:{
      default:'name'
    },
    placeholder:{
      default:'请输入要搜索的部门名称'
    },
    showHot:{default:false},
    searchData:{
      default:function() {
        return [
          {
            id:1,
            name:'冀凯河北机电科技有限公司'
          },
          {
            id:'M01',
            name:'办公室',
          },
          {
            id:'M0101',
            name:'办公室直属组',
          },{
            id:'M0102',
            name:'商务中心',
          },
          {
            id:'M0103',
            name:'餐饮部后厨组',
          },
          {
            id:'M0104',
            name:'车辆中心',
          },
          {
            id:'M0105',
            name:'网络中心',
          },{
            id:'M02',
            name:'人力资源部'},

          {
            id:'M0201',
            name:'人力资源部招录组',
          },
          {
            id:'M0202',
            name:'人力资源部人事组',
          },
          {
            id:'M0203',
            name:'人力资源部考核办',
          },
          {
            id:'M0204',
            name:'安全保卫科',
            value:'人人人人人'
          }
        ]
      }
      // type:'Array'
    },
    hots:{
      default:function() {
        return [
          {
            id:'M0101',
            name:'办公室直属组'
          },
          {
            id:'M0104',
            name:'车辆中心'
          },
          {
            id:'M0204',
            name:'安全保卫科'
          }
        ]
      }
    },
    /*search end*/
    showFilter:{default:!0},
    groups:{
      default:function(){
        return[
          {text:'气动顶锚杆钻机变更'},
          {text:'气动顶锚杆钻机'},
          {text:'临时支护'},
          {text:'混凝土喷射机'},
          {text:'液压顶锚杆钻机'},
          {text:'张拉机具及辅具'},
          {text:'其他支具机具'},
          {text:'测试'}
        ]
      }
    },
    /* 重复属性 searchData pAttr hots */
  },
  data:function() {
    return {
      /*search*/
      retArr:[],
      keyword:'',
      rets:[],
      showRetList:false,
      showRetDefault:false,
      showRetEmpty:false,
      showClear:false,
      searchWord:'',
      inputFocus:false,
      /*search end*/
      showRet:false,
      showSearch:false,
      showFilterRet:false,
      pickedFieldIndex:-1,
      pickedField:{}
    }
  },
  watch:{
    keyword:function() {
      this.showClear = (this.keyword !== '');
      if (this.searchWord === this.keyword && this.keyword !== '') { //确定搜索后不再显示列表
        this.showNothing();
        return false;
      }
      this.searchWord = '';
      this.getRets();
    }
  },
  mounted:function () {
    var _this = this;
  },
  methods:{
    /*search*/
    dataToArr:function(data,pData) {
      pData = pData || {name:''};
      data.forEach(function(val,index) {
        _this.retArr.push({name:val.name,id:val.id,pName:pData.name})
        if (val['children'] && val['children'].length > 0) {
          _this.dataToArr(val['children'],val);
        }
      });
    },
    showDefault:function(){
      this.showRetDefault = true;
      this.showRetEmpty = false;
      this.showRetList = false;
    },
    showEmpty:function(){
      this.showRetDefault = true;
      this.showRetEmpty = true;
      this.showRetList = false;
    },
    showList:function() {
      this.showRetList = true;
      this.showRetDefault = false;
      this.showRetEmpty = false;
    },
    showNothing:function(){
      this.showRetList = false;
      this.showRetDefault = false;
      this.showRetEmpty = false;
    },
    searchFocus:function(){
      this.inputFocus = true;
      this.$emit('searchfocus');
      /*dir*/
      this.showSearch = true;
      this.showRet = true;
      this.showFilterRet = false;
      /*dir */
      this.getRets();
    },
    searchBlur:function() {
      this.inputFocus = false;
      this.$emit('searchblur');
    },
    getRets:function() { //搜索树
      var _this = this;
      var rets = [];
      this.retArr = JSON.parse(JSON.stringify({value:this.searchData})).value;
      this.retArr.forEach(function(item) {
        for(var at in item ) {
          var attrValue = item[at]+'';
          if (attrValue.indexOf(_this.keyword) >= 0){
            var itemTmp = JSON.parse(JSON.stringify(item));
            itemTmp['attr'] = at;
            rets.push(itemTmp);
          };
        }
      })

      if (this.keyword === '' ) {
        if (this.inputFocus) {
          this.showDefault();
        } else {
          this.showNothing();
        }
        return false;
      }
      if (rets.length === 0) {
        this.showEmpty();
      }else {
        this.rets = rets;
        this.showList();
      }

    },
    cancelSearch:function() {
      var _this = this;
      this.keyword = '';
      this.showNothing();
      this.showSearch = false;
      this.showRet = false;
      this.$emit('cancelsearch');


      // windowCloseThis();
    },
    doSearch:function(row,keyword) {
      var _this = this;
      this.keyword = keyword;
      this.searchWord = keyword;
      this.showNothing();
      this.$emit('search',row,keyword);
      this.toggleRet();
    },
    /*search end*/
    // searchFocus:function() {
    //   this.showSearch = true;
    //   this.showRet = true;
    //   this.showFilterRet = false;
    // },
    // cancelSearch:function() {
    //   this.showSearch = false;
    //   this.showRet = false;
    // },
    toggleRet:function() {
      this.showRet = !this.showRet;
    },
    toggleFilterRet:function(){
      this.toggleRet();
      this.showFilterRet = !this.showFilterRet;
    },
    // doSearch:function(ret,keyWord) {
    //   this.$emit('search',ret,keyWord);
    //   this.toggleRet();
    // },
    pickField:function(field,index) {
      this.pickedFieldIndex = (this.pickedFieldIndex === index) ? -1 : index;
      this.pickedField = this.pickedFieldIndex === -1 ? {}:field;
      this.toggleFilterRet();
      this.$emit('pick-group',field,this.pickedFieldIndex)
    },
    closeDir:function() {
      this.showFilterRet = false;
      this.searchCancel();
      this.showRet = false;
    }
  }
})
/*筛选+搜索 目录 结束*/

/*自定义显示字段*/
// fields-arr 字段列表
// do-checked选择/取消选择字段事件
Vue.component('jk-custom-fields',{
  template:'<div class="jk-custom-fields" v-cloak>\n' +
  '                <div class="title" :class="{active:showFieldContent}"  @click="showFieldContent = !showFieldContent" >\n' +
  '                    <span>当前显示字段</span>\n' +
  '                    <i class="icon iconfont jk-arrow-right"></i>\n' +
  '                </div>\n' +
  '                <div class="field-content" v-show="showFieldContent">\n' +
  '                    <label class="custom-fields" v-for="(item,index) in fieldsArr">\n' +
  '                        <input type="checkbox"   v-model="fieldsChecked" :value="item">\n' +/* @click="preventCheck"*/
  '                        <div class="text">{{item[attr]}}</div>\n' +
  '                    </label>\n' +
  '                </div>\n' +
  '            </div>',
  props:{
    attr:{
      default:function () {
        return 'sFieldCaption'
      }
      },
    fieldsArr:{
      default:function () {
        return []
      },
    },
    defaultFields:{
      default:function() {
        return [];//{"sFieldCaption":"产品编码","sFieldNameEx":"cInvCode"}
      },
    }
  },
  data:function () {
    return {
      showFieldContent:false,
      fieldsChecked:[]
    }
  },
  watch:{
    fieldsChecked:function () {
      this.handleField();
    }
  },
  mounted:function(){
    this.fieldsChecked = this.defaultFields;
  },
  methods:{
    handleField:function() {
      // if (this.fieldsChecked.length > 3) {
      //   windowToast('最多只能选择三个自定义字段');
      //   this.fieldsChecked = this.fieldsChecked.filter(function(item,index){
      //     return index < 3;
      //   });
      //   return false;
      // }
      this.$emit('do-checked',this.fieldsChecked);
    },
    preventCheck:function (e) {
      e.preventDefault();
    }
  }
});
/*自定义显示字段 结束*/

/* jk-no-data */
/*
 data-source绑定json数据，判断其中的list是否为空数据,
 arr-source 绑定array数据 ,判断该数组是否为空数据
 :img 为显示的图片
 :msg 为显示的文字
 文字slot name为msg
 fontStyle绑定文字样式
 imgStyle: 绑定图片样式
 */
Vue.component('jk-no-data', {
  template: '<div class="jk-no-data" :data-source="dataSource" :arr-source="arrSource" :img="img" :msg="msg"  v-if="show">'+
          '<div class="jk-img">'+
              '<img  :style="imgStyle" :src="img">'+
          '</div>'+
          '<div class="jk-text"  :style="msgStyle" >'+
              '<slot name="msg">'+
                '<div v-html="msg"></div>'+
              '</slot>'+
          '</div>'+
      '</div>',
  props:{
    msg:{default:'暂无相关数据'},
    img: {default: "public/images/nodata.png"},
    dataSource:{},
    arrSource: {},
    msgStyle:{},
    imgStyle:{}
  },
  computed:{
    show:function () {
      try {
        if (Boolean(this.arrSource)) {
          return (Boolean(this.arrSource) && Boolean(this.arrSource.length - 0 === 0))
        } else {
          return (Boolean(this.dataSource) && Boolean(this.dataSource.list) && Boolean(this.dataSource.list.length - 0 === 0));
        }
      } catch (error) {
        return true;
      }
    }
  }
})
/* jk-no-data-end */
/*jk-item-pages*/
/*
* list 要进行分项的数据列表 类型为数组
* */
Vue.component('jk-item-pages',{
  template:'<div class="jk-item-pages">\n' +
  '        <div class="item-pages-toggle text-center">' +
  '             <i class="page-control icon iconfont jk-sanjiao-left click-effect" ' +
  '                :class="{\'color-primary\':currentPageIndex > 0}" ' +
  '                @click="prevPage"></i>' +
  '             <div class="toggle-center"  @click="clickPagesToggle">' +
  '               <i class="icon iconfont jk-arrow-down" v-show="showItemPages"></i>\n' +
  '               <span class="icon color-primary" v-show="!showItemPages">- {{currentPageIndex+1}} -</span>\n' +
  '             </div>\n' +
  '             <i class="page-control icon iconfont jk-sanjiao-right click-effect"' +
  '                :class="{\'color-primary\':currentPageIndex < pages.length-1}" ' +
  '                @click="nextPage"></i>' +
  '        </div>\n' +
  '        <div class="item-pages-btns" v-show="showItemPages">\n' +
  '            <div class="sale-pages">\n' +
  '                <label class="sale-page"\n' +
  '                       v-for="(page,index) in pages"\n' +
  '                       @click.prevent="handlePage(index)"\n' +
  '                >\n' +
  '                    <input type="checkbox" v-model="selectPages" :value="page">\n' +
  '                    <span class="text"\n' +
  '                          :class="{\'current-page\':currentPageIndex===index}"\n' +
  '                    >{{page.text}}</span>\n' +
  '                </label>\n' +
  '            </div>\n' +
  '            <div class="item-btns color-white" v-show="showPageBtns">\n' +
  '                <i class="icon iconfont jk-check click-effect" @click="selectCurrent"></i>\n' +
  '                <i class="icon iconfont jk-check-all click-effect" @click="selectAll"></i>\n' +
  '                <i class="icon iconfont jk-del click-effect" @click="delBillItem"></i>\n' +
  '                <i class="icon iconfont jk-add click-effect" @click="addBillItem"></i>\n' +
  '            </div>\n' +
  '        </div>\n' +
  '    </div>',
  props:{
    list:{
      default:function(){
       return [];
      }
    },
    currentPageIndex:0,
    showPageBtns:{default:false}
  },
  data:function() {
    return {
      currentPage:{},
      selectPages:[],
      showItemPages:false,
    }
  },

  computed:{
    pages:function() {
      var arr = [];
      if (this.list.length>0) {
        this.list.forEach(function(val,index) {
          arr.push({text:(index+1)+''})
        })
      }
      return arr;
    }
  },
  watch:{
    showPageBtns:function () {
      this.showItemPages = this.showPageBtns;
    }
  },
  mounted:function() {
    this.listenSwipe();
  },
  methods:{
    handlePage:function (index) {
      // this.currentPageIndex = index;
      this.$emit('handle-page',index);
    },
    selectCurrent:function () {
      var i = this.selectPages.indexOf(this.pages[this.currentPageIndex]);
      if (i < 0) {
        this.selectPages.push(this.pages[this.currentPageIndex]);
      } else {
        this.selectPages.splice(i,1);
      }
    },
    selectAll:function () {
      var _this= this;
      if (this.selectPages.length < this.pages.length) {
        this.selectPages = [];
        this.pages.forEach(function(page) {
          _this.selectPages.push(page);
        })
      } else {
        this.selectPages = [];
      }
    },
    clickPagesToggle:function () {
      this.showItemPages = !this.showItemPages
    },
    addBillItem:function () {
      this.$emit('add-bill-item');
    },
    delBillItem:function () {
      var _this = this;
        var num = this.selectPages.length;
        if (num === 0 ) {
          windowToast('请选择要删除的数据');
        }else {
          dialogAlert({
            type:'confirm',
            content:'确认要删除选中的'+num+'条数据吗'
          },function(ret) {
            if (ret.eventType === 'right') {
              _this.$emit('del-bill-item',_this.selectPages)
              //清空选中项
              _this.selectPages = [];
              //设置第一项为当前项
              _this.handlePage(0);
            }
          })
      }

    },
    nextPage:function() {
      if (this.currentPageIndex < this.pages.length - 1) {
        this.handlePage( this.currentPageIndex + 1 )
      } else {
        return false;
      }

    },
    prevPage:function () {
      if (this.currentPageIndex > 0) {
        this.handlePage( this.currentPageIndex - 1)
      } else {
        return false;
      }
    },
    /*监听数据项翻页*/
    listenSwipe:function() {
      var _this = this;
      addEventListenerW('swipeleft',function(ret) {

      })
      addEventListenerW('swiperight',function(ret) {

      })
    },
  }
})
/*jk-item-pages end*/
/*jk-bill-input*/
/*
value 数据项绑定值
entryType 数据项类型 input select checkbox date
date-type 日期类型 date_time date time
input-type 输入框type属性
select-arr 当type=select时 下拉列表的引用数据源

* */
Vue.component('jk-bill-entry',{
  template:'<div class="jk-bill-entry">' +
  '           <div class="info-item">\n' +
'               <div class="tag" :class="{disabled:disabled}">{{tag}}</div>\n' +
'               <div class="con" v-if="entryType===\'input\'">\n' +
'                  <input :type="inputType" class=" input-border-primary"' +
'                      :placeholder="placeholder"\n' +
'                      :value="value"' +
'                      v-on:input="$emit(\'input\',$event.target.value)"\n' +
'                      v-on:blur="$emit(\'blur\',$event.target.value)"\n' +
'                      :disabled="disabled"\n' +
'                   >\n' +
'                  <i class="icon iconfont jk-pick-item click-effect"\n' +
'                     @click="pickData"\n' +
'                     v-if="showPick"\n' +
'                  ></i>'+
'                </div>\n' +
'               <div class="con" v-if="entryType===\'textarea\'">\n' +
'                  <textarea rows="1" class=" input-border-primary"' +
'                      :placeholder="placeholder"\n' +
'                      :value="value"' +
'                      v-on:blur="$emit(\'blur\',$event.target.value)"\n' +
'                      v-on:input="handleTextareaHeight"\n' +
'                      ref="textarea"' +
'                      :disabled="disabled"\n' +
'                   ></textarea>\n' +
'                </div>\n' +
'                <span class="color-primary" v-if="total">{{total}}</span>' +
'                <div class="con" v-if="entryType===\'select\'">\n' +
'                  <select  class="input-border-primary"' +
'                      :value="value"' +
'                      v-on:change="$emit(\'change\',$event.target.value)"\n' +
'                      :disabled="disabled"\n' +
'                  >\n' +
'                    <option v-for="op in selectArr" :value="op[opValueAttr]">{{op[opStrAttr]}}</option>\n' +
'                  </select>' +
'                </div>\n' +
'              <label class="con" v-if="entryType===\'checkbox\'">\n' +
'                  <input type="checkbox" class="input-border-primary" \n' +
'                      :value="value"' +
'                      v-on:change="$emit(\'change\',$event.target.checked)"\n' +
'                      :disabled="disabled"\n' +
'                      :readonly="readonly"\n' +
'                   >\n' +
'                   <i class="icon iconfont jk-true color-success" v-show="value"></i>\n' +
'                   <i class="icon iconfont jk-false color-danger" v-show="!value"></i>\n' +
'               </label>' +
'               <div class="con" v-if="entryType===\'date\'">\n' +
'                  <input :id="dateId" type="text" class="input-border-primary"' +
'                      :date-type="dateType"' +
'                      :value="value"' +
'                     :frame-bounds="frameBounds"' +
'                      readonly' +
'                      :placeholder="placeholder" ' +
'                      data-lcalendar="2000-01-1,2050-12-31"' +
'                      :disabled="disabled"' +
  '                 />' +
'                </div>' +
  // '               <div class="con" v-if="entryType===\'date\'">\n' +
  // '                  <input type="text" class="input-border-primary" \n' +
  // '                      :value="value"' +
  // '                      :date-type="dateType"\n' +
  // '                      :placeholder="placeholder"\n' +
  // '                      @click="setDateTime"' +
  // '                      readonly' +
  // '                      :disabled="disabled" ' +
  // '                   >\n' +
  // '                </div>' +
'            </div>' +
'         </div>',
  props:{
    value:'',
    entryType:{default:'input'},
    inputType:{default:'text'},
    tag:'',
    total:0,
    placeholder:{default:function() {
      return this.tag;
      }},
    disabled:{default:false},
    readonly:{readonly:false},
    // dateType:{
    //   default:'date_time' // date_time date time
    // },
    /*select*/
    selectArr:{
      default:function () {
        return [];
      }},
    opValueAttr:{default:'value'},
    opStrAttr:{default:'text'},
    /*pick-data*/
    dataPage:{default:'common-dir'},
    dataSource:{default:'bill'},
    index:{default:-1},
    headField:{default:'head'},
    listField:{default:'list'},
    require:{default:function() {return {}}},
    showPick:{default:false},
    /*滚动日期时间*/
    frameBounds:{default:false},
    dateValue:{
      default:''
    },
    dateType:{
      default:'date_time' // date_time date time
    },
    
  },

  data:function(){
    return {
      calendar:null,
      dateId:'id'+Math.ceil(Math.random()*1000) +''+ Math.ceil(Math.random()*1000)
    }
  },
  mounted:function() {
    var t = this;
    setTimeout(function () {
      t.handleTextareaHeight();
    },0);
    //初始化滚动日期时间
    if (this.entryType === 'date') {
      this.calendar = new lCalendar();
      this.calendar.init({
        'frameBounds':this.frameBounds,
        'trigger': '#'+this.dateId,
        'type': this.dateType,
        'callBack':this.setTimeData
      });
    }
   
  },
  methods:{
    setDateTime:function() {
      var setting = {};
      setting.type = this.dateType;
      setDateTime(setting,this.setTimeData);
    },
    setTimeData:function (str) {
      this.$emit('set-data',str);
      this.$emit('set-data',str);
    },
    handleTextareaHeight:function (e) {
      //textarea高度自适应
      if (e) {
        this.$emit('input',e.target.value);
      }
      if (this.$refs.textarea) {
        this.$refs.textarea.style.height='auto';
        this.$refs.textarea.style.height= this.$refs.textarea.scrollHeight + 'px';
      }

    },
    pickData:function() {
      this.$emit('pick-data');return false;
      /*
      rb= [
        {rf:'原字段',bf:'返回的字段'}
      ]
      * */
      var _this = this;
      var resource = api.frameName;
      var index = this.index;
      var headField = this.headField;
      var listField = this.listField;
      var dataSource = this.dataSource;
      var require = this.require;
      // myConsole(require)
      // return false;
      changeTo(this.dataPage,{
        resource:resource,
        args:require
      });
      addEventListenerW('pickdata',function(ret){
        var data = ret.value.data;
        if (ret.value.pickType - 0 === 1) {
          data = ret.value.data[0];
        }
        if (ret.value.resource === resource) {
          if (require.rb) {
            require.rb.forEach(function(v,i) {
              v.bf = v.bf || v.rf;
              _this.$emit('set-data',{
                  dataSource:dataSource,
                  headField:headField,
                  listField:listField,
                  index:index,
                  sourceField:v.rf,
                  backField:data[v.bf]
                }
              );
            })
          }
        }
      })
    }
  }
})
/*jk-bill-input end*/
/*jk-load-more*/
Vue.component('jk-load-more',
  {
    template:'<div class="jk-load-more" :style="{transform:transform}">' +
    '<div class="top-text text-center" v-show="translate>0">{{topText}}</div>' +
    '<slot>' +
    '</slot>' +
    '<div class="top-text text-center" v-show="translate<0">{{bottomText}}</div>' +
    '</div>',
    props: {
      maxDistance: {type: Number, default: 0},
      autoFill: {type: Boolean, default: !0},
      distanceIndex: {type: Number, default: 2},
      topPullText: {type: String, default: "下拉刷新"},
      topDropText: {type: String, default: "释放更新"},
      topLoadingText: {type: String, default: "加载中..."},
      topDistance: {type: Number, default: 70},
      topMethod: {type: Function},
      bottomPullText: {type: String, default: "加载更多"},
      bottomDropText: {type: String, default: "加载更多"},
      bottomLoadingText: {type: String, default: "加载中..."},
      bottomDistance: {type: Number, default: 70},
      bottomMethod: {type: Function},
      bottomAllLoaded: {type: Boolean, default: !1}
    },
    data: function () {
      return {
        translate: 0,
        scrollEventTarget: null,
        containerFilled: !1,
        topText: "",
        topDropped: !1,
        bottomText: "",
        bottomDropped: !1,
        bottomReached: !1,
        direction: "",
        startY: 0,
        startScrollTop: 0,
        currentY: 0,
        topStatus: "",
        bottomStatus: ""
      }
    },
    computed: {
      transform: function () {
        return 0 === this.translate ? null : "translate3d(0, " + this.translate + "px, 0)"
      }
    },
    watch: {
      topStatus: function (t) {
        switch (this.$emit("top-status-change", t), t) {
          case"pull":
            this.topText = this.topPullText;
            break;
          case"drop":
            this.topText = this.topDropText;
            break;
          case"loading":
            this.topText = this.topLoadingText
        }
      }, bottomStatus: function (t) {
        switch (this.$emit("bottom-status-change", t), t) {
          case"pull":
            this.bottomText = this.bottomPullText;
            break;
          case"drop":
            this.bottomText = this.bottomDropText;
            break;
          case"loading":
            this.bottomText = this.bottomLoadingText
        }
      }
    },
    methods: {
      onTopLoaded: function () {
        var t = this;
        this.translate = 0, setTimeout(function () {
          t.topStatus = "pull"
        }, 200)
      }, onBottomLoaded: function () {
        var t = this;
        this.bottomStatus = "pull", this.bottomDropped = !1, this.$nextTick(function () {
          t.scrollEventTarget === window ? document.body.scrollTop += 50 : t.scrollEventTarget.scrollTop += 50, t.translate = 0
        }), this.bottomAllLoaded || this.containerFilled || this.fillContainer()
      }, getScrollEventTarget: function (t) {
        for (var e = t; e && "HTML" !== e.tagName && "BODY" !== e.tagName && 1 === e.nodeType;) {
          var n = document.defaultView.getComputedStyle(e).overflowY;
          if ("scroll" === n || "auto" === n) return e;
          e = e.parentNode
        }
        return window
      }, getScrollTop: function (t) {
        return t === window ? Math.max(window.pageYOffset || 0, document.documentElement.scrollTop) : t.scrollTop
      }, bindTouchEvents: function () {
        this.$el.addEventListener("touchstart", this.handleTouchStart), this.$el.addEventListener("touchmove", this.handleTouchMove), this.$el.addEventListener("touchend", this.handleTouchEnd)
      }, init: function () {
        this.topStatus = "pull", this.bottomStatus = "pull", this.topText = this.topPullText, this.scrollEventTarget = this.getScrollEventTarget(this.$el),(this.fillContainer(), this.bindTouchEvents()),this.bindTouchEvents()
      }, fillContainer: function () {
        var t = this;
        this.autoFill && this.$nextTick(function () {
          t.scrollEventTarget === window ? t.containerFilled = t.$el.getBoundingClientRect().bottom >= document.documentElement.getBoundingClientRect().bottom : t.containerFilled = t.$el.getBoundingClientRect().bottom >= t.scrollEventTarget.getBoundingClientRect().bottom, t.containerFilled || (t.bottomStatus = "loading", t.bottomMethod())
        })
      }, checkBottomReached: function () {
        return this.scrollEventTarget === window ? document.body.scrollTop + document.documentElement.clientHeight >= document.body.scrollHeight : this.$el.getBoundingClientRect().bottom <= this.scrollEventTarget.getBoundingClientRect().bottom + 1
      }, handleTouchStart: function (t) {
        this.startY = t.touches[0].clientY, this.startScrollTop = this.getScrollTop(this.scrollEventTarget), this.bottomReached = !1, "loading" !== this.topStatus && (this.topStatus = "pull", this.topDropped = !1), "loading" !== this.bottomStatus && (this.bottomStatus = "pull", this.bottomDropped = !1)
      }, handleTouchMove: function (t) {
        if (!(this.startY < this.$el.getBoundingClientRect().top && this.startY > this.$el.getBoundingClientRect().bottom)) {
          this.currentY = t.touches[0].clientY;
          var e = (this.currentY - this.startY) / this.distanceIndex;
          this.direction = e > 0 ? "down" : "up","down" === this.direction && 0 === this.getScrollTop(this.scrollEventTarget) && "loading" !== this.topStatus && (t.preventDefault(), t.stopPropagation(), this.maxDistance > 0 ? this.translate = e <= this.maxDistance ? e - this.startScrollTop : this.translate : this.translate = e - this.startScrollTop, this.translate < 0 && (this.translate = 0), this.topStatus = this.translate >= this.topDistance ? "drop" : "pull"), "up" === this.direction && (this.bottomReached = this.bottomReached || this.checkBottomReached()),
          "up" === this.direction && this.bottomReached && "loading" !== this.bottomStatus && !this.bottomAllLoaded && (t.preventDefault(), t.stopPropagation(), this.maxDistance > 0 ? this.translate = Math.abs(e) <= this.maxDistance ? this.getScrollTop(this.scrollEventTarget) - this.startScrollTop + e : this.translate : this.translate = this.getScrollTop(this.scrollEventTarget) - this.startScrollTop + e, this.translate > 0 && (this.translate = 0), this.bottomStatus = -this.translate >= this.bottomDistance ? "drop" : "pull"), this.$emit("translate-change", this.translate)
        }
      }, handleTouchEnd: function () {
        "down" === this.direction && 0 === this.getScrollTop(this.scrollEventTarget) && this.translate > 0 && (this.topDropped = !0, "drop" === this.topStatus ? (this.translate = "50", this.topStatus = "loading",  'function' == typeof this.topMethod?this.topMethod():this.onTopLoaded()) : (this.translate = "0", this.topStatus = "pull")), "up" === this.direction && this.bottomReached && this.translate < 0 && (this.bottomDropped = !0, this.bottomReached = !1, "drop" === this.bottomStatus ? (this.translate = "-50", this.bottomStatus = "loading", 'function' === typeof this.bottomMethod?this.bottomMethod():this.onBottomLoaded()) : (this.translate = "0", this.bottomStatus = "pull")), this.$emit("translate-change", this.translate), this.direction = ""
      }
    },
    mounted: function () {
      this.init()
    }
  }
)
/*jk-load-more end*/