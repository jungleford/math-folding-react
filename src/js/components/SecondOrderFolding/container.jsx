import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import service from './service';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: theme.palette.background.paper,
  },
});

class SecondOrderFolding extends Component {
  render() {

    return (
      <div>
        <h2>Second Order Folding</h2>
      </div>
    );
  }
}

SecondOrderFolding.propTypes = {
  classes: PropTypes.object.isRequired,
  algorithm: PropTypes.string.isRequired,
  ui: PropTypes.string.isRequired
};


export default withStyles(styles)(SecondOrderFolding);
