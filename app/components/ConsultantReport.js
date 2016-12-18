import React from 'react';
import { connect } from 'react-redux';
import Report from './Report';
import { fetchReportStatistics, fetchReportAnswers, fetchReportUser } from '../actions/report';
import ExportPanel from './ExportPanel';

class ConsultantReport extends React.Component {
  componentDidMount() {
    const id = this.props.params.id;
    this.props.dispatch(fetchReportAnswers('consultant', id));
    this.props.dispatch(fetchReportStatistics('consultant', id));
    this.props.dispatch(fetchReportUser(id));
  }

  render() {
    return (
      <div className="container">
        <ExportPanel entityType="consultant" id={this.props.params.id} />
        <Report
          user={this.props.user}
          reports={this.props.reports}
          statistics={this.props.statistics}
        />
      </div>
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
)(ConsultantReport);


