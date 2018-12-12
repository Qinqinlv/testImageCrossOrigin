import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";

import "./styles.css";

class AddCropper extends React.Component {
  state = {
    urlForCrop: "",
    loading: true,
    visible: false,
    // testUrl是没有设置Cors响应头的跨域地址
    testUrl:
      "https://image.synnex.com/ec/CLOUDSolv/UAT/reseller/resources/resellerLogo/72684_logo-solvs_20180829021645964_4SeXP.png",
    // testUrl2是设置了Cors响应头的跨域地址
    testUrl2:
      "https://image.synnex.com/p1/us/uat/publicImages/storefront/US/19783b9c-b01e-4673-a3b2-fc4b395cb456.png"
  };
  componentDidMount = () => {
    this.addCanvas();
  };
  // 这里其实还有一个疑惑，就是在MDN上说，尽管没有Cors授权也可以在canvas中使用图像，但是这样会污染canvas画布。
  // 但是现在使用cropper组件的时候，如果传入的是一个没有Cors授权的url,根本就显示不出来。下面使用h5中的canvas标签重新测试。
  // 结论是 ：
  // 1. 上面的结论是正确的，我使用cropper组件的时候，如果图片地址是未设置Cors的跨域地址，且不添加crossOrigin='anonymous',
  // 不会显示出图片； 但是直接手写canvas是可以展示图片的。
  // 2. 只要img设置了crossOrigin='anonymous'，报ajax请求错误。由于图片根本进不了onload事件，所以canvas中根本不会渲染图片；
  // 3. 如果设置了onerror事件后还是drawImage这个跨域且无Cors授权的图片，那么会报错当前图片损坏；
  // 4. 如果请求的是一个有Cors的跨域url，但是image没有设置crossOrigin，图片虽然可以显示在canvas中，但是此时canvas中的这个图片是
  // 被污染了的图片，无法使用toDataURL()等方法。
  // 5. 但凡请求的是跨域地址，只有同时设置跨域url的Cors响应头和img对象的crossOrigin='anonymous'， canvas中的toDataURL和 toBlob等方法才能够被调用。
  addCanvas = () => {
    console.log("进入了自定义canvas代码中");
    let currentUrl = this.state.testUrl2;
    // const currentUrl = this.state.testUrl2;
    let cvs = document.getElementById("currentCanvas");
    cvs.width = 320;
    cvs.height = 60;
    var ctx = cvs.getContext("2d");
    ctx.moveTo(0, 0);
    ctx.lineTo(320, 0);
    ctx.lineTo(320, 60);
    ctx.lineTo(0, 60);
    ctx.closePath();
    ctx.stroke();
    let img = new Image();
    img.src = currentUrl;
    img.crossOrigin = "anonymous";
    img.onload = function() {
      ctx.drawImage(
        img,
        0,
        0,
        img.naturalWidth,
        img.naturalHeight,
        2,
        2,
        img.naturalWidth,
        img.naturalHeight
      );

      var dataURL = cvs.toDataURL();
      console.log("结束执行自定义canvas中的逻辑", dataURL);
      // 由于此时
    };
    img.onerror = function() {
      console.log("原生canvas中跨域请求图片失败");
      // index.js? [sm]:154 Uncaught DOMException: Failed to execute 'drawImage' on 'CanvasRenderingContext2D': The HTMLImageElement provided is in the 'broken' state.
      // ctx.drawImage(
      //   img,
      //   0,
      //   0,
      //   img.naturalWidth,
      //   img.naturalHeight,
      //   2,
      //   2,
      //   img.naturalWidth,
      //   img.naturalHeight
      // );
      console.log("结束执行自定义canvas中的逻辑");
    };
  };

  render() {
    let currentUrl = this.state.testUrl;
    // let currentUrl = this.state.testUrl2;
    return (
      <div className="originalCanvas">
        <canvas id="currentCanvas" />
      </div>
    );
  }
}

export default AddCropper;
