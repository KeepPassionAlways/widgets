/**
 * 作者: 郭天琦
 * 创建时间: 2017/06/18
 * 版本: [1.0, 2017/06/18 ]
 * 描述: image compress
 */

(function(win, doc) {
	"use strict";

	var elUploadPic = doc.getElementById('upload-pic'),
		elPreview = doc.getElementById('preview'),
		elRange = doc.getElementById('range'),
		elCanvas = doc.getElementById('canvas'),
		elOutput = doc.getElementById('output'),
		elSource = doc.getElementById('source');

	var type;
	/**
	 * @description 事件监听
	 */
	function initListeners() {

		elUploadPic.addEventListener('change', function() {
			var file = this.files[0],
				fileType = file.type,
				fileReader = new FileReader();

			type = fileType.substring(fileType.indexOf('/') + 1);

			fileReader.readAsDataURL(file);

			fileReader.onload = function() {
				elPreview.src = this.result;
			};
		});

		elRange.addEventListener('mousemove', function() {
			elOutput.innerHTML = this.value;
		});

		elRange.addEventListener('change', function() {
			if(elPreview.getAttribute('src') == '') {
				return;
			}
			
			previewload.call(elPreview, this.value);
		});
	}

	initListeners();

	/**
	 * @description preloadView
	 */
	function previewload(quality) {
		quality = quality || 1;
		
		quality = quality / 10;
		
		var canvasWidth = this.width,
			canvasHeight = this.height,
			context = elCanvas.getContext('2d');

		// draws image params
		var sx = 0,
			sy = 0,
			sWidth = canvasWidth,
			sHeight = canvasHeight,
			dx = 0,
			dy = 0,
			dWidth = canvasWidth,
			dHeight = canvasHeight;

		elCanvas.width = canvasWidth;
		elCanvas.height = canvasHeight;

		context.drawImage(this, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
		console.log(this);
		var dataUrl = elCanvas.toDataURL('image/' + type, quality);

		elSource.src = dataUrl;
	}
	
	elPreview.onload = function() {
		previewload.call(this);	
	};

}(window, document));