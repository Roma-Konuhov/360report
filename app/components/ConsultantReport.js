import React from 'react';
import { connect } from 'react-redux';
import Report from './Report';
import { fetchReportSuggestions, fetchReportStatistics, fetchReportAnswers, fetchReportUser } from '../actions/report';
import ActionPanel from './ActionPanel';

class ConsultantReport extends React.Component {
  componentDidMount() {
    const id = this.props.params.id;
    this.props.dispatch(fetchReportAnswers('consultant', id));
    this.props.dispatch(fetchReportStatistics('consultant', id));
    this.props.dispatch(fetchReportSuggestions('consultant', id));
    this.props.dispatch(fetchReportUser(id));
  }

  render() {
    return (
      <div className="container">
        <ActionPanel entityType="consultant" id={this.props.params.id} />
        <Report
          user={this.props.user}
          reports={this.props.reports}
          statistics={this.props.statistics}
          suggestions={this.props.suggestions}
        />
      </div>
    );
  }
}

const mapStateOnProps = (state) => {
  return {
    reports: state.report.answers,
    statistics: state.report.statistics,
    suggestions: state.report.suggestions,
    user: state.report.user
  }
};

export default connect(
  mapStateOnProps
)(ConsultantReport);


