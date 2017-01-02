import React from 'react';
import ExportButtons from './ExportButtons';
import PublishButton from './PublishButton';


class ActionPanel extends React.Component {
  render() {
    return (
      <div className="export-panel block">
        <ExportButtons {...this.props} />
        <PublishButton {...this.props} />
      </div>
    );
  }
}

export default ActionPanel;
