/**
 * Created by Administrator on 2017/12/23.
 */

/*ws-confirm*/
Vue.component('ws-confirm',{
  template:`<div class="ws-confirm ws-ui " :title="title" :msg="msg" :type="type" v-show="show">
        <div class="ws-confirm-box">
            <div class="ws-confirm-title text-center" >{{title}}</div>
            <div class="ws-confirm-content">
               <p class="text-center">{{msg}}</p>
               <slot></slot>
            </div>
            <div class="ws-confirm-footer text-center source-btn-box">
                <div class="ws-confirm-button btn large source-btn" @click="cancel" v-if="cancelShow">取消</div>
                <div class="ws-confirm-button btn large source-btn" @click="submit" v-if="submitShow">确认</div>
            </div>
        </div>
    </div>`,
  props:{
    title:{default:'提示'},
    msg:{},
    type:{default:'alert'},
    show:{default:false}
  },
  mounted:function() {
    switch (this.type) {
      case 'alert':
        this.submitShow = true;
        break;
      case 'confirm':
        this.submitShow = this.cancelShow = true;
        break;
      default:
        break;
    }
  },
  data:function() {
    return {
      submitShow:false,
      cancelShow:false
    }
  },
  methods:{
    submit:function(){
      this.$emit('submit');
      this.close();
    },
    close:function() {
      this.$emit('close');
      this.show = false;
    },
    cancel:function(){
      this.$emit('cancel');
      this.close();
    }
  }
});
/*ws-confirm  end*/
/*ws-top-item*/
/*顶部列表项
text:文字，
icon:图标链接,
font-size:文字 字号 默认14px
 icon-width:图标宽度 默认40px
* */
Vue.component('ws-top-item',{
  template:`<div class="ws-top-item" :text="text" :icon="icon" :font-size="fontSize" :icon-width="iconWidth">
                <div class="ws-top-item-icon">
                    <img class="ws-top-img" :src="icon" :style="{width:iconWidth,height:iconWidth}">
                </div>
                <div class="ws-top-item-text">
                    <p :style="{fontSize:fontSize}">{{text}}</p>
                </div>
            </div>
            `,
  props:{
    text:{default:''},
    icon:{default:'public/images/top-item.jpg'},
    fontSize:{default:'14px'},
    iconWidth:{default:'40px'}
  },
  mounted:function(){
  },
  data:function() {
    return {
      // fontSize:20
    }
  }
});
/*ws-top-item end*/
/*ws-list-item*/
/*
title:列表项标题  重写样式类 .ws-list-item .ws-content .ws-title 重写slot name=title
tip:列表项右侧文字  重写样式类 .ws-list-item .ws-content .ws-tip 重写slot name=tip
 icon:左侧图标图片链接 右侧箭头类型 三种状态 img 为图片 icon为字体图标 为none不显示 默认值为img 重写样式.ws-list-item .ws-icon
 icon-img:左侧图标为img时的图片路径
 icon-icon:左侧图标为icon时的iconfont类
 link,link-img,link-icon 右侧图标参数 同左侧 icon参数
* */
Vue.component('ws-list-item',{
  name:'ws-list-item',
  template:`<div class="ws-list-item" :link="link" :title="title" :tip="tip" :icon="icon" :link-icon="linkIcon" :link-img="linkImg" 
 :icon-img="iconImg" :icon-icon="iconIcon">
        <div class="ws-icon" v-if="icon!='none'">
            <i class="ws-iconcont iconfont" v-if="icon=='icon'" :class="iconIcon"></i>
            <img :src="iconImg" v-if="icon=='img'">
        </div>
        <div class="ws-content">
          <div class="ws-title" v-if="title!='none'">
              <slot name="title" >
              <div v-html="title"></div>
            </slot>
          </div>
          <div class="ws-tip" v-if="tip!='none'">
            <slot name="tip">
                <div v-html="tip"></div>
            </slot>
          </div>
        </div>
        
        <div class="ws-link-icon" v-if="link!='none'">
            <i class="ws-iconcont iconfont" v-if="link=='icon'" :class="linkIcon"></i>
            <img :src="linkImg" v-if="link=='img'">
        </div>
    </div>`,
  props:{
    icon:{default:'img'},
    iconImg:{default:'public/images/ws-list-icon.jpg'},
    iconIcon:{},
    link:{default:'img'},
    title:{},
    tip:{},
    linkIcon:{},
    linkImg:{default:'public/images/right.png'},
  },
});
/*ws-list-item end*/
/*ws-list-item end*/
/* ws-no-data */
/*
 data-source绑定json数据，判断其中的list是否为空数据,
 arr-source 绑定array数据 ,判断该数组是否为空数据
 :img 为显示的图片
 :msg 为显示的文字
 文字slot name为msg
 fontStyle绑定文字样式 //暂时不能用
 imgStyle: 绑定图片样式 //暂时不能用
 */
Vue.component('ws-no-data', {
  template: ` <div class='ws-no-data' :data-source='dataSource' :arr-source='arrSource' :img='img' :msg='msg'  v-if='show'>
          <div class='ws-img'>
              <img :img-style='imgStyle' :src="img">
          </div>
          <div class='ws-text' :style='{msgStyle}' >
              <slot name='msg'>
                <div v-html='msg'></div>
              <slot>
          </div>
      </div>`,
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
/* ws-no-data-end */
/*ws-img-mask*/
//点击事件doClick
//显示隐藏 show
//点击事件 doClick
Vue.component('ws-img-mask',{
  template:`
  <div class='ws-img-mask' v-show='show' @click='doClick'>
    <div class='ws-img'>
      <img :src='imgPath'>
    </div>
  </div>
 `,
  props:{
    show:{default:false},
    imgPath:{default:''}
  },
  methods:{
    doClick:function () {
      this.$emit('doClick')
    }
  }
})
/*ws-img-mask end*/
/* ws-virtual-keyboard */
//提交emit事件 virtual-submit 返回值是密码 pwd值
//清空事件 clear
//清空并取消焦点 close
//获取焦点 show
//密码长度pwdLength 默认6
Vue.component('ws-virtual-keyboard',{
  template: `<div class="ws-pay-pwd " @click="setPwdFocus">
                <span class="text" v-for="dot in  pwdView">{{dot}}</span>
                <input type="tel" class="pwd-input" ref="payPwd" v-model="pwd">
            </div>`,

  props:{
    pwdLength:{default:6}
  },
  data:function() {
    return {
      pwd:"",
      // payPwdShow:false,
    }
  },

  computed:{
    pwdView: function () { //输入密码变成点
      var arr = [];
      for (var n = 0; n < this.pwdLength; n++) {
        arr.push('');
      }
      for (var i = 0; i < this.pwd.length && i < this.pwdLength; i++) {
        arr[i] = '·';
      }
      return arr;
    }
  },
  watch: {
    pwd: function () {
      if (this.pwd.length === this.pwdLength) {
        this.$emit('virtual-submit',this.pwd)
      }
    }
  },
  methods:{
    /*支付密码相关*/
    close: function () {
      this.setPwdBlur();
      setTimeout(function() {
        this.clear();
        // this.payPwdShow = false;
      }.bind(this),0)
    },
    clear:function() {
      this.pwd = '';
    },
    show: function () {
      // this.payPwdShow = true;
      setTimeout(this.setPwdFocus, 0);
    },
    setPwdFocus: function () {
      this.$refs.payPwd.focus();
    },
    setPwdBlur:function(){
      this.$refs.payPwd.blur();
    },
    /*支付密码相关结束*/
  }
})
/* ws-virtual-keyboard -end */
