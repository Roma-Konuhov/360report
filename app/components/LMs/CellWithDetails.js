import React, { Component } from 'react';
import ExportPdfButton from '../ExportPdfButton';
import PublishButton from '../PublishButton';

class CellWithDetails extends Component {
  render() {
    const { columns, row, className } = this.props;
    const numberOfFixedColumns = 2;

    return (
      <td className={className || ''} colSpan={columns.length + numberOfFixedColumns}>
        <div className="subordinates">
          {row.subordinate_names.map((name, idx) =>
            <div className="subordinate" key={`subordinate-${idx}`}>
              <span className="name">{name}</span>
              <div className="export-buttons-wrapper">
                <span>
                  <label>Consultant report</label>
                  <ExportPdfButton id={row.subordinate_ids[idx]} entityType="consultant" />
                </span>
                <span>
                  <label>Manager report</label>
                  <ExportPdfButton id={row.subordinate_ids[idx]} entityType="manager" />
                </span>
                <span>
                  <label>Publish on Google Drive</label>
                  <PublishButton id={row.subordinate_ids[idx]} />
                </span>
              </div>
            </div>
          )}
        </div>
      </td>
    );
  }
}

CellWithDetails.propTypes = {
  className: React.PropTypes.string,
  columns: React.PropTypes.array,
  row: React.PropTypes.object
};

export default CellWithDetails;
export { CellWithDetails as BaseCell };