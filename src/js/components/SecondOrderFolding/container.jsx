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

let cardWidth = 32;

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

/* for SOF k=1, there are 2 rounds back to the initial matrix.
   for SOF k=2, there are 3 rounds back to the initial matrix.
   for SOF k=3, there are 27 rounds back to the initial matrix. */
let countReverse = [2, 3, 27];

class SecondOrderFolding extends Component {
  defaultService = new Folding(defaultPower);

  // Initial state
  state = {
    algorithm: this.props.algorithm,
    power: defaultPower, // k
    count: this.defaultService.getCount(), // 4^k
    service: this.defaultService,

    result: this.defaultService.init(), // a two-dimension array
    resultReset: true,
    colors: utils.generateGradualColorMatrix(this.defaultService.getRowCount()), // a two-dimension array

    number: 1,
    position: 1,

    activeStep: 0,
    activeStepContent: [],

    exploreMore: false,
    showFoldingReverse: false,

    reverseCount: countReverse[defaultPower - 1],
    activeStepReverse: 0,
    servicesReverse: []
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

        activeStepReverse: 0,
        servicesReverse: []
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
      colors: utils.generateGradualColorMatrix(newService.getRowCount()),

      number: 1,
      position: 1,

      activeStep: 0,
      activeStepContent: [],

      exploreMore: false,
      showFoldingReverse: false,

      reverseCount: newPower > 3 ? 0 : countReverse[newPower - 1],
      activeStepReverse: 0,
      servicesReverse: []
    });
  };

  doFolding = () => {
    let { algorithm, power, service, reverseCount, servicesReverse } = this.state;
    let result = service.compute(algorithm);
    if (reverseCount > 0 && servicesReverse.length === 0) {
      for (let i = 0, count = reverseCount + 1, svc = service;
           i <= count;
           i++, svc = new Folding(power, svc.compute(algorithm)[0], true)) {
        servicesReverse.push(svc); // servicesReverse contains all SOF services of each step
      }
    }

    this.setState(state => ({
      result: result,
      resultReset: false,
      activeStep: 0,
      activeStepContent: state.algorithm === ServiceConstants.algorithm.RECURSIVE ? state.service.getSteps() : [],

      activeStepReverse: 0,
      servicesReverse: servicesReverse
    }));
  };

  reset = () => {
    this.setState(state => ({
      result: state.service.init(),
      resultReset: true,
      activeStep: 0,

      exploreMore: false,
      showFoldingReverse: false,

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
   * Generate graphics view: this is a set of single cards.
   */
  generateCards = (service, result, colors) => {
    const {classes} = this.props;

    return _.map(result, (row, rowIndex) =>
      _.map(row, (number, colIndex) => {
        let p = service.getPower() * rowIndex + colIndex;
        let n = service.valueOf(p + 1) - 1; // number starts from 1, but coordinate is from 0
        let y = _.floor(n / service.getRowCount());
        let x = n % service.getRowCount();
        let background = result.length === 1 ? colors[y][x] : colors[rowIndex][colIndex];
        return (
          <Card key={p} width={cardWidth} background={background} content={number} />
        );
      })
    );
  };

  /**
   * PRIVATE METHOD
   *
   * Generate graphics view: arrange all single cards into a square matrix.
   */
  generateCardRows = cards => {
    return _.map(cards, (cardRow, rowIndex) => (
      <div key={rowIndex} style={{ display: 'flex' }}>{cardRow}</div>
    ));
  };

  /**
   * PRIVATE METHOD
   *
   * Generate character view: arrange all numbers in the result into a square matrix.
   */
  generateNumberRows = (power, result) => {
    return _.map(result, (row, rowIndex) => (
      //<div key={rowIndex} style={{ display: 'flex' }}>{row.toString()}</div>
      <div key={rowIndex} style={{ display: 'flex' }}>
        {
          _.map(row, (number, colIndex) =>
            <div key={colIndex} style={{ width: 16 + 2 ** (power - 1), textAlign: 'center', margin: 4 }}>
              <span>{number}</span>
            </div>
          )
        }
      </div>
    ));
  };

  /**
   * PRIVATE METHOD
   *
   * Generate the steps UI.
   * There are k+1 steps, including the beginning state.
   */
  generateSteps = (titleOfStartStep, service, activeStep, activeStepContent, cards, result, resultReset, stepNext, stepBack) => {
    const { classes, ui } = this.props;
    let power = service.getPower();

    return _.map(Array.from(new Array(2 * power + 1), (value, index) =>
      index === 0 ? titleOfStartStep : 'Turn ' + _.ceil(index / 2) + ', Step ' + index
    ), (label, index) => {
      let turn = _.ceil(index / 2);
      let isLaterHalfTurn = index > 0 && index % 2 === 0;
      let numberCountInRow = index > 0 ? 2 ** (power - turn + 1) : 2 ** power;
      let containerWidth = (cardWidth + 28) * (isLaterHalfTurn ? numberCountInRow / 2 : numberCountInRow) + 10;
      return (
        <Step key={label}>
          <StepLabel><b>{label}</b></StepLabel>
          <StepContent>
            <div style={{ display: 'flex', flexWrap: 'wrap', width: containerWidth }}>
              {
                activeStepContent.length > 0 && _.map(activeStepContent[index], (row, rowIndex) => {// activeStepContent[index] is a three-dimension matrix
                  let rowCount = activeStepContent[index].length;

                  if (ui === UiConstants.style.GRAPHICS) {
                    return (
                      <Paper key={rowIndex} className={classes.pile}
                             style={{
                               display: 'flex',
                               width: '100%',
                             }}>
                        {
                          _.map(row, (column, colIndex) => {
                            return (
                              <Paper key={colIndex} className={classes.pile}
                                     style={{
                                       display: 'flex', flexDirection: 'column-reverse',
                                       width: 'calc(100%/' + rowCount + ')', // row count = column count
                                     }}>
                                {
                                  _.map(column, number => {
                                    let p = number - 1;// number starts from 1, but coordinate is from 0
                                    let y = _.floor(p / service.getRowCount());
                                    let x = p % service.getRowCount();

                                    return result.length === 1 ?
                                           (resultReset ?
                                              cards[0][number - 1] :
                                              cards[0][service.positionOf(number) - 1]) :
                                           cards[y][x];
                                  })
                                }
                              </Paper>
                            )
                          })
                        }
                      </Paper>
                    )
                  } else {
                    return (
                      <div key={rowIndex}
                           style={{
                             display: 'flex', justifyContent: 'space-around',
                             width: '100%',
                           }}>
                        {
                          _.map(row, (column, colIndex) =>
                            <div key={colIndex}
                                 style={{
                                   display: 'flex', flexDirection: 'column-reverse',
                                   margin: 10,
                                 }}>
                              {
                                _.map(column, number =>
                                  <span key={number}>{number}</span>
                                )
                              }
                            </div>
                          )
                        }
                      </div>
                    )
                  }
                })
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
                  {activeStep === 2 * power ? 'Finish' : 'Next'}
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

  /**
   * PRIVATE METHOD
   *
   * Generate repeat folding steps UI.
   */
  generateStepsReverse = (power, activeStep, services, colors, resultReset, stepNext, stepBack) => {
    const { classes, ui } = this.props;
    let containerWidth = (cardWidth + 28) * (2 ** power) + 10;
    let colorSet = _.reduce(colors, (accumulator, row) => accumulator.concat(row)); // colors of original matrix

    return _.map(services, (service, index) => {
      let label = '';
      switch (index) {
        case 0:
          label = 'Original Matrix';
          break;
        case 1:
          label = 'Result Matrix';
          break;
        default:
          label = 'Round ' + (index - 1) + (index === services.length - 1 ? ' (Back to the Original Matrix)' : '');
      }

      let result = service.init(); // a two-dimension array
      let actualColors = _.map(result, row => _.map(row, number => colorSet[number - 1])); // keep same color for each number
      let cards = this.generateCards(service, result, actualColors);
      let cardRows = this.generateCardRows(cards);
      let numberRows = this.generateNumberRows(power, result);

      return (
        <Step key={label}>
          <StepLabel><b>{label}</b></StepLabel>
          <StepContent>
            <div style={{ display: 'flex', flexDirection: 'column', width: containerWidth }}>
              {ui === UiConstants.style.GRAPHICS ? cardRows : numberRows}
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
                  {activeStep === services.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          </StepContent>
        </Step>
      );
    });
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
      reverseCount, activeStepReverse, servicesReverse
    } = this.state;

    // Options of values of power
    // Remember: `new Array(length)` never initializes itself actually! Must call fill() or from() to initialize it.
    let menus = Array.from(new Array(maxPower), (value, index) =>
      <MenuItem key={index + 1} value={index + 1}>{index + 1}</MenuItem>
    );

    let cards = this.generateCards(service, result, colors);
    let cardRows = this.generateCardRows(cards);
    let numberRows = this.generateNumberRows(power, result);

    let steps = this.generateSteps('Original Matrix', service, activeStep, activeStepContent, cards, result, resultReset, this.stepNext, this.stepBack);
    let stepsReverse = servicesReverse.length > 0 ? this.generateStepsReverse(power, activeStepReverse, servicesReverse, colors, resultReset, this.stepNextReverse, this.stepBackReverse) : null;

    return (
      <div className={classes.root}>
        <h2>Second Order Folding</h2>
        <p>{'Define a matrix \\([[1, 2, ..., 2^k], ... , [2^{2k-1}+1, ..., n]]\\), i.e., \\(\\left( \\begin{array}{ccc} 1 & 2 & \\ldots & 2^k \\\\ 2^k+1 & 2^k+2 & \\ldots & 2^{k+1} \\\\ \\vdots & \\vdots & \\ldots & \\vdots \\\\ 2^{2k-1}+1 & 2^{2k-1}+2 & \\ldots & n \\end{array} \\right)\\), and that \\(n = 4 ^ k\\), and compute the folding result.'}</p>

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
            <Tooltip title={'Enable to view more details' + (stepsReverse ? ' and REVERSE MAGIC!' : '')}>
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
            There are <b>{count}</b> numbers in total.<h3>{power === maxPower ? ' The matrix is really quite LARGE. Do you want to try indeed?' : ''}</h3>
          </div>
        </Paper>

        {/* Result View Pad */}
        <Paper className={classes.pad} elevation={1}>
          <h3>Result View</h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {ui === UiConstants.style.GRAPHICS ? cardRows : numberRows}
          </div>
        </Paper>

        {/* Formula View Pad */}
        <Paper className={classes.pad} elevation={1}
               style={{ display: algorithm === ServiceConstants.algorithm.FORMULA ? 'flex' : 'none', flexDirection: 'column' }}>
          <h3>Formula of Computing</h3>
          <p>\(P(1) = 1\)</p>
          <p>If \(x\) is <b>odd</b>, \(P(x+1)=4^k-P(x)+1\).</p>
          <p>If \(x\) is <b>even</b>, things are more complicated...</p>
          <p>If \(x\) is in a "<b>Regular Segment</b>":</p>
          <p>{'\\( P(x+1)=\\begin{cases}5\\times4^{k-1}-P(x)+1,&\\rm{2\\times4^{k-1}+1\\le P(x)\\le3\\times4^{k-1}}\\\\\\\\7\\times4^{k-1}-P(x)+1,&\\rm{3\\times4^{k-1}+1\\le P(x)\\le4\\times4^{k-1}}\\end{cases} \\)'}</p>
          <p></p>
          <p>{'\\( P(x+1)=\\begin{cases}5\\times4^{k-2}-P(x)+1,&\\rm{2\\times4^{k-2}+1\\le P(x)\\le3\\times4^{k-2}}\\\\\\\\7\\times4^{k-2}-P(x)+1,&\\rm{3\\times4^{k-2}+1\\le P(x)\\le4\\times4^{k-2}}\\\\\\\\9\\times4^{k-2}-P(x)+1,&\\rm{4\\times4^{k-2}+1\\le P(x)\\le5\\times4^{k-2}}\\\\\\\\11\\times4^{k-2}-P(x)+1,&\\rm{5\\times4^{k-2}+1\\le P(x)\\le6\\times4^{k-2}}\\end{cases} \\)'}</p>
          <p></p>
          <p>{'\\( P(x+1)=\\begin{cases}5\\times4^{k-3}-P(x)+1,&\\rm{2\\times4^{k-3}+1\\le P(x)\\le3\\times4^{k-3}}\\\\\\\\7\\times4^{k-3}-P(x)+1,&\\rm{3\\times4^{k-3}+1\\le P(x)\\le4\\times4^{k-3}}\\\\\\\\9\\times4^{k-3}-P(x)+1,&\\rm{4\\times4^{k-3}+1\\le P(x)\\le5\\times4^{k-3}}\\\\\\\\11\\times4^{k-3}-P(x)+1,&\\rm{5\\times4^{k-3}+1\\le P(x)\\le6\\times4^{k-3}}\\end{cases} \\)'}</p>
          <p>{'\\( P(x+1)=\\begin{cases}53\\times4^{k-3}-P(x)+1,&\\rm{26\\times4^{k-3}+1\\le P(x)\\le27\\times4^{k-3}}\\\\\\\\55\\times4^{k-3}-P(x)+1,&\\rm{27\\times4^{k-3}+1\\le P(x)\\le28\\times4^{k-3}}\\\\\\\\57\\times4^{k-3}-P(x)+1,&\\rm{28\\times4^{k-3}+1\\le P(x)\\le29\\times4^{k-3}}\\\\\\\\59\\times4^{k-3}-P(x)+1,&\\rm{29\\times4^{k-3}+1\\le P(x)\\le30\\times4^{k-3}}\\end{cases} \\)'}</p>
          <p></p>
          <p>{'\\( P(x+1)=\\begin{cases}5\\times4^{k-4}-P(x)+1,&\\rm{2\\times4^{k-4}+1\\le P(x)\\le3\\times4^{k-4}}\\\\\\\\7\\times4^{k-4}-P(x)+1,&\\rm{3\\times4^{k-4}+1\\le P(x)\\le4\\times4^{k-4}}\\\\\\\\9\\times4^{k-4}-P(x)+1,&\\rm{4\\times4^{k-4}+1\\le P(x)\\le5\\times4^{k-4}}\\\\\\\\11\\times4^{k-4}-P(x)+1,&\\rm{5\\times4^{k-4}+1\\le P(x)\\le6\\times4^{k-4}}\\end{cases} \\)'}</p>
          <p>{'\\( P(x+1)=\\begin{cases}53\\times4^{k-4}-P(x)+1,&\\rm{26\\times4^{k-4}+1\\le P(x)\\le27\\times4^{k-4}}\\\\\\\\55\\times4^{k-4}-P(x)+1,&\\rm{27\\times4^{k-4}+1\\le P(x)\\le28\\times4^{k-4}}\\\\\\\\57\\times4^{k-4}-P(x)+1,&\\rm{28\\times4^{k-4}+1\\le P(x)\\le29\\times4^{k-4}}\\\\\\\\59\\times4^{k-4}-P(x)+1,&\\rm{29\\times4^{k-4}+1\\le P(x)\\le30\\times4^{k-4}}\\end{cases} \\)'}</p>
          <p>{'\\( P(x+1)=\\begin{cases}197\\times4^{k-4}-P(x)+1,&\\rm{98\\times4^{k-4}+1\\le P(x)\\le99\\times4^{k-4}}\\\\\\\\199\\times4^{k-4}-P(x)+1,&\\rm{99\\times4^{k-4}+1\\le P(x)\\le100\\times4^{k-4}}\\\\\\\\201\\times4^{k-4}-P(x)+1,&\\rm{100\\times4^{k-4}+1\\le P(x)\\le101\\times4^{k-4}}\\\\\\\\203\\times4^{k-4}-P(x)+1,&\\rm{101\\times4^{k-4}+1\\le P(x)\\le102\\times4^{k-4}}\\end{cases} \\)'}</p>
          <p>{'\\( P(x+1)=\\begin{cases}245\\times4^{k-4}-P(x)+1,&\\rm{122\\times4^{k-4}+1\\le P(x)\\le123\\times4^{k-4}}\\\\\\\\247\\times4^{k-4}-P(x)+1,&\\rm{123\\times4^{k-4}+1\\le P(x)\\le124\\times4^{k-4}}\\\\\\\\249\\times4^{k-4}-P(x)+1,&\\rm{124\\times4^{k-4}+1\\le P(x)\\le125\\times4^{k-4}}\\\\\\\\251\\times4^{k-4}-P(x)+1,&\\rm{125\\times4^{k-4}+1\\le P(x)\\le126\\times4^{k-4}}\\end{cases} \\)'}</p>
          <p>\( ...... \)</p>
          <p>Otherwise \(x\) is in a "<b>Non-regular Segment</b>".</p>
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
          <div>
            Number <Input className={classes.textField} type={'number'} value={number} onChange={this.positionOfNumber} /> is in position <span style={{ color: 'red', fontWeight: 'bolder', fontSize: 32 }}>{service.positionOf(number)}</span>.
          </div>
          <div>
            Number in position <Input className={classes.textField} type={'number'} value={position} onChange={this.numberOfPosition} /> is <span style={{ color: 'blue', fontWeight: 'bolder', fontSize: 32 }}>{service.valueOf(position)}</span>.
          </div>
          {stepsReverse && (
          <FormControlLabel
            control={
              <Switch checked={showFoldingReverse} onChange={this.toggleFoldingReverse} color="primary" />
            }
            label="Watch what happens when folding the result matrix (Only support k=1 to 3)"
          />
          )}
        </Paper>
        )}

        {/* Reverse Folding Steps View Pad */}
        {exploreMore && showFoldingReverse && !resultReset && stepsReverse && (
        <Paper className={classes.pad} elevation={1}>
          <h3>Steps of Reverse Folding</h3>
          <p>Now you can try to align the final sequence into a square matrix, and fold the matrix with the same steps. Then wait and observe the magic result!</p>
          <div>
            There are <span style={{ color: 'red', fontWeight: 'bolder', fontSize: 32 }}>{reverseCount}</span> rounds in total.
          </div>
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

SecondOrderFolding.propTypes = {
  classes: PropTypes.object.isRequired,
  algorithm: PropTypes.string.isRequired,
  ui: PropTypes.string.isRequired
};

export default withStyles(styles)(SecondOrderFolding);
