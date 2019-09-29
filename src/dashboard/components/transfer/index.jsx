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
class Transfer extends Component {
  state = {
    phone_number: '',
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
      type: 'account/queryTransfers',
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
      phone_number: e.target.value,
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

  handleSubmit = () => {
    const {
      phone_number, amount, withdraw_password, verify_code,
    } = this.state;
    const { dispatch, match } = this.props;
    let currency;
    if (match && match.params) {
      currency = match.params.currency;
    }
    if (!currency) return;
    const payload = {
      phone_number,
      amount,
      currency: currency.toUpperCase(),
      withdraw_password,
      verify_code,
    };
    dispatch({
      type: 'account/submitTransfer',
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
      phone_number, amount, withdraw_password, verify_code,
    } = this.state;
    const { match } = this.props;
    let currency = 'base';
    if (match && match.params) {
      currency = match.params.currency;
    }
    if (currency) {
      const fee = this.getFee();
      return !(phone_number !== '' && amount !== '' && withdraw_password !== '' && verify_code !== '' && new Decimal(amount).greaterThan(new Decimal(fee)));
    }
    return !(phone_number !== '' && amount !== '' && withdraw_password !== '' && verify_code !== '');
  }

  render() {
    const {
      phone_number, amount, withdraw_password, verify_code,
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
      <div id="transfer" className={classnames('container', { usdt: useWallet.unit === 'USDT' })}>
        <div className="banner">
          <div>可转账余额</div>
          <div>{useWallet.balance} {useWallet.unit}</div>
        </div>
        <div className="form">
          <div className="item">
            <input type="text" placeholder="转账手机号" value={phone_number} onChange={this.handleChangeTo} />
          </div>
          <div className="item">
            <input type="number" placeholder="转账金额" value={amount} onChange={this.handleChangeAmount} />
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
              <div>到账金额</div>
              <div>{amount} {useWallet.unit}</div>
            </div>
          </div>
        </div>
        <div className="submit">
          <button className="btn" disabled={this.canSubmit()} onClick={this.handleSubmit}>确认转账</button>
        </div>
        <div className="page-title">转账历史</div>
        <div className="history">
          {history === 'LOADING' ? (
            <div className="loading">
              <Spin />
            </div>
          ) : (
            history.map((item, i) => (
              <div className="item shadow-pad" key={item.type + i}>
                <div className="center">
                  <div className="time">{item.created_at}</div>
                </div>
                <div className="amount">{item.amount} {item.currency}</div>
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
export default connect(mapStateToProps)(Transfer);
