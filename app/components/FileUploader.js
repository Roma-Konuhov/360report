import React from 'react';
import Display from './Display';

class FileUploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      filename: 'No file',
      loaded: false,
      error: false,
      timer: true
    };
  }

  upload(fieldname, file) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      var formData = new FormData();
      formData.append(fieldname, file);

      xhr.open("POST", "/upload", true);
      xhr.onload = xhr.onerror = function() {
        try {
          var result = JSON.parse(xhr.response);
        } catch(e) {
          return reject();
        }
        if (this.status == 200) {
          if (result.status === 'ok') {
            return resolve(result.data);
          } else {
            return reject(result.message);
          }
        } else {
          return reject(result.message);
        }
      };
      xhr.send(formData);
    });
  }

  componentDidMount() {
    // reinitializing of bootstrap filestyle plugin
    $(':file').filestyle();
  }

  handleChange(e) {
    const self = this;
    const target = e.target;

    this.setState({ loading: true, filename: e.target.files[0].name, timer: true });
    this.upload(e.target.name, e.target.files[0])
      .then(() => {
        target.value = '';
        self.setState({ loaded: true, loading: false,  filename: 'No file'});
        setTimeout(() => {
          this.setState({ timer: false });
        }, 4000);
      })
      .catch(() => {
        target.value = '';
        self.setState({ error: true, loading: false,  filename: 'No file' });
      });
  }

  render() {
    return (
      <div className="file-uploader col-sm-4">
        <form action={this.props.url} encType="multipart/form-data" method="post">
          <label>{this.props.label}</label>
          <Display if={this.state.loaded && this.state.timer} inline="true">
            <label className="notification success fade-out">File has loaded</label>
          </Display>
          <input className="filestyle" type="file" name={this.props.name} onChange={this.handleChange.bind(this)} accept=".csv" />
        </form>
      </div>
    );
  }
}

FileUploader.defaultProps = {
  url: '/upload',
  label: 'File',
  name: 'file'
};

export default FileUploader;