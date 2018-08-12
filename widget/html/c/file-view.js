$ready = function () {
  new Vue({
    el:'#app',
    data:{
      pdfUrl:'',
      bills:[
        {icon:'jk-dingdan',text:'查看文件',color:''},

      ]
    },
    mounted:function () {
      frameSetbounces();
      this.renderPdf();
    },
    methods:{
      renderPdf:function () {
        var _this = this;
       /* api.openFrame({
          // name: 'group' + relaodtag,
          name:'pdfs',
          scrollEnabled: true,
          rect: {
            x: 0,
            y: 0,
            w: 'auto',
            h: 'auto'
          },
          pageParam: '',
          vScrollBarEnabled: false,
          hScrollBarEnabled: false,
          scaleEnabled: true,
          bounces: false,
          url: gConfig.HTML_PRE + 'public/pdf/generic/web/viewer.html?file='+gConfig.HTML_PRE+'public/file/test.pdf'
        });
*/

        /*var url = 'public/file/test.pdf';
        PDFJS.workerSrc = 'public/generic/build/pdf.worker.js';
        PDFJS.getDocument(url).then(function getPdf(pdf) {
          alert(1)

          pdf.getPage(1).then(function getPage(page) {
            var scale = 1;
            var viewport = page.getViewport(scale);
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            var renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            page.render(renderContext);
          });
        });*/
      }
    }
  })
}