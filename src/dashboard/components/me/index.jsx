/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'dva';
import { Link } from 'dva/router';

import './style.scss';

// images
import avatarImg from '../../../assets/youyu-x.png';
import linkImg1 from '../../../assets/me_link_1.svg';
import linkImg2 from '../../../assets/me_link_2.svg';
import linkImg3 from '../../../assets/me_link_3.svg';
import linkImg4 from '../../../assets/me_link_4.svg';
import linkImg5 from '../../../assets/me_link_5.svg';
import linkImg6 from '../../../assets/me_link_6.svg';

class Me extends Component {
  handleLogout = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/logout',
    });
  }

  render() {
    const { userInfo } = this.props;
    return (
      <div id="me">
        <div className="avatar-container block">
          <div className="avatar">
            <img src={avatarImg} alt="" />
          </div>
          <div className="code">{userInfo.nickname}</div>
        </div>
        <div className="link-list block">
          <Link to="/changeWithdrawPassword" className="link">
            <div><span className="icon"><img src={linkImg1} alt="" /></span> <span>钱包设置</span></div>
            <div>&gt;</div>
          </Link>
          <Link to="/changePassword" className="link">
            <div><span className="icon"><img src={linkImg2} alt="" /></span> <span>安全设置</span></div>
            <div>&gt;</div>
          </Link>
          {/* <Link to="/about" className="link">
            <div><span className="icon"><img src={linkImg3} alt="" /></span> <span>关于我们</span></div>
            <div>&gt;</div>
          </Link> */}
          <Link to="/post/qa" className="link">
            <div><span className="icon"><img src={linkImg4} alt="" /></span> <span>常见问题</span></div>
            <div>&gt;</div>
          </Link>
          <Link to="/me" className="link">
            <div><span className="icon"><img src={linkImg5} alt="" /></span> <span>联系我们</span></div>
            <div>客服微信：cat1878</div>
          </Link>
          <Link to="/invite" className="link">
            <div><span className="icon"><img src={linkImg6} alt="" /></span> <span>APP下载</span></div>
            <div>&gt;</div>
          </Link>
        </div>

        {/* <div className="link-list">
          <Link to="/invite" className="link">
            <div>邀请好友</div>
            <div>&gt;</div>
          </Link>
          <Link to="/miners" className="link">
            <div>矿工管理</div>
            <div>&gt;</div>
          </Link>
          <Link to="/subuser" className="link">
            <div>我的矿工</div>
            <div>&gt;</div>
          </Link>
        </div> */}
        <div className="logout block">
          <a onClick={this.handleLogout}>退出登录</a>
        </div>
        <div className="version">
          {__VERSION__}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  const { userInfo } = account;

  return {
    userInfo,
  };
}

export default connect(mapStateToProps)(Me);
