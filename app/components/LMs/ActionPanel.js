import React from 'react';
import PublishAllButton from '../PublishAllButton';


class ActionPanel extends React.Component {
  render() {
    return (
      <div className="export-panel block">
        <PublishAllButton {...this.props} />
      </div>
    );
  }
}

export default ActionPanel;
