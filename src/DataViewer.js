import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import React, { Component } from 'react';
import ReactJson from 'react-json-view'
import Typography from '@material-ui/core/Typography';
import firebase from 'firebase';
import Paper from 'material-ui/Paper';

const DB_STATE = Object.freeze({
  UNINITIALIZED: 0,
  LOADING: 1,
  LOADED: 2,
});

class DatabaseViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      db_state: DB_STATE.UNINITIALIZED,
      data: null,
    };
  }

  handleExpanded(expanded) {
    if (expanded) {
      switch (this.state.db_state) {
        case DB_STATE.UNINITIALIZED:
          this.setState({ db_state: DB_STATE.LOADING });
          firebase.database().ref("/").once("value", (snapshot) => {
            // Check if user data firebase download is done yet.
            var db_state = this.state.user_data === null
                ? DB_STATE.LOADING : DB_STATE.LOADED;
            this.setState({
              db_state: db_state,
              data: snapshot.val(),
            });
          });
          break;
        case DB_STATE.LOADING:  // Fall through.
        case DB_STATE.LOADED:
          break;
        default:
          console.error("Invalid DB state", this.state.db_state);
      }
    }
  }

  renderDatabaseViewer() {
    switch (this.state.db_state) {
      case DB_STATE.UNINITIALIZED:  // Fall through.
      case DB_STATE.LOADING:
        return <Typography>Loading...</Typography>;
      case DB_STATE.LOADED:
        return (
            <ReactJson
                name="/"
                collapsed={1}
                src={{
                    data: this.state.data,
                }} />
        );
      default:
        console.error("Invalid DB state", this.state.db_state);
    }
  }

  render() {
    return (
      <Paper className="Container">  
        <ExpansionPanel
            style={{boxShadow: 'none'}}
            disabled={this.props.disabled}
            onChange={(e, expanded) => this.handleExpanded(expanded)}>

            <ExpansionPanelSummary
                style={{paddingLeft: 0}}
                expandIcon={<ExpandMoreIcon />}>
            <Typography>
                Expand to see JSON view of entire question database
            </Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails
                style={{display: 'block', paddingLeft: 0, textAlign: 'left'}}>
            {this.renderDatabaseViewer()}
            </ExpansionPanelDetails>

        </ExpansionPanel>
      </Paper>
    );
  }
}

export default DatabaseViewer;

