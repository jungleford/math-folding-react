import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Constants from '../../utils/constants';
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
    algorithm: Constants.ALGORITHM_RECURCIVE,
    ui: Constants.UI_CHARACTER
  };

  handleDropdownChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleTabChange = (event, tab) => {
    this.setState({ tab });
  };

  render() {
    const { classes } = this.props;
    const { tab } = this.state;

    let algMenus = [], uiMenus = [];

    algMenus.push(<MenuItem key={0} value={Constants.ALGORITHM_RECURCIVE}>{Constants.ALGORITHM_RECURCIVE}</MenuItem>);

    uiMenus.push(<MenuItem key={0} value={Constants.UI_CHARACTER}>{Constants.UI_CHARACTER}</MenuItem>);
    uiMenus.push(<MenuItem key={1} value={Constants.UI_GRAPHICS}>{Constants.UI_GRAPHICS}</MenuItem>);

    return (
      <div className={classes.root}>
        <Paper className={classes.view} square>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="algorithm">Algorithm</InputLabel>
            <Select
              value={this.state.algorithm}
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
              value={this.state.ui}
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
            <Tab label="First Order Folding" />
            <Tab label="Second Order Folding" />
          </Tabs>
        </Paper>
        {tab === 0 && <TabContainer><FirstOrderFolding algorithm={this.state.algorithm} ui={this.state.ui} /></TabContainer>}
        {tab === 1 && <TabContainer><SecondOrderFolding algorithm={this.state.algorithm} ui={this.state.ui} /></TabContainer>}
      </div>
    );
  }
}

Container.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Container);