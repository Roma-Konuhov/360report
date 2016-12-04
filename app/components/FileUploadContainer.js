import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileUploader from './FileUploader';
import Display from './Display';
import { fetchRevieweesByConsultants } from '../actions/revieweesByConstultants';
import { fetchRevieweesByManagers } from '../actions/revieweesByManagers';
import { fetchPeopleRelations } from '../actions/peopleRelations';
import { fetchUsers } from '../actions/users';
import { resetFileUploader } from '../actions/fileUploader';


class FileUploadContainer extends Component {
  componentWillUpdate(nextProps) {
    this.props.dispatch(resetFileUploader());
    switch (nextProps.uploader.fileUploaded) {
      case 'people_relations':
        this.props.dispatch(fetchPeopleRelations());
        break;
      case 'manager_report':
        this.props.dispatch(fetchRevieweesByManagers());
        break;
      case 'consultant_report':
        return this.props.dispatch(fetchRevieweesByConsultants());
        break;
      case 'users':
        this.props.dispatch(fetchUsers());
        break;
    }
  }

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

const mapStateOnProps = (state) => {
  return {
    uploader: state.uploader
  }
};

export default connect(mapStateOnProps)(FileUploadContainer);