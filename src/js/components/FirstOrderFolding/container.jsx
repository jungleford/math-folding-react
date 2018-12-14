import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';

import Folding from './service';
import utils from '../../utils/utils';

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
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    width: '50%',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
    textTransform: 'none',
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  card: {
    padding: 2,
    margin: 5,
    width: 20,
    height: 20,
    textAlign: 'center'
  }
});

let defaultPower = 3;
let defaultService = new Folding(defaultPower);

class FirstOrderFolding extends Component {
  // Initial state
  state = {
    power: defaultPower,
    count: defaultService.getCount(),
    service: defaultService,
    result: defaultService.init(),
    colors: utils.generateGradualColors(defaultService.getCount())
  };

  handleChange = event => {
    let newPower = event.target.value;
    let newService = new Folding(newPower);
    this.setState({
      [event.target.name]: newPower,
      count: newService.getCount(),
      service: newService,
      result: newService.init(),
      colors: utils.generateGradualColors(newService.getCount())
    });
  };

  doFolding = () => {
    let result = this.state.service.compute(this.props.algorithm);
    this.setState({ result })
  };

  reset = () => {
    this.setState({ result: this.state.service.init() });
  };

  render() {
    const { classes } = this.props;

    let maxPower = 5;
    let menus = [];
    let cards = [];

    // Options of values of power
    for (let i = 1; i <= maxPower; i++) {
      menus.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
    }

    // Generate graphics view
    for (let i = 0; i < this.state.result.length; i++) {
      let background = this.state.colors[this.state.result[i] - 1];
      cards.push(
        <Paper key={i} className={classes.card}
               style={{
                 backgroundColor: background,
                 color: utils.getReverseColor(background)
               }}>
          {this.state.result[i]}
        </Paper>
      );
    }

    return (
      <div className={classes.root}>
        <h2>First Order Folding</h2>
        <p>Define an array \([1, 2, ..., n]\), that \(n = 2 ^ k\), and compute folding result.</p>
        <Paper className={classes.pad} elevation={1}
               style={{
                 display: 'flex',
                 flexDirection: 'column',
               }}>
          <div>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="power">Power (k)</InputLabel>
              <Select
                value={this.state.power}
                onChange={this.handleChange}
                inputProps={{
                  name: 'power',
                  id: 'power',
                }}
              >
                {menus}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" className={classes.button}
                    onClick={this.doFolding}>
              Fold!
              <SendIcon className={classes.rightIcon}/>
            </Button>
            <Button variant="contained" className={classes.button}
                    onClick={this.reset}>
              Reset
            </Button>
          </div>
          <div>
            {'There are '}<b>{this.state.count}</b>{' numbers in total.'}
          </div>
        </Paper>
        <Paper className={classes.pad} elevation={1}
               style={{display: 'flex'}}>
          {this.props.ui === 'graphics' ? cards : this.state.result.toString()}
        </Paper>
      </div>
    );
  }
}

FirstOrderFolding.propTypes = {
  classes: PropTypes.object.isRequired,
  algorithm: PropTypes.string.isRequired,
  ui: PropTypes.string.isRequired
};


export default withStyles(styles)(FirstOrderFolding);
