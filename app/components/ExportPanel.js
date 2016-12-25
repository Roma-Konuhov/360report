import
  React from 'react';
import ExportButtons from './ExportButtons';
import EmailButton from './EmailButton';


class ExportPanel extends React.Component {
  render() {
    return (
      <div className="export-panel">
        <ExportButtons {...this.props} />
        <EmailButton {...this.props} />
      </div>
    );
  }
}

export default ExportPanel;
