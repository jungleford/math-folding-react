import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';

class Card extends Component {

  render() {
    const { width, background, content } = this.props;

    return (
      <Paper style={{
               padding: 2,
               margin: 5,
               width: width,
               height: width,
               textAlign: 'center',
               lineHeight: width + 'px',
               backgroundColor: background,
               color: utils.getReverseColor(background)
             }}>
        <b>{content}</b>
      </Paper>
    );
  }
}

Card.propTypes = {
  width: PropTypes.number.isRequired,
  background: PropTypes.string.isRequired,
  content: PropTypes.any.isRequired
};

export default Card;
