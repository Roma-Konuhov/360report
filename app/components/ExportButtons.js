import React from 'react';
import { connect } from 'react-redux';
import {
  exportReportToPdf,
  exportReportToPng,
} from '../actions/reportExport';


class ExportButtons extends React.Component {
  exportToPdf(e) {
    e.preventDefault();
    const { entityType, id } = this.props;
    this.props.exportToPdf(entityType, id);
  }

  exportToPng(e) {
    e.preventDefault();
    const { entityType, id } = this.props;
    this.props.exportToPng(entityType, id);
  }

  render() {
    return (
      <div className="export-buttons">
        <button className="btn btn-secondary" to="/export-pdf" onClick={this.exportToPdf.bind(this)}>Export PDF</button>
        <button className="btn btn-secondary" to="/export-pdf" onClick={this.exportToPng.bind(this)}>Export PNG</button>
      </div>
    );
  }
}

ExportButtons.propTypes = {
  id: React.PropTypes.number.isRequired,
  entityType: React.PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  exportToPdf: (entityType, id) => dispatch(exportReportToPdf(entityType, id)),
  exportToPng: (entityType, id) => dispatch(exportReportToPng(entityType, id))
});

export default connect(null,
  mapDispatchToProps
)(ExportButtons);
