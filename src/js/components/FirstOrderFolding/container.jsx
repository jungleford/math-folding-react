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
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Input from '@material-ui/core/Input';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';

import Card from '../Card';
import Folding from './service';
import {Constants as ServiceConstants} from '@jungleford/math-folding/src/js';
import UiConstants from '../../utils/constants';

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
let maxPower = 5;

class FirstOrderFolding extends Component {
  defaultService = new Folding(defaultPower);

  // Initial state
  state = {
    algorithm: this.props.algorithm,
    power: defaultPower, // k
    count: this.defaultService.getCount(), // 2^k
    service: this.defaultService,

    result: this.defaultService.init(), // an one-dimension array
    resultReset: true,
    colors: utils.generateGradualColors(this.defaultService.getCount()), // an one-dimension array

    number: 1,
    position: 1,

    activeStep: 0,
    activeStepContent: [],

    exploreMore: false,
    showFoldingReverse: false,

    serviceReverse: null,
    resultReverse: null,
    activeStepReverse: 0,
    activeStepContentReverse: []
  };

  /*
   * MathJax lib will be activated only once from <script> tag.
   * So here must reload it by manual when shifting between FOF/SOF tabs.
   */
  componentDidMount = () => {
    eval('MathJax.Hub.Queue(["Typeset", MathJax.Hub])');
  };

  /*
   * React new feature since v16.3
   * `componentWillReceiveProps` is deprecated, and `getDerivedStateFromProps` is the replacement.
   */
  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (prevState.algorithm !== nextProps.algorithm) {
      return { //Same as setState()
        algorithm: nextProps.algorithm,
        result: prevState.service.init(true),
        resultReset: true,

        number: 1,
        position: 1,

        activeStep: 0,
        activeStepContent: [],

        exploreMore: false,
        showFoldingReverse: false,

        serviceReverse: null,
        resultReverse: null,
        activeStepReverse: 0,
        activeStepContentReverse: []
      }
    }

