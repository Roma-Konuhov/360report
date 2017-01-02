import React from 'react';
import { connect } from 'react-redux';
import {
  publishReport,
} from '../actions/reportPublish';


class PublishButtons extends React.Component {
  publishReport(e) {
    e.preventDefault();
    e.stopPropagation();
    const message = `You are about to publish report to ${this.props.user.name}'s Line Manager. Do you want to confirm this action?`;
    if (confirm(message)) {
      this.props.publishReport(this.props.id);
    }
  }

  render() {
    return (
      <div className="export-buttons">
        <button className="btn btn-secondary" onClick={this.publishReport.bind(this)}>Publish</button>
      </div>
    );
  }
}

PublishButtons.propTypes = {
  id: React.PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.report.user
});

const mapDispatchToProps = (dispatch) => ({
  publishReport: (entityType, id) => dispatch(publishReport(entityType, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishButtons);
