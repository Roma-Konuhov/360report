import React from 'react';
import { connect } from 'react-redux';
import Report from './Report';
import { fetchReportAnswers } from '../actions/reportAnswers';
import { fetchReportStatistics } from '../actions/reportStatistics';

class ConsultantReport extends React.Component {
  componentDidMount() {
    const id = this.props.params.id;
    this.props.dispatch(fetchReportAnswers('consultant', id));
    this.props.dispatch(fetchReportStatistics('consultant', id));
  }

  render() {
    return (
      <Report
        userId={this.props.params.id}
        reports={this.props.reports}
        statistics={this.props.statistics}
      />
    );
  }
}

const mapStateOnProps = (state) => {
  return {
    reports: state.report.answers,
    statistics: state.report.statistics
  }
};

export default connect(
  mapStateOnProps
)(ConsultantReport);


