/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Spin, Icon } from 'antd';
import AutoFontSizeDiv from '../common/autoFontSizeDiv';
import './style.scss';

// images
import walletBaseImg from '../../../assets/wallet_base.svg';
import walletBase2Img from '../../../assets/wallet_base_2.svg';
import walletUsdtImg from '../../../assets/wallet_usdt.png';
import walletQrImg from '../../../assets/wallet_qr.svg';
import walletDepImg from '../../../assets/wallet_deposit.svg';
import walletWitImg from '../../../assets/wallet_withdraw.svg';

class Wallet extends Component {
  state = {
    use: 'usdt',
  }

  getUseWallet() {
    const { use } = this.state;
    const {
      userInfo, accountInfo, prices, block,
    } = this.props;
    const info = {
      unit: use.toUpperCase(),
      address: '',
      balance: '',
      logo: '',
      earnings: '',
      power: '',
      lock: '',
      block: null,
    };
    if (use === 'usdt') {
      info.address = userInfo.usdt_payment_address;
      info.balance = accountInfo.usdt_balance;
      info.locked = accountInfo.usdt_locked;
      info.logo = walletUsdtImg;
      info.unitValue = prices.usdt.cny;
    } else if (use === 'btc') {
      info.address = '';
      info.balance = accountInfo.btc_balance;
      info.locked = accountInfo.btc_locked;
      info.logo = walletBase2Img;
      info.unitValue = prices[use].usdt;
      info.block = block.btc;
      info.earnings = accountInfo.btc_total_earnings;
      info.power = accountInfo.btc_total_power;
    } else if (use === 'ltc') {
      info.address = '';
      info.balance = accountInfo.ltc_balance;
      info.locked = accountInfo.ltc_locked;
      info.logo = walletBase2Img;
      info.unitValue = prices[use].usdt;
      info.block = block.ltc;
      info.earnings = accountInfo.ltc_total_earnings;
      info.power = accountInfo.ltc_total_power;
    }
    return info;
  }

  handleGotoDeposit = () => {
    const { use } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'utils/goto',
      goto: '/deposit/' + use,
    });
  }

  handleExperience = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/experience',
    });
  }

  handleChangeUse(use) {
    this.setState({
      use,
    });
  }

  render() {
    const { use } = this.state;
    const useWallet = this.getUseWallet();
    const { accountInfo } = this.props;

    return (
      <div id="wallet" className="container">
        <div className="top-select">
          <span>
            <span className={classnames('option', { active: use === 'usdt' })} onClick={this.handleChangeUse.bind(this, 'usdt')}>USDT</span>
            <span className={classnames('option', { active: use === 'btc' })} onClick={this.handleChangeUse.bind(this, 'btc')}>BTC</span>
            <span className={classnames('option', { active: use === 'ltc' })} onClick={this.handleChangeUse.bind(this, 'ltc')}>LTC</span>
          </span>
        </div>
        <div className="card-container">
          <div className={classnames('card', { usdt: use === 'usdt' })}>
            <div className="top">可用余额</div>
            <AutoFontSizeDiv className="amount" minFontPixels={20} maxFontPixels={48} width="100%" height="72px">{useWallet.balance}</AutoFontSizeDiv>
            {/* <div className="value">
              <span>
                {use === 'usdt' ? (
                  `${parseFloat(useWallet.balance * useWallet.unitValue).toFixed(2)} CNY`
                ) : (
                  `$ ${parseFloat(useWallet.balance * useWallet.unitValue).toFixed(2)}`
                )}
              </span>
            </div> */}
          </div>
          <div className={classnames('card', { usdt: use === 'usdt' })}>
            <div className="top">锁定余额</div>
            <AutoFontSizeDiv className="amount" minFontPixels={20} maxFontPixels={48} width="100%" height="72px">{useWallet.locked}</AutoFontSizeDiv>
            {/* <div className="value">
              <span>
                {use === 'usdt' ? (
                  `${parseFloat(useWallet.locked * useWallet.unitValue).toFixed(2)} CNY`
                ) : (
                  `$ ${parseFloat(useWallet.locked * useWallet.unitValue).toFixed(2)}`
                )}
              </span>
            </div> */}
          </div>
        </div>
        {useWallet.block && (
          <div className="info shadow-pad">
            <div className="row">
              <div className="me">
                <div className="key">{useWallet.power}T</div>
                <div className="value">我的{useWallet.unit}算力</div>
              </div>
              <div className="block">
                <div className="key">{useWallet.block.hashRate}</div>
                <div className="value">{useWallet.unit}全网算力</div>
              </div>
            </div>
            <div className="row">
              <div className="me">
                <div className="key">{useWallet.earnings} {useWallet.unit}</div>
                <div className="value">我的{useWallet.unit}矿池收益</div>
              </div>
              <div className="block">
                <div className="key">{useWallet.block.difficulty}</div>
                <div className="value">{useWallet.unit}全网难度</div>
              </div>
            </div>
          </div>
        )}
        <div className="opt">
          {use === 'usdt' && (
            <Link className="opt-btn" to={`/deposit/${use}`}>
              充值
            </Link>
          )}
          <Link className="opt-btn" to={`/withdraw/${use}`}>
            提现
          </Link>
          <Link className="opt-btn" to={`/transfer/${use}`}>
            转账
          </Link>
        </div>
        <div className="big-container">
          <Link className="big" to="/buy"><Icon type="transaction" /> <span>算力租赁</span></Link>
          <Link className="big" to="/orders"><Icon type="account-book" /> <span>我的算力</span></Link>
          {/* {accountInfo.can_experience && (
            <a className="big" onClick={this.handleExperience}><Icon type="gift" /> <span>体验矿机</span></a>
          )} */}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ account, market }) {
  const {
    userInfo, account: accountInfo,
  } = account;

  return {
    userInfo,
    accountInfo,
    block: market.block,
    prices: market.prices,
  };
}

export default connect(mapStateToProps)(Wallet);
