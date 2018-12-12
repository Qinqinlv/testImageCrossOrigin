import React from "react";
import ReactDOM from "react-dom";
import { Spin, Modal } from "antd";
import AddCanvas from "./AddCanvas";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "antd/dist/antd.css";

import "./styles.css";

class App extends React.Component {
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
    // this.estimateImageValidOrNot();
  };

  estimateImageValidOrNot = () => {
    this.setState({
      loading: true
    });
    let currentUrl = this.state.testUrl1;

    new Promise((res, rej) => {
      let imageObj = new Image(); // eslint-disable-line
      imageObj.setAttribute("crossOrigin", "Anonymous");
      imageObj.src = currentUrl;
      imageObj.onload = () => {
        console.log("这里是否请求成功？");
        // 如果这里的src是一个没有设置CORS的跨域图片，不管上面的crossOrigin
        // 属性有没有设置，这个图片还是可以被成功load的。
        // 结论是： 使用img标签在页面上可以渲染任意图片，不管是否跨域，不管img是否
        // 设置了crossOrigin属性，或者图片url接口设置了Cors响应头
        return res(imageObj);
      };
      imageObj.onerror = () => {
        console.log("这里是够请求失败？");
        // 当设置了crossOrigin的时候，获取没有设置Cors的图片会失败，报ajax请求失败。
        // 但是如果是用img装载该图片，还是可以显示在页面中的。
        return rej(imageObj);
      };
    })
      .then(() => {
        this.setState({
          urlForCrop: currentUrl
        });
      })
      .catch(e => {
        console.log("这里报错如何？", e);
        this.setState({
          urlForCrop: ""
        });
      });
  };
  createCropperRef = cropper => {
    this.cropperRef = cropper;
  };

  cropLogo = () => {
    let cropperRef = this.cropperRef;
    if (cropperRef && cropperRef !== null) {
      let currentCroppedCanvas = cropperRef.getCroppedCanvas({});
      currentCroppedCanvas.toBlob(blob => {
        let formData = new FormData(); // eslint-disable-line
        formData.append("file", blob);
        console.log("这里的blob的值是多少呢", blob);
      });
    }
  };

  cropBoxRenderReady = () => {
    // console.log("这个ready函数在图片没有读出来的时候依旧是被调用了的？");
    // 结果显示这个ready函数在如下情况下都会执行：
    // canvas中放置有Cors设置的跨域地址
    // canvas中放置没有Cors设置的跨域地址
    this.setState({
      loading: false
    });
  };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  openModal = () => {
    this.setState({
      visible: true
    });
  };
  // 1. 在使用cropper组件的时候，如果没有设置cropper组件中的crossOrigin为anonymous，如果图片跨域且无Cors，console中还是显示使用了
  // ajax的方式请求;说明在cropper内部，还是打开了image的crossOrigin的。
  render() {
    let currentUrl = this.state.testUrl;
    // let currentUrl = this.state.testUrl2;
    return (
      <div className="App">
        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
        <img src={currentUrl} alt="" />
        <input type="button" value="打开crop框" onClick={this.openModal} />
        <AddCanvas />
        <Modal
          title="Basic Modal"
          destroyOnClose={true}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Spin spinning={this.state.loading}>
            <Cropper
              src={currentUrl}
              // crossOrigin={"Anonymous"}
              className={"cropContainer"}
              aspectRatio={292 / 56}
              autoCrop={true}
              minCropBoxWidth={292}
              minCropBoxHeight={56}
              cropBoxMovable={false}
              cropBoxResizable={false}
              guides={true}
              preview={"#previewBox"}
              modal={true}
              center={false}
              dragMode={"move"}
              toggleDragModeOnDblclick={false}
              ref={this.createCropperRef}
              ready={this.cropBoxRenderReady}
              crop={this.cropLogo}
            />
            <div className={"previewBoxContent"}>
              <div className={"previewBox"} id={"previewBox"} />
            </div>
          </Spin>
        </Modal>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
