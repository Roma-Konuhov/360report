import React from 'react';
import { connect } from 'react-redux';
import Report from './Report';
import { fetchReportStatistics, fetchReportAnswers, fetchReportUser } from '../actions/report';

class ManagerReport extends React.Component {
  componentDidMount() {
    var id = this.props.params.id;
    this.props.dispatch(fetchReportAnswers('manager', id));
    this.props.dispatch(fetchReportStatistics('manager', id));
    this.props.dispatch(fetchReportUser(id));
  }

  render() {
    return (
      <Report
        user={this.props.user}
        reports={this.props.reports}
        statistics={this.props.statistics}
      />
    );
  }
}

const mapStateOnProps = (state) => {
  return {
    reports: state.report.answers,
    statistics: state.report.statistics,
    user: state.report.user
  }
};

export default connect(
  mapStateOnProps
)(ManagerReport);


