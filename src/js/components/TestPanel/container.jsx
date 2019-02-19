import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import Folding from '../SecondOrderFolding/service';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: theme.palette.background.paper,
  },
  pad: {
    ...theme.mixins.gutters(),
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
  },
});

let defaultPower = 3;
let roundCount = 27; // for SOF k=3, there are 27 rounds back to the initial matrix

class TestPanel extends Component {

  render() {
    const { classes } = this.props;

    let rounds = [];
    for (let i = 0, count = roundCount + 1, service = new Folding(defaultPower), result = service.init();
         i <= count;
         i++, service = new Folding(defaultPower, service.compute()[0], true), result = service.init()) {

      let title = '';
      switch (i) {
        case 0:
          title = 'Initial Matrix';
          break;
        case 1:
          title = 'Result Matrix';
          break;
        default:
          title = 'Round ' + (i - 1) + (i === count ? ' (Back to the Initial Matrix)' : '');
      }

      let numberRows = result.map((row, rowIndex) => (
        //<div key={rowIndex} style={{ display: 'flex' }}>{row.toString()}</div>
        <div key={rowIndex} style={{ display: 'flex' }}>
          {
            row.map((number, colIndex) =>
              <div key={colIndex} style={{ width: 16 + 2 ** (defaultPower - 1), textAlign: 'center', margin: 4 }}>
                <span>{number}</span>
              </div>
            )
          }
        </div>
      ));

      rounds.push(
        /* Result View Pad */
        <Paper key={i} className={classes.pad} elevation={1}>
          <h3>{title}</h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {numberRows}
          </div>
        </Paper>
      );
    }

    return (
      <div className={classes.root}>
        <h2>Test Panel</h2>
        <p>For SOF (k=3), how many "rounds" can you go back to the initial matrix?</p>

        {rounds}
      </div>
    );
  }
}

TestPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TestPanel);
