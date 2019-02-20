import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

let defaultPower = 3;
let maxPower = 3;
/* for SOF k=1, there are 2 rounds back to the initial matrix.
   for SOF k=2, there are 3 rounds back to the initial matrix.
   for SOF k=3, there are 27 rounds back to the initial matrix. */
let roundCount = [2, 3, 27];

class TestPanel extends Component {
  // Initial state
  state = {
    power: defaultPower, // k
    rCount: roundCount[2]
  };

  changePower = event => {
    let newPower = event.target.value;
    this.setState({
      [event.target.name]: newPower,
      rCount: roundCount[newPower - 1]
    });
  };

  render() {
    const { classes } = this.props;
    const { power, rCount } = this.state;

    // Options of values of power
    // Remember: `new Array(length)` never initializes itself actually! Must call fill() or from() to initialize it.
    let menus = Array.from(new Array(maxPower), (value, index) =>
      <MenuItem key={index + 1} value={index + 1}>{index + 1}</MenuItem>
    );

    let rounds = [];
    for (let i = 0, count = rCount + 1, service = new Folding(power), result = service.init();
         i <= count;
         i++, service = new Folding(power, service.compute()[0], true), result = service.init()) {

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
        <p>For SOF result sequence, let's re-arrange it to another square matrix and start folding again, then how many "rounds" can you go back to the initial matrix?</p>

        {/* Controller Pad */}
        <Paper className={classes.pad} elevation={1}>
          <div>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="power">Power (<b>k</b>)</InputLabel>
              <Select
                value={power}
                onChange={this.changePower}
                inputProps={{
                  name: 'power',
                  id: 'power',
                }}
              >
                {menus}
              </Select>
            </FormControl>
          </div>
          <div>
            There are <span style={{ color: 'red', fontWeight: 'bolder', fontSize: 32 }}>{rCount}</span> rounds in total.
          </div>
        </Paper>

        {/* Result View Pad */}
        {rounds}
      </div>
    );
  }
}

TestPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TestPanel);
