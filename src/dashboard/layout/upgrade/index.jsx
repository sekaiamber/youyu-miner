import React from 'react';
import { connect } from 'dva';

import './style.scss';

function handleOpenDownload(url) {
  if (window.cordova) {
    window.cordova.InAppBrowser.open(url, '_system', 'location=yes');
  }
}

function Upgrade(props) {
  const { needUpgrade } = props;
  if (!needUpgrade) return <></>;
  return (
    <div id="upgrade" className="my-modal-conainer">
      <div className="my-modal upgrade-modal">
        <div className="title">客户端版本过低</div>
        <div className="content">{needUpgrade.info}</div>
        <div className="btn" onClick={handleOpenDownload.bind(this, needUpgrade.url)}>点击升级</div>
      </div>
    </div>
  );
}

function mapStateToProps({ utils }) {
  return {
    needUpgrade: utils.needUpgrade,
  };
}

export default connect(mapStateToProps)(Upgrade);
