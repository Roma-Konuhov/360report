import React from 'react';
import { connect } from 'react-redux';
import {
  emailReport,
} from '../actions/reportEmail';


class EmailButtons extends React.Component {
  exportToPdf(e) {
    e.preventDefault();
    e.stopPropagation();
    const message = `You are about to send an email with report to ${this.props.user.name}'s Line Manager. Do you want to confirm this action?`;
    if (confirm(message)) {
      this.props.emailReport(this.props.id);
    }
  }

  render() {
    return (
      <div className="export-buttons">
        <button className="btn btn-secondary" onClick={this.exportToPdf.bind(this)}>Send to LM</button>
      </div>
    );
  }
}

EmailButtons.propTypes = {
  id: React.PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.report.user
});

const mapDispatchToProps = (dispatch) => ({
  emailReport: (entityType, id) => dispatch(emailReport(entityType, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailButtons);
