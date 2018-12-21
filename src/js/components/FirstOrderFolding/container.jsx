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
import Input from '@material-ui/core/Input';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';

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
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    textTransform: 'none',
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 32,
  },
  card: {
    padding: 2,
    margin: 5,
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: '20px',
  },
  pile: {
    padding: 2,
    margin: 5,
    minWidth: 10,
    textAlign: 'center',
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
});

let defaultPower = 3;
let defaultService = new Folding(defaultPower);

class FirstOrderFolding extends Component {
  // Initial state
  state = {
    power: defaultPower, // k
    count: defaultService.getCount(), // 2^k
    service: defaultService,

    result: defaultService.init(), // an one-dimension array
    colors: utils.generateGradualColors(defaultService.getCount()), // an one-dimension array

    number: 1,
    position: 1,

    activeStep: 0,
    activeStepContent: []
  };

  handleChange = event => {
    let newPower = event.target.value;
    let newService = new Folding(newPower);
    this.setState({
      [event.target.name]: newPower,
      count: newService.getCount(),
      service: newService,

      result: newService.init(),
      colors: utils.generateGradualColors(newService.getCount()),

      number: 1,
      position: 1,

      activeStep: 0,
      activeStepContent: []
    });
  };

  doFolding = () => {
    this.setState(state => ({
      result: state.service.compute(this.props.algorithm),
      activeStepContent: state.service.getSteps(),
    }));
  };

  reset = () => {
    this.setState(state => ({ result: state.service.init() }));
  };

  positionOfNumber = event => {
    let number = _.parseInt(event.target.value);
    if (number >= 1 && number <= this.state.count && this.state.service.isComputeDone()) {
      this.setState({ number });
    }
  };

  numberOfPosition = event => {
    let position = _.parseInt(event.target.value);
    if (position >= 1 && position <= this.state.count && this.state.service.isComputeDone()) {
      this.setState({ position });
    }
  };

  stepNext = () => {
    this.setState(state => ({ activeStep: state.activeStep + 1 }));
  };

  stepBack = () => {
    this.setState(state => ({ activeStep: state.activeStep - 1 }));
  };

  stepReset = () => {
    this.setState({ activeStep: 0 });
  };

  render() {
    const { classes, algorithm, ui } = this.props;
    const {
      power, count, service,
      result, colors,
      number, position,
      activeStep, activeStepContent
    } = this.state;

    let maxPower = 5;

    // Options of values of power
    // Remember: `new Array(length)` never initializes itself actually! Must call fill() or from() to initialize it.
    let menus = Array.from(new Array(maxPower), (value, index) =>
      <MenuItem key={index + 1} value={index + 1}>{index + 1}</MenuItem>
    );

    // Generate graphics view
    let cards = Array.from(new Array(result.length), (value, index) => {
      let background = colors[result[index] - 1];
      return (
      <Paper key={index} className={classes.card}
             style={{
               backgroundColor: background,
               color: utils.getReverseColor(background)
             }}>
        <b>{result[index]}</b>
      </Paper>
      );
    });

    // Generate the steps UI.
    // There are k+1 steps, including the beginning state.
    let steps = Array.from(new Array(power + 1), (value, index) =>
      index === 0 ? 'Original Sequence' : 'Turn ' + index
    ).map((label, index) => {
      return (
      <Step key={label}>
        <StepLabel><b>{label}</b></StepLabel>
        <StepContent>
          <div style={{ display: 'flex' }}>
            {
              activeStepContent.length > 0 && activeStepContent[index].map((pile, i) =>
                ui === 'graphics' ? (
                  <Paper key={i} className={classes.pile}
                         style={{ display: 'flex', flexDirection: 'column-reverse',
                                  width: 32 }}>
                    {
                      pile.map((number, j) =>
                        /* Here I use the symmetry of folding: cards[number] equals the position. */
                        cards[service.positionOf(number) - 1]
                      )
                    }
                  </Paper>
                ) : (
                  <div key={i}
                       style={{ display: 'flex', flexDirection: 'column-reverse', justifyContent: 'space-around',
                                width: '100%' }}>
                    {
                      pile.map((number, j) =>
                        <span key={j}>{number}</span>
                      )
                    }
                  </div>
                )
              )
            }
          </div>
          <div className={classes.actionsContainer}>
            <div>
              <Button className={classes.button}
                      disabled={activeStep === 0}
                      onClick={this.stepBack}>
                Back
              </Button>
              <Button className={classes.button} color="primary" variant="contained"
                      onClick={this.stepNext}>
                {activeStep === power ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        </StepContent>
      </Step>
      );
    });

    return (
      <div className={classes.root}>
        <h2>First Order Folding</h2>
        <p>Define an array \([1, 2, ..., n]\), that \(n = 2 ^ k\), and compute folding result.</p>

        {/* Controller Pad */}
        <Paper className={classes.pad} elevation={1}
               style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="power">Power (<b>k</b>)</InputLabel>
              <Select
                value={power}
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
            There are <b>{count}</b> numbers in total.
          </div>
        </Paper>

        {/* Result View Pad */}
        <Paper className={classes.pad} elevation={1}
               style={{ display: 'flex', flexDirection: 'column' }}>
          <h3>Result View</h3>
          <div style={{ display: 'flex' }}>
          {ui === 'graphics' ? cards : result.toString()}
          </div>
        </Paper>

        {/* Result View Pad */}
        <Paper className={classes.pad} elevation={1}
               style={{ display: service.isComputeDone() ? 'flex' : 'none', flexDirection: 'column' }}>
          <h3>Explore More</h3>
          <div style={{ marginBottom: 10 }}>You can observe that giving the same number or position, you will get the same position/number! It's amazing, right? We call this <b>SYMMETRY</b>.</div>
          <div>
            Number <Input className={classes.textField} type={'number'} value={number} onChange={this.positionOfNumber} /> is in position <span style={{ color: 'red', fontWeight: 'bolder', fontSize: 32 }}>{service.positionOf(number)}</span>.
          </div>
          <div>
            Number in position <Input className={classes.textField} type={'number'} value={position} onChange={this.numberOfPosition} /> is <span style={{ color: 'blue', fontWeight: 'bolder', fontSize: 32 }}>{service.valueOf(position)}</span>.
          </div>
        </Paper>

        {/* Steps View Pad: a vertical stepper */}
        <Paper className={classes.pad} elevation={1}
               style={{ display: service.isComputeDone() ? 'flex' : 'none', flexDirection: 'column' }}>
          <h3>Steps of each Turn</h3>
          <div>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} className={classes.resetContainer}>
                <Typography>All steps completed</Typography>
                <Button onClick={this.stepReset} className={classes.button}>
                  Start Again!
                </Button>
              </Paper>
            )}
          </div>
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
