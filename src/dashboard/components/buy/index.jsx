/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import classnames from 'classnames';
import Decimal from 'decimal.js-light';
import { connect } from 'dva';
import { Spin, Input, Checkbox } from 'antd';
import { Link } from 'dva/router';
import message from '../../../utils/message';

import './style.scss';


import buyUsdtImg from '../../../assets/usdt-x.png';
import ltcImg from '../../../assets/ltc-x.png';
import btcImg from '../../../assets/btc-x.png';
import jiweiImg from '../../../assets/position.jpg';

const icons = {
  btc: btcImg,
  ltc: ltcImg,
};

// images
// import blockHeightImg from '../../../assets/block_height.svg';

class Buy extends Component {
  state = {
    selected: undefined,
    showOrder: false,
    use: 'usdt',
    form: {},
    checked: false,
    showTip: false,
  }

  getOrderCost() {
    const { form } = this.state;
    let cost = 0;
    Object.keys(form).forEach((id) => {
      const p = form[id];
      cost += parseFloat(p.product.price) * p.count;
    });
    return cost;
  }

  getItemList(list, icon) {
    const { form } = this.state;
    return list.map(product => (
      <div className="item shadow-pad" key={product.id}>
        <div className="logo">
          <img src={icon || icons[product.currency.toLowerCase()]} alt="" />
        </div>
        <div className="center">
          {product.product_type === 'buy_position' ? (
            <div className="txid">{product.power}机位 <span>{product.price} USDT({product.days}天/期)</span></div>
          ) : (product.product_type === 'monthly_1' || product.product_type === 'monthly_2' ? (
            <div className="txid">{product.power}份 <span>{product.price} USDT({product.days}天/期)</span></div>
          ) : (
            <div className="txid">{product.power}T <span>{product.price} USDT({product.days}天/期)</span></div>
          ))}
            
          <div className="time">{product.month_earns}</div>
        </div>
        <div className="amount">
          <a className="minus" onClick={this.handleProductCountClick.bind(this, product, -1)}>-</a>
          <Input className="amount-input" value={form[product.id] ? form[product.id].count : ''} onChange={this.handleProductCountChange.bind(this, product)} />
          <a className="plus" onClick={this.handleProductCountClick.bind(this, product, 1)}>+</a>

          <div className="remain">剩余{product.number}份</div>
        </div>
      </div>
    ));
  }

  handleShowOrder = () => {
    if (this.getOrderCost() > 0) {
      this.setState({
        showOrder: true,
      });
    }
  }

  handleCloseModal = (e) => {
    if (e.currentTarget === e.target) {
      this.setState({
        showOrder: false,
      });
    }
  }

  handleCloseTipModal = (e) => {
    if (e.currentTarget === e.target) {
      this.setState({
        showTip: false,
      });
    }
  }

  handleSubmitOrder = () => {
    const { form, submitting, checked } = this.state;
    const { dispatch } = this.props;

    if (submitting) return;
    if (!checked) {
      message.error('请同意《佑鱼风险提示》');
      return;
    }

    this.setState({
      submitting: true,
    });

    const order = Object.keys(form).map(id => ({
      id,
      amount: form[id].count,
    }));
    dispatch({
      type: 'product/buy',
      payload: {
        order,
      },
      onSuccess: () => {
        message.success('购买成功');
        this.setState({
          submitting: false,
          showOrder: false,
        });
        dispatch({
          type: 'utils/refreshPage',
        });
      },
      onFail: () => {
        this.setState({
          submitting: false,
        });
      },
    });
  }

  handleCheckChange = (e) => {
    this.setState({
      checked: e.target.checked,
    });
  };

  handleProductCountChange(product, e) {
    const { form } = this.state;
    const { value } = e.target;
    const reg = /^[0-9]+$/;
    if ((!Number.isNaN(value) && reg.test(value)) || value === '') {
      this.setState({
        form: {
          ...form,
          [product.id]: {
            product,
            count: value,
          },
        },
      });
    }
  }

  handleProductCountClick(product, number) {
    const { form } = this.state;
    const value = form[product.id];
    if (!value) {
      this.setState({
        form: {
          ...form,
          [product.id]: {
            product,
            count: '1',
          },
        },
      });
    } else {
      const newCount = Math.max(parseInt(value.count, 10) + number, 0);
      this.setState({
        form: {
          ...form,
          [product.id]: {
            product,
            count: newCount.toString(),
          },
        },
      });
    }
  }

