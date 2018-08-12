
function __init ( ) {
}

function initPush (alias,tag) {
  var ajpush = api.require('ajpush');
  ajpush.init(function(ret) {
    if (ret && ret.status){
      //success
      getId();
      pushClick();
    }
  });
}
function getId() {
  var ajpush = api.require('ajpush');
  ajpush.getRegistrationId(function(ret) {
    var registrationId = ret.id;
  });
}
function bindPush (alias,tags) {
  var ajpush = api.require('ajpush');
  ajpush.bindAliasAndTags(
    {alias:alias,tags:tags},
    function(ret) {
      var statusCode = ret.statusCode;
    });
}
function unBindPush() {
  var ajpush = api.require('ajpush');
  if (!ajpush) return false;
  ajpush.bindAliasAndTags(
    {alias:'',tags:[]},
    function(ret) {
      var statusCode = ret.statusCode;
    });
}
function pushClick () {
  api.addEventListener({
    name: 'appintent'
  }, function(ret, err) {
    if (ret && ret.appParam.ajpush) {
      var ajpush = ret.appParam.ajpush;
      var id = ajpush.id;
      var title = ajpush.title;
      var content = ajpush.content;
      var extra = ajpush.extra;
      switch (extra.PushType) {
        case 'TodoTask': //待审批
          var setting = {
            type:'check',
            curd:0,
            param:extra
          };
          changeTo('common-check-bill',{setting:setting});
          break;
        case 'WaitTask': //待完成
          sendEventW('pushWaitTask',extra);
          break;
        default:
          break;
      }
      
    }
  })
}