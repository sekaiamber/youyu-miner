/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import classnames from 'classnames';
import Decimal from 'decimal.js-light';
import { connect } from 'dva';
import { Spin, Input, Button, Popconfirm } from 'antd';
import { Link } from 'dva/router';
import message from '../../../utils/message';

import './style.scss';

import minerLogo from '../../../assets/miner-logo.jpg';

// images
// import blockHeightImg from '../../../assets/block_height.svg';

const continueList = ['reservation_buy', 'rent'];

class Order extends Component {
  state = {}

  getItemList(list) {
    return list.map(product => (
      <div className="item balance shadow-pad" key={product.id}>
        <div className="logo">
          <img src={minerLogo} alt="" />
        </div>
        <div className="center">
          {product.product_type === 'buy_position' ? (
            <div className="txid">{product.power}机位 <span>{product.price} USDT({product.days}天/期)</span></div>
          ) : (
            <div className="txid">{product.power}T <span>{product.price} USDT({product.days}天/期)</span></div>
          )}
          <div className="time">购买时间：{product.created_at}</div>
          <div className="time">到期时间：{product.end_at}</div>
        </div>
        <div className="amount">
          {continueList.indexOf(product.product_type) > -1 && product.can_continue && (
            <Popconfirm
              placement="left"
              title="确认续租此产品？"
              onConfirm={this.handleContinue.bind(this, product)}
              okText="确认"
              cancelText="取消"
            >
              <Button type="primary" className="continue-btn">一键续租</Button>
            </Popconfirm>
          )}
        </div>
      </div>
    ));
  }

  handleContinue(product) {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/continueOrder',
      payload: product.id,
    });
  }

  render() {
    const { list, orders } = this.props;

    return (
      <div id="order" className="container">
        {orders.length === 0 && (
          <div style={{ textAlign: 'center' }}>暂无订单</div>
        )}
        {list.rent_products && list.rent_products.length > 0 && (
          <div>
            <div className="product-group-title">租赁算力包（无忧挖矿，到期押金全退）</div>
            {this.getItemList(list.rent_products)}
          </div>
        )}
        {list.buy_products && list.buy_products.length > 0 && (
          <div>
            <div className="product-group-title">购买矿机</div>
            {this.getItemList(list.buy_products)}
          </div>
        )}
        {list.reservation_buy_products && list.reservation_buy_products.length > 0 && (
          <div>
            <div className="product-group-title">购买矿机（限时预约，付款后20天后开始产生收益）</div>
            {this.getItemList(list.reservation_buy_products)}
          </div>
        )}
        {list.buy_position_products && list.buy_position_products.length > 0 && (
          <div>
            <div className="product-group-title">矿场机位（限时预约，付款后30天后开始产生收益）</div>
            {this.getItemList(list.buy_position_products)}
          </div>
        )}
        {list.experience && list.experience.length > 0 && (
          <div>
            <div className="product-group-title">体验矿机</div>
            {this.getItemList(list.experience)}
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps({ account }) {
  const { orders } = account;
  // const orders = [{
  //   id: 111,
  //   end_at: '2019-07-01',
  //   start_at: '2018-01-11',
  //   power: 19,
  //   price: '899.0',
  //   currency: 'BTC',
  //   can_continue: true,
  //   product_type: 'rent',
  // }];

  const list = {
    rent_products: orders.filter(o => o.product_type === 'rent'),
    buy_products: orders.filter(o => o.product_type === 'buy'),
    reservation_buy_products: orders.filter(o => o.product_type === 'reservation_buy'),
    buy_position_products: orders.filter(o => o.product_type === 'buy_position'),
    experience: orders.filter(o => o.product_type === 'experience'),
  };

  return {
    list,
    orders,
  };
}

export default connect(mapStateToProps)(Order);
