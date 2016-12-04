import React from 'react';
import { connect } from 'react-redux';
import { fileUploader } from '../actions/fileUploader';

class FileUploader extends React.Component {
  componentDidMount() {
    // reinitializing of bootstrap filestyle plugin
    $(':file').filestyle();
  }

  render() {
    const { url, label, name, handleChange } = this.props;

    return (
      <div className="file-uploader col-sm-3">
        <form action={url} encType="multipart/form-data" method="post">
          <label>{label}</label>
          <input className="filestyle" type="file" name={name} onChange={handleChange} accept=".csv" />
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

const mapStateOnProps = () => {
  return {}
};

const mapDispatchOnProps = (dispatch) => {
  return {
    handleChange: (e) => {
      var formData = new FormData();
      formData.append(e.target.name, e.target.files[0]);
      dispatch(fileUploader(formData, e.target.name));
      e.target.value = '';
    }
  }
};

export default connect(
  mapStateOnProps,
  mapDispatchOnProps
)(FileUploader);