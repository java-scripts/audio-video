$(function() {
  progress = $('#progress');
  imageData0 = null;
  
});

function startWebCam() {
  startWebCamVideo({
    target: $("#video"),
    width: $("#video").width(),
    height: $("#video").height(),
    play: function() {
      console.log('allowed to play......');
    },
    canplay: function() {
      console.log('can play......');
	  $('#step2Result').hide().next().show();
      process();
    },
    error: function(msg) {
      console.log({
        errorName: msg.name
      });
    }
  });
  
  function process() {
    drawStream({
      video: $("#video"),
      canvas: $('#canvas'),
      framerate: 4,
      getData: function(imageData) {
        //console.log({getdata:imageData})
        if (imageData0) {
          diff = imageUtil.diff(imageData, imageData0);
		  progressVal =diff / 1000 
          progress.val(progressVal);		 			
		  playAudio(progressVal);		 
        }
        imageData0 = imageData;
      }
    });
  }
}