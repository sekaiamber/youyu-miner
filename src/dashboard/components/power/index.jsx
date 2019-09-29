/* eslint-disable react/self-closing-comp */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'dva/router';
import { connect } from 'dva';
import AutoFontSizeDiv from '../common/autoFontSizeDiv';

import './style.scss';


class Power extends Component {
  state = {
    use: 'usdt',
  }

  getUseWallet() {
    const { invite } = this.props;
    const { use } = this.state;
    const info = {
      unit: use.toUpperCase(),
      yesterday: '',
      total: '',
    };
    if (use === 'usdt') {
      info.yesterday = invite.yesterday_usdt_total;
      info.total = invite.usdt_total;
    } else if (use === 'btc') {
      info.yesterday = invite.yesterday_btc_total;
      info.total = invite.btc_total;
    } else if (use === 'ltc') {
      info.yesterday = invite.yesterday_ltc_total;
      info.total = invite.ltc_total;
    }
    return info;
  }

  handleChangeUse(use) {
    this.setState({
      use,
    });
  }

  render() {
    const { use } = this.state;
    const useWallet = this.getUseWallet();
    const { invite, subuser } = this.props;

    // json.(activity, :title, :description, :state, :can_receive?, :id)
    // json.amount activity.amount.round(4)
    // json.time activity.updated_at.strftime('%Y-%m-%d')
    // user = activity&.order&.user
    // json.nickname user&.nickname
    // json.user_id user&.id

    const { activities } = invite;

    return (
      <div id="power" className="container">
        <div className="top-select">
          <span>
            <span className={classnames('option', { active: use === 'usdt' })} onClick={this.handleChangeUse.bind(this, 'usdt')}>USDT</span>
            <span className={classnames('option', { active: use === 'btc' })} onClick={this.handleChangeUse.bind(this, 'btc')}>BTC</span>
            <span className={classnames('option', { active: use === 'ltc' })} onClick={this.handleChangeUse.bind(this, 'ltc')}>LTC</span>
          </span>
        </div>
        <div className="top">
          <div>
            <div className="title">昨日奖金</div>
            <AutoFontSizeDiv className="value" minFontPixels={14} maxFontPixels={36} width="100%" height="60px">{`${useWallet.yesterday} ${useWallet.unit}`}</AutoFontSizeDiv>
          </div>
          <div>
            <div className="title">总奖金</div>
            <AutoFontSizeDiv className="value" minFontPixels={14} maxFontPixels={36} width="100%" height="60px">{`${useWallet.total} ${useWallet.unit}`}</AutoFontSizeDiv>
          </div>
        </div>
        <div>
          <Link className="big" to="/invite">邀请矿友</Link>
        </div>
        <div>
          {subuser.map((item, i) => (
            <div className={`item shadow-pad ${item.can_withdraw ? 'vip' : ''}`} key={i}>
              <div className="center">
                <div className="txid">{item.nickname}</div>
                {/* <div className="time">{item.phone_number}</div> */}
              </div>
              <div className="amount">{item.phone_number}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  const {
    subuser,
    invite,
  } = account;

  return {
    subuser,
    invite,
  };
}

export default connect(mapStateToProps)(Power);
