import React, { Component } from 'react';
import ExportButtons from '../ExportButtons';

class CellWithDetails extends Component {
  render() {
    const { columns, row, className } = this.props;

    return (
      <td className={className || ''} colSpan={'' + columns.length}>
        <div className="subordinates">
          {row.subordinate_names.map((name, idx) =>
            <div className="subordinate" key={`subordinate-${idx}`}>
              <span className="name">{name}</span>
              <div className="export-buttons-wrapper">
                <ExportButtons id={row.subordinate_ids[idx]} entityType="consultant"/>
                <ExportButtons id={row.subordinate_ids[idx]} entityType="manager"/>
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