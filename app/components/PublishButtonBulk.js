import React from 'react';
import { connect } from 'react-redux';
import {
  publishReportBulk,
} from '../actions/reportPublish';


class PublishButtonBulk extends React.Component {
  publishReportBulk(e) {
    e.preventDefault();
    e.stopPropagation();
    const message = `You are about to publish reports for all subordinates of the Line Manager. Do you want to confirm this action?`;
    if (confirm(message)) {
      this.props.publishReportBulk(this.props.id);
    }
  }

  render() {
    return (
      <div className="export-buttons">
        <button className="btn btn-secondary" onClick={this.publishReportBulk.bind(this)}>Publish bulk</button>
      </div>
    );
  }
}

PublishButtonBulk.propTypes = {
  id: React.PropTypes.string.isRequired,
  entityType: React.PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  publishReportBulk: (id) => dispatch(publishReportBulk(id)),
});

export default connect(null,
  mapDispatchToProps
)(PublishButtonBulk);
