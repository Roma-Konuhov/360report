import React from 'react';
import { connect } from 'react-redux';
import {
  exportReportToPdf,
} from '../actions/reportExport';


class ExportButtons extends React.Component {
  exportToPdf(e) {
    e.preventDefault();
    e.stopPropagation();
    const { entityType, id } = this.props;
    this.props.exportToPdf(entityType, id);
  }

  render() {
    return (
      <div className="export-buttons">
        <button className="btn btn-secondary" onClick={this.exportToPdf.bind(this)}>Export PDF</button>
      </div>
    );
  }
}

ExportButtons.propTypes = {
  id: React.PropTypes.string.isRequired,
  entityType: React.PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  exportToPdf: (entityType, id) => dispatch(exportReportToPdf(entityType, id)),
});

export default connect(null,
  mapDispatchToProps
)(ExportButtons);