    return null; // null means no state change.
  };

  changePower = event => {
    let newPower = event.target.value;
    let newService = new Folding(newPower);
    this.setState({
      [event.target.name]: newPower,
      count: newService.getCount(),
      service: newService,

      result: newService.init(),
      resultReset: true,
      colors: utils.generateGradualColors(newService.getCount()),

      number: 1,
      position: 1,

      activeStep: 0,
      activeStepContent: [],

      exploreMore: false,
      showFoldingReverse: false,

      serviceReverse: null,
      resultReverse: null,
      activeStepReverse: 0,
      activeStepContentReverse: []
    });
  };

  doFolding = () => {
    let { algorithm, power, service } = this.state;
    let result = service.compute(algorithm);
    let foldingReverse = new Folding(power, result);
    this.setState(state => ({
      result: result,
      resultReset: false,
      activeStep: 0,
      activeStepContent: state.algorithm === ServiceConstants.algorithm.RECURSIVE ? state.service.getSteps() : [],

      serviceReverse: foldingReverse,
      resultReverse: foldingReverse.compute(state.algorithm),
      activeStepReverse: 0,
      activeStepContentReverse: state.algorithm === ServiceConstants.algorithm.RECURSIVE ? foldingReverse.getSteps() : []
    }));
  };

  reset = () => {
    this.setState(state => ({
      result: state.service.init(),
      resultReset: true,
      activeStep: 0,

      exploreMore: false,
      showFoldingReverse: false,

      resultReverse: state.serviceReverse ? state.serviceReverse.init() : null,
      activeStepReverse: 0
    }));
  };

  toggleExplore = event => {
    this.setState({ exploreMore: event.target.checked });
  };

  toggleFoldingReverse = event => {
    this.setState({ showFoldingReverse: event.target.checked });
  };

  /**
   * PRIVATE METHOD
   *
   * Generate graphics view.
   */
  generateCards = (result, colors) => {
    const { classes } = this.props;

    return Array.from(new Array(result.length), (value, index) => {
      let background = colors[result[index] - 1];
      return (
        <Card key={index} width={20} background={background} content={result[index]} />
      );
    });
  };

  /**
   * PRIVATE METHOD
   *
   * Generate the steps UI.
   * There are k+1 steps, including the beginning state.
   */
  generateSteps = (titleOfStartStep, service, activeStep, activeStepContent, cards, resultReset, stepNext, stepBack) => {
    const { classes, ui } = this.props;

    return _.map(Array.from(new Array(service.getPower() + 1), (value, index) =>
      index === 0 ? titleOfStartStep : 'Turn ' + index
    ), (label, index) => {
      return (
        <Step key={label}>
          <StepLabel><b>{label}</b></StepLabel>
          <StepContent>
            <div style={{ display: 'flex' }}>
              {
                activeStepContent.length > 0 && _.map(activeStepContent[index], (pile, i) =>
                  ui === UiConstants.style.GRAPHICS ? (
                    <Paper key={i} className={classes.pile}
                           style={{ display: 'flex', flexDirection: 'column-reverse',
                             width: 32 }}>
                      {
                        _.map(pile, number =>
                          resultReset ?
                            cards[number - 1] :
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
                        _.map(pile, number =>
                          <span key={number}>{number}</span>
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
                        onClick={stepBack}>
                  Back
                </Button>
                <Button className={classes.button} color="primary" variant="contained"
                        onClick={stepNext}>
                  {activeStep === service.getPower() ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          </StepContent>
        </Step>
      );
    });
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

  stepNextReverse = () => {
    this.setState(state => ({ activeStepReverse: state.activeStepReverse + 1 }));
  };

  stepBackReverse = () => {
    this.setState(state => ({ activeStepReverse: state.activeStepReverse - 1 }));
  };

  stepResetReverse = () => {
    this.setState({ activeStepReverse: 0 });
  };

  render() {
    const { classes, ui } = this.props;
    const {
      algorithm, power, count, service,
      result, resultReset, colors,
      number, position,
      activeStep, activeStepContent,
      exploreMore, showFoldingReverse,
      serviceReverse, resultReverse, activeStepReverse, activeStepContentReverse
    } = this.state;

    // Options of values of power
    // Remember: `new Array(length)` never initializes itself actually! Must call fill() or from() to initialize it.
    let menus = Array.from(new Array(maxPower), (value, index) =>
      <MenuItem key={index + 1} value={index + 1}>{index + 1}</MenuItem>
    );

    let cards = this.generateCards(result, colors);
    let cardsReverse = resultReverse ? this.generateCards(resultReverse, colors) : null;

    let steps = this.generateSteps('Original Sequence', service, activeStep, activeStepContent, cards, resultReset, this.stepNext, this.stepBack);
    let stepsReverse = serviceReverse ? this.generateSteps('Final Sequence', serviceReverse, activeStepReverse, activeStepContentReverse, cardsReverse, resultReset, this.stepNextReverse, this.stepBackReverse) : null;

    return (
      <div className={classes.root}>
        <h2>First Order Folding</h2>
        <p>Define an array \([1, 2, ..., n]\), that \(n = 2 ^ k\), and compute the folding result.</p>

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
            <Button variant="contained" color="primary" className={classes.button}
                    onClick={this.doFolding}>
              Fold!
              <SendIcon className={classes.rightIcon}/>
            </Button>
            <Button variant="contained" className={classes.button}
                    onClick={this.reset}>
              Reset
            </Button>
            {service.isComputeDone() && (
            <Tooltip title={'Enable to view more details' + (algorithm === ServiceConstants.algorithm.RECURSIVE ? ' and REVERSE MAGIC!' : '')}>
              <FormControlLabel
                control={
                  <Switch checked={exploreMore} disabled={resultReset} onChange={this.toggleExplore} color="primary" />
                }
                label="Explore More"
              />
            </Tooltip>
            )}
          </div>
          <div>
            There are <b>{count}</b> numbers in total.
          </div>
        </Paper>

        {/* Result View Pad */}
        <Paper className={classes.pad} elevation={1}>
          <h3>Result View</h3>
          <div style={{ display: 'flex' }}>
          {ui === UiConstants.style.GRAPHICS ? cards : result.toString()}
          </div>
        </Paper>

        {/* Formula View Pad */}
        <Paper className={classes.pad} elevation={1}
               style={{ display: algorithm === ServiceConstants.algorithm.FORMULA ? 'flex' : 'none', flexDirection: 'column' }}>
          <h3>Formula of Computing</h3>
          <p>\(P(1) = 1\)</p>
          <p>\(P(2) = n = 2^k\)</p>
          <p>{'\\( P_k(x) = \\begin{cases} 2P_{k-1}(x),&\\textrm{x is even} \\\\ 2P_{k-1}(x)-1,&\\textrm{x is odd} \\end{cases},\\quad1<x\\le2^{k-1} \\)'}</p>
          <p>{'\\( P_k(2^k-x+1) = \\begin{cases} P_k(x)-1,&\\textrm{x is even} \\\\ P_k(x)+1,&\\textrm{x is odd} \\end{cases},\\quad1<x\\le2^{k-1} \\)'}</p>
          <p>You can replace \(P(x)\) with \(V(x)\) as well to compute the value in a given position \(x\) in the final sequence.</p>
        </Paper>

        {/* Steps View Pad: a vertical stepper */}
        {exploreMore && !resultReset && algorithm === ServiceConstants.algorithm.RECURSIVE && service.isComputeDone() && (
        <Paper className={classes.pad} elevation={1}>
          <h3>Steps of Each Turn</h3>
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
        )}

        {/* Explore View Pad */}
        {exploreMore && !resultReset && service.isComputeDone() && (
        <Paper className={classes.pad} elevation={1}>
          <h3>Explore More</h3>
          <div style={{ marginBottom: 10 }}>You can observe that giving the same number or position, you will get the same position/number! It looks amazing, doesn't it? We call this <b>SYMMETRY</b>.</div>
          <div>
            Number <Input className={classes.textField} type={'number'} value={number} onChange={this.positionOfNumber} /> is in position <span style={{ color: 'red', fontWeight: 'bolder', fontSize: 32 }}>{service.positionOf(number)}</span>.
          </div>
          <div>
            Number in position <Input className={classes.textField} type={'number'} value={position} onChange={this.numberOfPosition} /> is <span style={{ color: 'blue', fontWeight: 'bolder', fontSize: 32 }}>{service.valueOf(position)}</span>.
          </div>
          {algorithm === ServiceConstants.algorithm.RECURSIVE && (
          <FormControlLabel
            control={
              <Switch checked={showFoldingReverse} onChange={this.toggleFoldingReverse} color="primary" />
            }
            label="Watch what happens when folding the result sequence"
          />
          )}
        </Paper>
        )}

        {/* Reverse Folding Steps View Pad */}
        {exploreMore && showFoldingReverse && !resultReset && algorithm === ServiceConstants.algorithm.RECURSIVE && serviceReverse && serviceReverse.isComputeDone() && (
        <Paper className={classes.pad} elevation={1}>
          <h3>Steps of Reverse Folding</h3>
          <p>Now you can try to align the final sequence and fold the numbers with the same steps. Then wait and observe the magic result!</p>
          <div>
            <Stepper activeStep={activeStepReverse} orientation="vertical">
              {stepsReverse}
            </Stepper>
            {activeStepReverse === stepsReverse.length && (
            <Paper square elevation={0} className={classes.resetContainer}>
              <Typography>All steps completed</Typography>
              <Button onClick={this.stepResetReverse} className={classes.button}>
                Start Again!
              </Button>
            </Paper>
            )}
          </div>
        </Paper>
        )}

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