  render() {
    const { list, accountInfo } = this.props;
    const {
      showOrder, form, submitting, checked, showTip,
    } = this.state;
    const orderCost = this.getOrderCost();


    return (
      <div id="buy" className="container">
        <div className="item balance shadow-pad">
          <img className="logo" src={buyUsdtImg} alt="" />
          <div className="center">
            <div className="txid">{accountInfo.usdt_balance} <span>USDT</span></div>
            <div className="time">可用金额</div>
          </div>
          <div className="amount">
            <Link to="/deposit/usdt" className="buy-btn">去充值</Link>
          </div>
        </div>

        <div className="product-group-title">租赁算力包（无忧挖矿，到期押金全退）</div>
        {list.rent_products && this.getItemList(list.rent_products)}
        {/* <div className="product-group-title">租赁算力包（无忧挖矿，到期押金全退）</div> */}
        {list.reservation_buy_products && this.getItemList(list.reservation_buy_products)}
        {/* <div className="product-group-title">购买算力包</div>
        {list.buy_products && this.getItemList(list.buy_products)}
        <div className="product-group-title">矿场机位（限时预约，付款后30天后开始产生收益）</div>
        {list.buy_position_products && this.getItemList(list.buy_position_products, jiweiImg)} */}
        <div className="product-group-title">理财套餐包（稳定理财，到期押金全退）</div>
        {list.monthly_1_products && this.getItemList(list.monthly_1_products)}
        {list.monthly_2_products && this.getItemList(list.monthly_2_products)}

        {/* {list.buy_position_products && this.getItemList(list.buy_position_products, jiweiImg)} */}

        <div className="footer">
          <div className="info-container">
            <div className="info">
              <div className="cost">合计：{orderCost} USDT</div>
            </div>
          </div>
          <div className="btn-container">
            <div className="btn" onClick={this.handleShowOrder}>确认订单</div>
          </div>
        </div>
        {showOrder && (
          <div className="order-modal" onClick={this.handleCloseModal}>
            <div className="order-container">
              {Object.keys(form).map(id => form[id]).map(order => (
                <div className="item shadow-pad" key={order.product.id}>
                  <div className="logo">
                    <img src={icons[order.product.currency.toLowerCase()]} alt="" />
                  </div>
                  <div className="center">
                    <div className="txid">{order.product.power}T ({order.product.days}天/期)</div>
                    <div className="time">{order.product.price} USDT</div>
                  </div>
                  <div className="amount check">X{order.count}</div>
                </div>
              ))}
              <div className="check"><Checkbox onChange={this.handleCheckChange} checked={checked}>同意</Checkbox><a onClick={() => this.setState({ showTip: true })}>《佑鱼风险提示》</a></div>
              <div className="submit" onClick={this.handleSubmitOrder}>
                {submitting ? (
                  <Spin />
                ) : (
                  `提交订单 (合计${orderCost} USDT)`
                )}
              </div>
            </div>
          </div>
        )}
        {showTip && (
          <div className="order-modal" onClick={this.handleCloseTipModal}>
            <div className="order-container">
              <div className="tip">
                <p>您正在进行的是由佑鱼提供数字货币相关的云算力理财服务。佑鱼在此就云计算服务活动的风险及禁止性行为向您提示如下：
                  <ol>
                    <li>数字货币相关的云算力服务是您与佑鱼平台约定的且通过佑鱼平台展示的云算力服务，参考年回报率不代表您最终实际取得的利息或回报。
                      <ol>
                        <li>租赁客户佑鱼保证您本金的百分之百安全，但不对您获得的利息或回报率作出任何承诺、保证。</li>
                        <li>购买客户存在不能够按期收回本金的风险，佑鱼不对购买算力客户的本金收回及可获利息或回报金额作出任何承诺、保证。</li>
                        <li>机位购买客户佑鱼保证您本金及回报利润的稳定性。</li>
                      </ol>
                    </li>
                    <li>您作为被服务人，不得从事以下行为或存在以下情形：
                      <ol>
                        <li>向平台提供不真实、不准确、不完整的信息；</li>
                        <li>使用非法资金或非自有资金购买服务；</li>
                        <li>不具备与进行数字货币相关的云计算服务相适应的风险认知和承受能力，购买或投资于与自身风险承受能力不匹配的项目；</li>
                        <li>其他云算力服务合同及有关协议约定的禁止性行为。</li>
                      </ol>
                    </li>
                    <li>您确认已经知悉数字货币相关的云计算服务的风险，保证不存在从事云算力服务活动的禁止性行为，承诺具备与参与云算力服务相适应的风险意识、风险识别能力、拥有非保本类金融产品的投资经历并熟悉互联网，承诺自行承担投资产生的本息损失。</li>
                    <li>客户应了解并接受，如因自然灾害（洪水、泥石流、地震、飓风等）、政策影响（国家发布文件等）、战争、政治动荡等不可抗力造成的停电、矿场及矿机损坏，本合同自动终止，双方不得相互追究违约责任，租赁客户本金足额退还，购买客户佑鱼可协助客户处理后续问题，但不承担任何责任，由此造成的损失须自行承担。</li>
                    <li>佑鱼所列产品均不涉及数字资产交易，若甲方自行参与第三方的数字资产交易，应当自行承担责任和风险。</li>
                  </ol>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps({ product, account }) {
  const { account: accountInfo } = account;

  return {
    list: product.products,
    canBuy: product.canBuy,
    accountInfo,
  };
}

export default connect(mapStateToProps)(Buy);
