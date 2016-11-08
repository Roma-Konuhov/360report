import React, { Component } from 'react';
import FileUploader from './FileUploader';

class FileUploadContainer extends Component {
  render() {
    return (
      <div id="file-upload-container">
        <FileUploader label="Consultant report (csv file)" name="consultant_report" {...this.props} />
        <FileUploader label="Manager report (csv file)" name="manager_report" {...this.props} />
        <FileUploader label="People relations (csv file)" name="people_relations" {...this.props} />
      </div>
    );
  }
}

export default FileUploadContainer;