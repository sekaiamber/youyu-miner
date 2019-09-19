/* eslint-disable prefer-destructuring */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import { Spin } from 'antd';
import Qrcode from '../common/qrcode';
import message from '../../../utils/message';
import saveImage from '../../../utils/saveImage';
import './style.scss';

import walletBaseImg from '../../../assets/wallet_base.svg';
import walletUsdtImg from '../../../assets/wallet_usdt.png';

// images
class Deposit extends Component {
  state = {
    url: '',
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    let currency = 'usdt';
    if (match && match.params) {
      currency = match.params.currency;
    }
    dispatch({
      type: 'account/queryDeposits',
      payload: currency.toUpperCase(),
    });
  }

  getUseWallet() {
    const { match, userInfo } = this.props;
    let currency = 'usdt';
    if (match && match.params) {
      currency = match.params.currency;
    }
    const info = {
      unit: currency.toUpperCase(),
      address: '',
      logo: '',
    };
    if (currency === 'usdt') {
      info.address = userInfo.usdt_payment_address;
      info.logo = walletUsdtImg;
    } else {
      info.address = userInfo.payment_address;
      info.logo = walletBaseImg;
    }
    return info;
  }

  handleUrlChange = (url) => {
    this.setState({
      url,
    });
  }

  handleSaveImage = () => {
    const { url } = this.state;
    saveImage(url, () => {
      message.success('已成功保存到相册');
    }, () => {
      message.error('您的手机不支持自动保存到相册，请手动截屏');
    });
  }

  handleOpenBitrabbit = () => {
    if (window.cordova) {
      window.cordova.InAppBrowser.open('https://bitrabbit.io', '_system', 'location=yes');
    }
  }

  render() {
    const { history } = this.props;
    const useWallet = this.getUseWallet();

    // const history = [{
    //   type: 'deposits',
    //   txid: '0x4981094091024701927409170479012704971074120749127',
    //   created_at: '2019-01-01',
    //   amount: '251.09',
    // }];

    return (
      <div id="deposit" className={classnames('container', { usdt: useWallet.unit === 'USDT' })}>
        <div className="unit">{useWallet.unit}</div>
        <div className="qrcode-container">
          {useWallet.address && (
            <div className="qrcode"><Qrcode data={useWallet.address} option={{ height: 250, width: 250, margin: 2 }} onUrlChange={this.handleUrlChange} /></div>
          )}
          <div className="btn" onClick={this.handleSaveImage}>保存二维码</div>
          <div className="address clipboard-target" data-clipboard-text={useWallet.address}>{useWallet.address}</div>
        </div>
        <div className="shadow-pad">{useWallet.unit}转入有时交易所会扣除额外手续费，请务必确定好数量后再转入，请勿向胖蚂蚁{useWallet.unit}地址充值任何非{useWallet.unit === 'USDT' ? 'OMNI网络的' : ''}{useWallet.unit}资产。</div>
        <div className="page-title">充提历史</div>
        <div className="history">
          {history === 'LOADING' ? (
            <div className="loading">
              <Spin />
            </div>
          ) : (
            history.map((item, i) => (
              <div className="item shadow-pad" key={item.type + i}>
                <img className="logo" src={useWallet.logo} alt="" />
                <div className="center">
                  <div className="txid">{item.txid || '等待中'}</div>
                  <div className="time">{item.created_at}</div>
                </div>
                <div className="amount">
                  {item.type === 'deposits' ? '+' : '-'}{item.amount}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  const { userInfo, history } = account;

  return {
    userInfo,
    history,
  };
}
export default connect(mapStateToProps)(Deposit);
