/* eslint-disable camelcase */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import classnames from 'classnames';
import Decimal from 'decimal.js-light';
import { connect } from 'dva';
import { Spin } from 'antd';
import message from '../../../utils/message';

import './style.scss';

import scanImg from '../../../assets/withdraw_scan.svg';

// images
class Withdraw extends Component {
  state = {
    to: '',
    amount: '',
    withdraw_password: '',
    verify_code: '',
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    let currency = 'usdt';
    if (match && match.params) {
      currency = match.params.currency;
    }
    dispatch({
      type: 'account/queryWithdraws',
      payload: currency.toUpperCase(),
    });
  }

  getUseWallet() {
    const { match, data } = this.props;
    let currency = 'usdt';
    if (match && match.params) {
      currency = match.params.currency;
    }
    const info = {
      unit: currency.toUpperCase(),
      balance: '',
    };
    if (currency === 'usdt') {
      info.balance = data.usdt_balance;
    } else {
      info.balance = data[`${currency}_balance`];
    }
    return info;
  }

  getFee() {
    const { match, fee } = this.props;
    let currency = 'usdt';
    if (match && match.params) {
      currency = match.params.currency;
    }
    return fee[currency];
  }

  getFinal() {
    const { amount } = this.state;
    const fee = this.getFee();
    let final = '0';
    if (amount && new Decimal(amount).greaterThan(fee)) {
      final = new Decimal(amount).minus(fee).toString();
    }
    return final;
  }

  handleChangeTo = (e) => {
    this.setState({
      to: e.target.value,
    });
  }

  handleChangeAmount = (e) => {
    this.setState({
      amount: e.target.value,
    });
  }

  handleChangeWithdrawPassword = (e) => {
    this.setState({
      withdraw_password: e.target.value,
    });
  }

  handleChangeVerifyCode = (e) => {
    this.setState({
      verify_code: e.target.value,
    });
  }

  handleScan = () => {
    const { cordova } = window;
    if (cordova && cordova.plugins.barcodeScanner) {
      cordova.plugins.barcodeScanner.scan(this.handleScanSuccess, (error) => {
        message.error(error);
      }, {
        formats: 'QR_CODE',
      });
    } else {
      message.error('初始化相机失败，请手工输入');
    }
  }

  handleScanSuccess = (result) => {
    // message.success('We got a barcode\n'
    //   + 'Result: ' + result.text + '\n'
    //   + 'Format: ' + result.format + '\n'
    //   + 'Cancelled: ' + result.cancelled);
    const to = result.text || '';
    this.setState({
      to,
    });
  }

  handleSubmit = () => {
    const {
      to, amount, withdraw_password, verify_code,
    } = this.state;
    const { dispatch, match } = this.props;
    let currency;
    if (match && match.params) {
      currency = match.params.currency;
    }
    if (!currency) return;
    const payload = {
      to,
      amount,
      currency: currency.toUpperCase(),
      withdraw_password,
      verify_code,
    };
    dispatch({
      type: 'account/submitWithdraw',
      payload,
    });
  }

  handleSendSms = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/sendWithdrawSms',
    });
  }

  canSubmit() {
    const {
      to, amount, withdraw_password, verify_code,
    } = this.state;
    const { match } = this.props;
    let currency = 'base';
    if (match && match.params) {
      currency = match.params.currency;
    }
    if (currency) {
      const fee = this.getFee();
      return !(to !== '' && amount !== '' && withdraw_password !== '' && verify_code !== '' && new Decimal(amount).greaterThan(new Decimal(fee)));
    }
    return !(to !== '' && amount !== '' && withdraw_password !== '' && verify_code !== '');
  }

  render() {
    const {
      to, amount, withdraw_password, verify_code,
    } = this.state;
    const useWallet = this.getUseWallet();
    const { history } = this.props;

    // const history = [{
    //   type: 'withdraws',
    //   txid: '0x4981094091024701927409170479012704971074120749127',
    //   created_at: '2019-01-01',
    //   amount: '251.09',
    // }];

    return (
      <div id="withdraw" className={classnames('container', { usdt: useWallet.unit === 'USDT' })}>
        <div className="banner">
          <div>可提现余额</div>
          <div>{useWallet.balance} {useWallet.unit}</div>
        </div>
        <div className="form">
          <div className="item">
            <input type="text" placeholder="提现地址" value={to} onChange={this.handleChangeTo} />
            <img className="scan-btn" src={scanImg} alt="" onClick={this.handleScan} />
          </div>
          <div className="item">
            <input type="number" placeholder="提现金额" value={amount} onChange={this.handleChangeAmount} />
          </div>
          <div className="item">
            <input type="password" placeholder="提现密码" value={withdraw_password} onChange={this.handleChangeWithdrawPassword} />
          </div>
          <div className="item verify">
            <input type="number" placeholder="手机验证码" value={verify_code} onChange={this.handleChangeVerifyCode} />
            <a onClick={this.handleSendSms}>发送验证码</a>
          </div>
          <div className="item">
            <div className="form-info auto-height">
              <div>手续费</div>
              <div>{this.getFee()} {useWallet.unit}</div>
            </div>
            <div className="form-info auto-height">
              <div>到账金额</div>
              <div>{this.getFinal()} {useWallet.unit}</div>
            </div>
          </div>
          <div className="item">
            <div className="warn">请确认提现数量满足提现地址账户最低充入数量，如因此造成的资产丢失佑鱼不承担任何责任。</div>
            <div className="warn">
              <div>为保障资金安全，当您账户安全策略变更、密码修改，我们会对提现进行人工审核，请耐心等待工作人员电话或邮件联系。</div>
              <div>请务必确认手机安全，防止信息被篡改或泄露。</div>
            </div>
          </div>
        </div>
        <div className="submit">
          <button className="btn" disabled={this.canSubmit()} onClick={this.handleSubmit}>确认提现</button>
        </div>
        <div className="page-title">提现历史</div>
        <div className="history">
          {history === 'LOADING' ? (
            <div className="loading">
              <Spin />
            </div>
          ) : (
            history.map((item, i) => (
              <div className="item shadow-pad" key={item.type + i}>
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

function mapStateToProps({ account, market }) {
  const { account: data, history } = account;

  return {
    data,
    history,
    fee: market.fee,
  };
}
export default connect(mapStateToProps)(Withdraw);
