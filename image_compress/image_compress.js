/**
 * 作者: 郭天琦
 * 创建时间: 2017/06/18
 * 版本: [1.0, 2017/06/18 ]
 * 描述: image compress
 */

(function (win, doc) {
    'use strict';

    var elUploadPic = doc.getElementById('upload-pic'),
        elPreview = doc.getElementById('preview'),
        elRange = doc.getElementById('range'),
        elOutput = doc.getElementById('output'),
        elSource = doc.getElementById('source'),
        download = doc.getElementById('download');

    var type;

    /**
     * @description 事件监听
     */
    function initListeners() {
        elUploadPic.addEventListener('change', function () {
            var file = this.files[0],
                fileType = file.type,
                fileReader = new FileReader();

            type = fileType.substring(fileType.indexOf('/') + 1);

            fileReader.readAsDataURL(file);

            fileReader.onload = function () {
                elPreview.src = this.result;
            };
        });

        elRange.addEventListener('mousemove', function () {
            elOutput.innerHTML = this.value;
        });

        elRange.addEventListener('change', function () {
            if (elPreview.getAttribute('src') == '') {
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

        console.log(quality);

        var canvas = document.createElement('canvas');
        var canvasWidth = this.width,
            canvasHeight = this.height,
            context = canvas.getContext('2d');

        // draws image params
        var sx = 0,
            sy = 0,
            sWidth = canvasWidth,
            sHeight = canvasHeight,
            dx = 0,
            dy = 0,
            dWidth = canvasWidth,
            dHeight = canvasHeight;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        context.drawImage(this, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

        var dataUrl = canvas.toDataURL('image/jpeg', quality);
        var fileBlob = base64ToBlob(dataUrl);

        download.classList.remove('hidden');

        download.href = window.URL.createObjectURL(fileBlob);
        download.download = 'pic';
        download.innerHTML = '下载图片';

        document.body.appendChild(download);
    }

    function base64ToBlob(b64) {
        var arr = b64.split(',');

        // 解码 b64 并且转换成 btype
        // 注意，这边 atob 必须解码的是没有 url 部分的 base64 值，如果带有 url 部分，解码会报错！
        var btypes = window.atob(arr[1]);
        var mime = arr[0].match(/:([^:]?.*[^;]?);/);

        // 处理异常，将ascii码小于0的转换为大于0
        var ab = new ArrayBuffer(btypes.length);
        // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
        var ia = new Uint8Array(ab);

        for (var i = 0, len = btypes.length; i < len; i++) {
            ia[i] = btypes.charCodeAt(i);
        }

        return new Blob([ab], {
            type: mime
        });
    }

    elPreview.onload = function () {
        previewload.call(this);
    };

}(window, document));