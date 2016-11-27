import React from 'react';
import { fetch } from '../helpers/ajax';
import Report from './Report';

class ConsultantReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
      statistics: []
    };
  }

  loadReports() {
    var id = this.props.params.id;

    return fetch(`/consultant/report/${id}`).then(reports => {
      this.setState({ reports: reports });
    }, reason => {
      //console.log(reason);
    });
  }

  loadStatisctics() {
    var id = this.props.params.id;

    return fetch(`/consultant/statistics/${id}`).then(statistics => {
      this.setState({ statistics: statistics });
    }, reason => {
      //console.log(reason);
    });
  }

  componentDidMount() {
    this.loadReports();
    this.loadStatisctics();
  }

  render() {
    return (
      <Report
        userId={this.props.params.id}
        reports={this.state.reports}
        statistics={this.state.statistics}
      />
    );
  }
}

export default ConsultantReport;


