var _this;
var vm;
$ready = function () {
  vm = new Vue({
    el: '#app',
    data: {
      fieldsArr:[],
      dir:{},
      titleField:'',
    },

    mounted: function () {
      t = this;
      this.dir = $_GET['dir'];
      this.fieldsArr = $_GET['fieldsArr'];
      this.titleField = $_GET['titleField'];
      setTitle(this.dir[this.titleField]);
      frameSetbounces();
    },
    methods: {

    }
  })
}
