import React, { Component } from 'react';
import FileUploader from './FileUploader';
import Display from './Display';

class FileUploadContainer extends Component {
  render() {
    return (
      <div id="file-upload-container">
        <Display if={this.props.peopleRelations} nowrap="true">
          <FileUploader label="Consultant report (csv file)" name="consultant_report" {...this.props} />
        </Display>
        <Display if={this.props.peopleRelations} nowrap="true">
          <FileUploader label="Manager report (csv file)" name="manager_report" {...this.props} />
        </Display>
        <Display if={this.props.users} nowrap="true">
          <FileUploader label="People relations (csv file)" name="people_relations" {...this.props} />
        </Display>
        <FileUploader label="Users names and emails (csv file)" name="users" {...this.props} />
      </div>
    );
  }
}

export default FileUploadContainer;