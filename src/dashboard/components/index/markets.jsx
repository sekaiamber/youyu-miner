/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import classnames from 'classnames';

// images
import usdtImg from '../../../assets/usdt-x.png';
import ltcImg from '../../../assets/ltc-x.png';
import btcImg from '../../../assets/btc-x.png';

export default function Markets(props) {
  const { data } = props;
  const { ltc, btc, usdt } = data;
  return (
    <div id="markets" className="container">
      <div className="item">
        <div className="icon"><img src={btcImg} alt="" /></div>
        <div className="info">
          <div className="name">BTC</div>
          <div className="price">
            <div className="usdt">$ {parseFloat(btc.usdt).toFixed(4)}</div>
            <div className="cny">≈ {parseFloat(btc.cny).toFixed(4)} CNY</div>
          </div>
        </div>
      </div>
      <div className="item">
        <div className="icon"><img src={ltcImg} alt="" /></div>
        <div className="info">
          <div className="name">LTC</div>
          <div className="price">
            <div className="usdt">$ {parseFloat(ltc.usdt).toFixed(4)}</div>
            <div className="cny">≈ {parseFloat(ltc.cny).toFixed(4)} CNY</div>
          </div>
        </div>
      </div>
      <div className="item">
        <div className="icon"><img src={usdtImg} alt="" /></div>
        <div className="info">
          <div className="name">USDT</div>
          <div className="price">
            <div className="usdt">{parseFloat(usdt.cny).toFixed(4)} CNY</div>
          </div>
        </div>
      </div>
    </div>
  );
}
