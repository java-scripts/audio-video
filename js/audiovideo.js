window.requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame || function(callback) {
      window.setTimeout(callback, 1000 / 60);
  };
})();

navigator.getUserMedia = (navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia);



startWebCamVideo = function(options) {
  var settings = $.extend({
    video: true,
    audio: false,
    error: function(msg) {
      console.log(msg);
    }
  }, options);
  //taking element reference
  var target = $(settings.target)[0];
  if (navigator.getUserMedia) {
    navigator.getUserMedia(settings,
      function(stream) {
        var url = window.URL || window.webkitURL;
        target.src = url ? url.createObjectURL(stream) : stream;
        target.play();
      },
      function(error) {
        settings.error(error);
      });
    $.each(options, function(name, f) {
      if ($.isFunction(f)) {
        $(target).on(name, f);
      }
    });
  }
};




function drawStream(options) {
  console.log('drawStreamStarted....');
  var settings = {
    framerate: 1,
    getData: function(imageData, data) {},
    setData: function(imageData, data) {},
  };
  settings = $.extend(settings, options);
  var canvas = $(settings.canvas)[0];
  var context = canvas.getContext("2d");
  var video = $(settings.video)[0];

  function draw(settings, time) {
    window.setTimeout(function() {
      draw(settings, time);
    }, time);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    settings.getData(imageData);
    var data = settings.setData(imageData);
    if (data) {
      context.putImageData(data, 0, 0);
    }
  }
  draw(settings, 1000 / settings.framerate);
}



imageUtil = {
  diff: function(imgdata1, imgdata2) {
    var sum = 0;
    var data1 = imgdata1.data;
    var data2 = imgdata2.data;
    for(var i=0;i<data1.length-4;i+=4){
      sum += Math.abs(data1[i] - data2[i]);
    }
    return sum;
  }
}