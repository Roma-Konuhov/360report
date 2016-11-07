import React from 'react';
import Display from './Display';

class FileUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      filename: 'No file',
      loaded: false,
      error: false
    }
  }

  upload(fieldname, file) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      var formData = new FormData();
      formData.append(fieldname, file);

      xhr.open("POST", "/upload", true);
      xhr.onload = xhr.onerror = function() {
        if (this.status == 200) {
          resolve();
        } else {
          reject();
        }
      };
      xhr.send(formData);
    });
  }

  handleChange(e) {
    const self = this;

    this.setState({ loading: true, filename: e.target.files[0].name });
    this.upload(e.target.name, e.target.files[0])
      .then(() => {
        self.setState({ loaded: true, loading: false,  filename: 'No file' });
      })
      .catch(() => {
        self.setState({ error: true, loading: false,  filename: 'No file' });
      });
  }

  render() {
    return (
      <div className="file-uploader col-sm-6">
        <form action={this.props.url} encType="multipart/form-data" method="post">
          <label>{this.props.label}</label>
          <Display if={this.state.loaded} inline="true">
            <label className="notification success">File has loaded</label>
          </Display>
          <input className="filestyle" type="file" name="file" onChange={this.handleChange.bind(this)} accept=".csv" />
        </form>
      </div>
    );
  }
}

FileUploader.defaultProps = {
  url: '/upload',
  label: 'File'
};

export default FileUploader;