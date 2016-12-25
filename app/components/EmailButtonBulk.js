import React from 'react';
import { connect } from 'react-redux';
import {
  emailReportBulk,
} from '../actions/reportEmail';


class EmailButtonBulk extends React.Component {
  emailReportBulk(e) {
    e.preventDefault();
    e.stopPropagation();
    const message = `You are about to send an email with reports for all subordinates to the Line Manager. Do you want to confirm this action?`;
    if (confirm(message)) {
      this.props.emailReportBulk(this.props.id);
    }
  }

  render() {
    return (
      <div className="export-buttons">
        <button className="btn btn-secondary" onClick={this.emailReportBulk.bind(this)}>Send bulk to LM</button>
      </div>
    );
  }
}

EmailButtonBulk.propTypes = {
  id: React.PropTypes.string.isRequired,
  entityType: React.PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  emailReportBulk: (id) => dispatch(emailReportBulk(id)),
});

export default connect(null,
  mapDispatchToProps
)(EmailButtonBulk);
