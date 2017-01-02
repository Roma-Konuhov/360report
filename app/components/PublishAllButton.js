import React from 'react';
import { connect } from 'react-redux';
import {
  publishAllReports,
} from '../actions/reportPublish';


class PublishAllButton extends React.Component {
  publishAllReports(e) {
    e.preventDefault();
    e.stopPropagation();
    const message = `You are about to publish reports for all subordinates of all Line Managers. Do you want to confirm this action?`;
    if (confirm(message)) {
      this.props.publishAllReports(this.props.id);
    }
  }

  render() {
    return (
      <div className="export-buttons">
        <button className="btn btn-secondary" onClick={this.publishAllReports.bind(this)}>Publish all reports</button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  publishAllReports: () => dispatch(publishAllReports()),
});

export default connect(null,
  mapDispatchToProps
)(PublishAllButton);
