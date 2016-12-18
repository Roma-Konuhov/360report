import React from 'react';
import { connect } from 'react-redux';
import {
  exportReportBulkToPdf,
  exportReportBulkToPng,
} from '../actions/reportExport';


class ExportButtons extends React.Component {
  exportToPdf(e) {
    e.preventDefault();
    e.stopPropagation();
    const { entityType, id } = this.props;
    this.props.exportToPdf(entityType, id);
  }

  exportToPng(e) {
    e.preventDefault();
    e.stopPropagation();
    const { entityType, id } = this.props;
    this.props.exportToPng(entityType, id);
  }

  render() {
    return (
      <div className="export-buttons">
        <button className="btn btn-secondary" onClick={this.exportToPdf.bind(this)}>Export bulk PDF</button>
        <button className="btn btn-secondary" onClick={this.exportToPng.bind(this)}>Export bulk PNG</button>
      </div>
    );
  }
}

ExportButtons.propTypes = {
  id: React.PropTypes.string.isRequired,
  entityType: React.PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  exportToPdf: (entityType, id) => dispatch(exportReportBulkToPdf(entityType, id)),
  exportToPng: (entityType, id) => dispatch(exportReportBulkToPng(entityType, id))
});

export default connect(null,
  mapDispatchToProps
)(ExportButtons);
