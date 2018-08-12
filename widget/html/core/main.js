require.config({
  paths: {
    "flexible": "../public/js/flexible",
    "api": "api",
    "vue": "vue",
    "lCalendar": "../public/lCalendar/lCalendar",
    "rcommon": "rcommon",
  },
  shim: {
    'vue':{
      exports: 'Vue'
    },
    'rcommon': {
      deps: ['vue'],
      exports: 'Rcommon'
    }
  }
});
require(
  ['flexible',
    'vue',
    'api',
    'lCalendar'
  ], function (flexible,Vue,api,lCalendar,rcommon){
    document.write('<script src="c/' + 'test' + '.js' + '"></script>');
    document.write('<script src="core/' + 'rcommon' + '.js' + '"></script>');
  // some code here
  
});