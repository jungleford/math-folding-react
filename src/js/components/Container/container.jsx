import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import {Constants as ServiceConstants} from '@jungleford/math-folding/src/js';
import UiConstants from '../../utils/constants';
import FirstOrderFolding from '../FirstOrderFolding';
import SecondOrderFolding from '../SecondOrderFolding';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3, backgroundColor: '#FFFFFF' }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '80%',
  },
  view: {
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
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class Container extends React.Component {
  state = {
    tab: 0,
    algorithm: ServiceConstants.algorithm.RECURSIVE,
    ui: UiConstants.style.CHARACTER
  };

  handleDropdownChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleTabChange = (event, tab) => {
    this.setState({ tab });
  };

  render() {
    const { classes } = this.props;
    const { tab, algorithm, ui } = this.state;

    let algMenus = [], uiMenus = [];

    _.each(ServiceConstants.algorithm, alg => {
      algMenus.push(<MenuItem key={alg} value={alg}>{alg}</MenuItem>);
    });

    _.each(UiConstants.style, ui => {
      uiMenus.push(<MenuItem key={ui} value={ui}>{ui}</MenuItem>);
    });

    return (
      <div className={classes.root}>
        <Paper className={classes.view} square>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="algorithm">Algorithm</InputLabel>
            <Select
              value={algorithm}
              onChange={this.handleDropdownChange}
              inputProps={{
                name: 'algorithm',
                id: 'algorithm',
              }}
            >
              {algMenus}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="ui">UI Style</InputLabel>
            <Select
              value={ui}
              onChange={this.handleDropdownChange}
              inputProps={{
                name: 'ui',
                id: 'ui',
              }}
            >
              {uiMenus}
            </Select>
          </FormControl>
        </Paper>

        <Paper square>
          <Tabs value={tab}
                indicatorColor="primary"
                textColor="primary"
                onChange={this.handleTabChange}>
            <Tooltip title="1st Order Folding">
              <Tab label="FOF" />
            </Tooltip>
            <Tooltip title="2nd Order Folding">
              <Tab label="SOF" />
            </Tooltip>
          </Tabs>
        </Paper>
        {tab === 0 && <TabContainer><FirstOrderFolding algorithm={algorithm} ui={ui} /></TabContainer>}
        {tab === 1 && <TabContainer><SecondOrderFolding algorithm={algorithm} ui={ui} /></TabContainer>}
      </div>
    );
  }
}

Container.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Container);