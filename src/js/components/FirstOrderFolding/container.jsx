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

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: theme.palette.background.paper,
  },
  params: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    width: '50%',
  },
  view: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    width: '50%',
    display: 'flex',
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
  state = {
    power: defaultPower,
    service: defaultService,
    result: defaultService.init()
  };

  handleChange = event => {
    let newPower = event.target.value;
    let newService = new Folding(newPower);
    this.setState({
      [event.target.name]: newPower,
      service: newService,
      result: newService.init()
    });
  };

  doFolding = () => {
    let result = this.state.service.compute(this.props.algorithm);
    this.setState({ result })
  };

  render() {
    const { classes } = this.props;

    let maxPower = 5;
    let menus = [];
    let cards = [];

    for (let i = 1; i <= maxPower; i++) {
      menus.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
    }

    for (let i = 0; i < this.state.result.length; i++) {
      cards.push(<Paper key={i} className={classes.card}>{this.state.result[i]}</Paper>);
    }

    return (
      <div className={classes.root}>
        <h2>First Order Folding</h2>
        <p>Define an array \([1, 2, ..., n]\), that \(n = 2 ^ k\), and compute folding result.</p>
        <Paper className={classes.params} elevation={1}>
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
        </Paper>
        <Paper className={classes.view} elevation={1}>
          {cards}
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
