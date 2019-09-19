/* eslint-disable no-param-reassign */
import '@babel/polyfill';
import '../utils/polyfill';
import dva from 'dva';
import Clipboard from 'clipboard';
import router from './router';
import models from '../dashboard/models';
// import CONFIG from '../config';
import message from '../utils/message';
import './index.scss';

// import welcomeVideo from '../assets/welcome.mp4';

// 置localStorage初始值
if (!localStorage.getItem('member_id')) {
  localStorage.setItem('member_id', '__EMPTY__');
}
if (!localStorage.getItem('member_token')) {
  localStorage.setItem('member_token', '__EMPTY__');
}

window.clipboard = new Clipboard('.clipboard-target');
window.clipboard.on('success', (e) => {
  message.success('复制成功');
  e.clearSelection();
});

window.clipboard.on('error', () => {
  message.success(window.i18n.copy_error);
});

function render() {
  if (localStorage.getItem('member_id') === '__EMPTY__') {
    window.location.hash = '/login';
  }
  const app = dva();
  Object.keys(models).forEach((key) => {
    app.model(models[key]);
  });
  app.router(router);
  app.start('#root');
  window._APP_ = app;
}

// function setupCanvas(canvas) {
//   // Get the device pixel ratio, falling back to 1.
//   const dpr = window.devicePixelRatio || 1;
//   // Get the size of the canvas in CSS pixels.
//   const rect = canvas.getBoundingClientRect();
//   // Give the canvas pixel dimensions of their CSS
//   // size * the device pixel ratio.
//   canvas.width = rect.width * dpr;
//   canvas.height = rect.height * dpr;
//   canvas.style.width = rect.width + 'px';
//   canvas.style.height = rect.height + 'px';
//   const ctx = canvas.getContext('2d');
//   // Scale all drawing operations by the dpr, so you
//   // don't have to worry about the difference.
//   ctx.scale(dpr, dpr);
//   return ctx;
// }

// 播放影片
const { $ } = window;
$(() => {
  // const v = $(`<video src="${welcomeVideo}" muted="muted"></video>`);
  // const c = $('<canvas></canvas>');
  // $('#welcome').append(v);
  // $('#welcome').append(c);
  // const video = v[0];
  // const canvas = c[0];
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerWidth;
  // const ctx = setupCanvas(canvas);
  // video.addEventListener('ended', () => {
  //   $('body').removeClass('welcome');
  //   $('#welcome').fadeOut(300);
  //   setTimeout(() => {
  //     $('#welcome').remove();
  //   }, 400);
  //   render();
  // }, true);
  // video.addEventListener('play', () => {
  //   const loop = () => {
  //     if (!video.paused && !video.ended) {
  //       ctx.drawImage(video, 0, 0, window.innerWidth, window.innerWidth);
  //       setTimeout(loop, 1000 / 30); // drawing at 30fps
  //     }
  //   };
  //   loop();
  // }, 0);
  // v[0].play();
  render();
});

// 权限
function checkPermission() {
  if (window.cordova && window.cordova.plugins.permissions) {
    const { permissions } = window.cordova.plugins;
    permissions.hasPermission(permissions.CAMERA, (status) => {
      if (!status.hasPermission) {
        permissions.requestPermission(permissions.CAMERA, () => {}, () => {});
      }
    });
    permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, (status) => {
      if (!status.hasPermission) {
        permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, () => {}, () => {});
      }
    });
    permissions.hasPermission(permissions.READ_EXTERNAL_STORAGE, (status) => {
      if (!status.hasPermission) {
        permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, () => {}, () => {});
      }
    });
  }
}

document.addEventListener('deviceready', checkPermission, false);
