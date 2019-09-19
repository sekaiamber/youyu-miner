/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-array-index-key */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import { connect } from 'dva';

import './style.scss';

// images
class Post extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'post/setPost',
      payload: match.params.id,
    });
    this.updateTitle();
  }

  componentWillReceiveProps() {
    setTimeout(() => {
      this.updateTitle();
    }, 0);
  }

  updateTitle() {
    const { data, dispatch } = this.props;
    if (data && data.title) {
      dispatch({
        type: 'utils/updateState',
        payload: {
          coverHeaderTitle: data.title,
        },
      });
    }
  }

  render() {
    const { data } = this.props;

    return (
      <div id="post">
        {data.content}
      </div>
    );
  }
}

function mapStateToProps({ post }) {
  return {
    data: post.post,
  };
}
export default connect(mapStateToProps)(Post);
