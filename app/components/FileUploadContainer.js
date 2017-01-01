import React, { Component } from 'react';
import FileUploader from './FileUploader';
import Display from './Display';
import { DropdownButton, MenuItem } from 'react-bootstrap';

class FileUploadContainer extends Component {
  constructor(props) {
    super(props);

    this.companies = [{
      title: 'Cogniance',
      value: 'Cogniance',
    }, {
      title: 'CloudMade',
      value: 'CloudMade',
    }];

    this.state = {
      company: this.companies[0]
    }
  }

  handleCompanySelect(value) {
    this.setState({ company: this.companies[value]});
  }

  render() {
    const uniqueId = `unique-hash-${+new Date()}`;
    const props = Object.assign({}, this.props, this.state);

    return (
      <div>
        <div className="file-upload-container">
          <div className="company-chooser">
            <label>Company</label>
            <DropdownButton title={this.state.company.title} bsStyle="default" key={uniqueId} id={uniqueId} onSelect={(value) => this.handleCompanySelect(value)}>
              <MenuItem eventKey="0">Cogniance</MenuItem>
              <MenuItem eventKey="1">Cloudmade</MenuItem>
            </DropdownButton>
          </div>
          <div className="clear" />
        </div>
        <div className="file-upload-container">
          <Display if={this.props.peopleRelations} nowrap="true">
            <FileUploader label="Consultant report (csv file)" name="consultant_report" { ...props } />
          </Display>
          <Display if={this.props.peopleRelations} nowrap="true">
            <FileUploader label="Manager report (csv file)" name="manager_report" { ...props } />
          </Display>
          <Display if={this.props.users} nowrap="true">
            <FileUploader label="People relations (csv file)" name="people_relations" { ...props } />
          </Display>
          <FileUploader label="Users names and emails (csv file)" name="users" { ...props } />
          <div className="clear" />
        </div>
      </div>
    );
  }
}

export default FileUploadContainer;