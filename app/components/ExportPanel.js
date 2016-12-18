import React from 'react';
import ExportButtons from './ExportButtons';


class ExportPanel extends React.Component {
  render() {
    return (
      <div className="export-panel">
        <ExportButtons {...this.props} />
      </div>
    );
  }
}

export default ExportPanel;
