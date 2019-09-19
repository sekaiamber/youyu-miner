/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import './style.scss';

import p1 from '../../../assets/about/1.png';
import p2 from '../../../assets/about/2.png';
import p3 from '../../../assets/about/3.png';
import p4 from '../../../assets/about/4.png';
import p5 from '../../../assets/about/5.png';
import p6 from '../../../assets/about/6.png';
import p7 from '../../../assets/about/7.png';
import p8 from '../../../assets/about/8.png';
import p9 from '../../../assets/about/9.png';
import p10 from '../../../assets/about/10.png';
import p11 from '../../../assets/about/11.png';
import p12 from '../../../assets/about/12.png';
import p13 from '../../../assets/about/13.png';
import p14 from '../../../assets/about/14.png';
import p15 from '../../../assets/about/15.png';
import p16 from '../../../assets/about/16.png';
import p17 from '../../../assets/about/17.png';
import p18 from '../../../assets/about/18.png';
import p19 from '../../../assets/about/19.png';
import p20 from '../../../assets/about/20.png';
import p21 from '../../../assets/about/21.png';
import p22 from '../../../assets/about/22.png';
import p23 from '../../../assets/about/23.png';
import p24 from '../../../assets/about/24.png';
import p25 from '../../../assets/about/25.png';
import p26 from '../../../assets/about/26.png';
import backImg from '../../../assets/header_back.svg';

const list = [p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13, p14, p15, p16, p17, p18, p19, p20, p21, p22, p23, p24, p25, p26];

const hori = window.innerWidth < window.innerHeight;

// images
class About extends Component {
  state = {
    point: 0,
  }

  handlePrev = () => {
    this.handleChange(-1);
  }

  handleNext = () => {
    this.handleChange(1);
  }

  handleBack = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'utils/goBack',
    });
  }

  handleChange(count) {
    let newPoint = this.state.point + count;
    newPoint = Math.max(newPoint, 0);
    newPoint = Math.min(newPoint, list.length - 1);
    this.setState({
      point: newPoint,
    });
  }

  render() {
    const { point } = this.state;

    return (
      <div id="about" className={classnames({ hori })}>
        {list.map((pic, i) => (
          <CSSTransition
            in={i === point}
            timeout={300}
            classNames="page"
            unmountOnExit
            key={i}
          >
            <div className="img-container" style={{ backgroundImage: `url(${pic})` }} />
          </CSSTransition>
        ))}
        <div className="back" onClick={this.handleBack}><img src={backImg} alt="" /></div>
        <div className="prev" onClick={this.handlePrev}><Icon type="left" /></div>
        <div className="next" onClick={this.handleNext}><Icon type="right" /></div>
        <div className="count"><span className="current">{point + 1}</span> <span>/ {list.length}</span></div>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps)(About);
